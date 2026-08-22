"""
Coordinate Harmonization & Data Preprocessing Pipeline
======================================================
Normalizes coordinates to standard lunar frames, enforces physical boundaries,
handles missingness with indicators, and prepares clean training matrices.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

class LunarPreprocessor:
    def __init__(self, target_coord_frame="standard_180"):
        self.target_coord_frame = target_coord_frame
        self.scaler = None
        self.label_encoder = None
        self.feature_columns = []
        self.target_column = "suitability_score"
        self.class_column = "is_viable_site"
        self.fitted = False

    @staticmethod
    def normalize_coordinates(df, lat_col="latitude_deg", lon_col="longitude_deg"):
        """
        Normalizes Latitude to [-90, 90] and Longitude to [-180, 180].
        """
        df = df.copy()
        if lat_col in df.columns:
            df[lat_col] = np.clip(df[lat_col], -90.0, 90.0)
            
        if lon_col in df.columns:
            # Convert [0, 360] longitude to [-180, 180]
            df[lon_col] = np.where(df[lon_col] > 180.0, df[lon_col] - 360.0, df[lon_col])
            df[lon_col] = np.where(df[lon_col] < -180.0, df[lon_col] + 360.0, df[lon_col])
        return df

    @staticmethod
    def enforce_physical_boundaries(df):
        """
        Filters physically impossible or corrupt sensor observations.
        """
        df = df.copy()
        n_before = len(df)
        
        if "slope_deg" in df.columns:
            df = df[(df["slope_deg"] >= 0.0) & (df["slope_deg"] <= 90.0)]
        if "annual_illumination_pct" in df.columns:
            df = df[(df["annual_illumination_pct"] >= 0.0) & (df["annual_illumination_pct"] <= 100.0)]
        if "ice_prob" in df.columns:
            df = df[(df["ice_prob"] >= 0.0) & (df["ice_prob"] <= 1.0)]
        if "earth_vis_pct" in df.columns:
            df = df[(df["earth_vis_pct"] >= 0.0) & (df["earth_vis_pct"] <= 100.0)]
        if "max_temp_k" in df.columns and "min_temp_k" in df.columns:
            df = df[(df["max_temp_k"] >= 20.0) & (df["min_temp_k"] >= 20.0)]
            df = df[df["min_temp_k"] <= df["max_temp_k"]]
            
        n_filtered = n_before - len(df)
        if n_filtered > 0:
            print(f"[*] Physical Boundary Filter: Cleaned {n_filtered} anomalous sensor readings.")
        return df

    def fit_transform_training_data(self, df, feature_cols, target_reg="suitability_score", target_cls="zone_class"):
        """
        Fits preprocessing parameters strictly on training split to prevent leakage.
        """
        df = self.normalize_coordinates(df)
        df = self.enforce_physical_boundaries(df)
        
        self.feature_columns = list(feature_cols)
        
        # 1. Check Missingness and add missing indicators if necessary
        X = df[self.feature_columns].copy()
        for col in self.feature_columns:
            if X[col].isnull().sum() > 0:
                X[f"{col}_missing"] = X[col].isnull().astype(int)
                median_val = X[col].median()
                X[col].fillna(median_val, inplace=True)
                
        # 2. Extract targets
        y_reg = df[target_reg].values if target_reg in df.columns else None
        
        # Binary Viability Classification Target (1 = Viable Habitat/Infra Node, 0 = Hazard/Exclusion)
        if target_cls in df.columns:
            # Optimal Habitat, Mining, Solar, Spaceport -> Viable (1); Hazard / Exclusion -> 0
            y_cls = np.where(
                df[target_cls].str.contains("Hazard|Exclusion", case=False, na=False) | (df[target_reg] < 40.0),
                0, 1
            )
        else:
            y_cls = np.where(y_reg >= 60.0, 1, 0) if y_reg is not None else None
            
        self.fitted = True
        return X, y_reg, y_cls, df

    def transform(self, df):
        """
        Applies learned preprocessing to unseen test / candidate datasets.
        """
        if not self.fitted:
            raise RuntimeError("Preprocessor must be fitted on training data before transforming.")
            
        df = self.normalize_coordinates(df)
        X = df[self.feature_columns].copy()
        
        for col in self.feature_columns:
            if col in X.columns and X[col].isnull().sum() > 0:
                X[f"{col}_missing"] = X[col].isnull().astype(int)
                X[col].fillna(X[col].median(), inplace=True)
        return X

    def save_pipeline(self, output_dir="preprocessing"):
        os.makedirs(output_dir, exist_ok=True)
        
        # Save feature list
        features_json_path = os.path.join(output_dir, "feature_columns.json")
        with open(features_json_path, "w") as f:
            json.dump({
                "feature_columns": self.feature_columns,
                "n_features": len(self.feature_columns),
                "target_reg": self.target_column,
                "target_cls": self.class_column
            }, f, indent=2)
            
        # Save preprocessor artifact
        pipeline_path = os.path.join(output_dir, "preprocessing_pipeline.pkl")
        joblib.dump(self, pipeline_path)
        print(f"[+] Saved preprocessing pipeline to: '{pipeline_path}'")
