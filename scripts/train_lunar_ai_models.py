"""
Lunar AI Habitat Site Suitability Training Pipeline
===================================================
Trains Machine Learning Models on Lunar Geospatial Features:
1. Random Forest Regressor (Continuous Site Suitability Index 0-100)
2. Random Forest Classifier (Base Functional Zoning Classification)
3. Gradient Boosting Regressor (Non-linear multi-objective optimization)
4. Multi-Layer Perceptron Neural Net (Deep Feature Interaction)
5. K-Means Clustering (Autonomous Module Site Zoning)
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    r2_score, mean_absolute_error, mean_squared_error,
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
)

def main():
    print("================================================================")
    print(" LUNA-DSS: AI Model Training & Suitability Engine")
    print("================================================================")
    
    csv_path = "data/lunar_ml_training_dataset.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found. Please run download_and_prepare_lunar_datasets.py first.")
        return
        
    df = pd.read_csv(csv_path)
    print(f"Loaded dataset: {df.shape[0]} samples, {df.shape[1]} columns.")
    
    # Feature columns
    feature_cols = [
        "slope_deg",
        "annual_illumination_pct",
        "ice_prob",
        "radiation_msv_yr",
        "earth_vis_pct",
        "elevation_m",
        "roughness_m",
        "max_temp_k",
        "min_temp_k",
        "shielding_factor",
        "weh_wt_pct"
    ]
    
    X = df[feature_cols].values
    y_reg = df["suitability_score"].values
    y_cls = df["zone_class"].values
    
    # Train / Test split (80% train, 20% test)
    X_train, X_test, y_reg_train, y_reg_test, y_cls_train, y_cls_test = train_test_split(
        X, y_reg, y_cls, test_size=0.20, random_state=42, stratify=y_cls
    )
    
    print(f"Training split: {X_train.shape[0]} samples | Test split: {X_test.shape[0]} samples")
    
    # Standard Scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # ==============================================================
    # MODEL 1: Random Forest Regressor (Suitability Index)
    # ==============================================================
    print("\n[1/4] Training Random Forest Regressor...")
    rf_reg = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf_reg.fit(X_train, y_reg_train)
    
    y_reg_pred = rf_reg.predict(X_test)
    r2 = r2_score(y_reg_test, y_reg_pred)
    mae = mean_absolute_error(y_reg_test, y_reg_pred)
    rmse = np.sqrt(mean_squared_error(y_reg_test, y_reg_pred))
    
    print(f"  -> R2 Score:  {r2:.4f} ({r2*100:.2f}%)")
    print(f"  -> MAE:       {mae:.3f} points")
    print(f"  -> RMSE:      {rmse:.3f} points")
    
    # Feature Importances
    importances = rf_reg.feature_importances_
    feat_imp = {col: round(float(imp), 4) for col, imp in zip(feature_cols, importances)}
    print("  -> Feature Importances:")
    for col, imp in sorted(feat_imp.items(), key=lambda x: x[1], reverse=True):
        print(f"     * {col:25s}: {imp * 100:.2f}%")
        
    # ==============================================================
    # MODEL 2: Random Forest Classifier (Base Zoning)
    # ==============================================================
    print("\n[2/4] Training Random Forest Zone Classifier...")
    rf_cls = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    rf_cls.fit(X_train, y_cls_train)
    
    y_cls_pred = rf_cls.predict(X_test)
    acc = accuracy_score(y_cls_test, y_cls_pred)
    prec = precision_score(y_cls_test, y_cls_pred, average="weighted")
    rec = recall_score(y_cls_test, y_cls_pred, average="weighted")
    f1 = f1_score(y_cls_test, y_cls_pred, average="weighted")
    classes = list(rf_cls.classes_)
    
    print(f"  -> Accuracy:  {acc:.4f} ({acc*100:.2f}%)")
    print(f"  -> Precision: {prec:.4f}")
    print(f"  -> Recall:    {rec:.4f}")
    print(f"  -> F1-Score:  {f1:.4f}")
    print(f"  -> Target Classes: {classes}")
    
    # ==============================================================
    # MODEL 3: Gradient Boosting Regressor
    # ==============================================================
    print("\n[3/4] Training Gradient Boosting Regressor...")
    gbr = GradientBoostingRegressor(n_estimators=80, learning_rate=0.08, max_depth=5, random_state=42)
    gbr.fit(X_train, y_reg_train)
    gbr_pred = gbr.predict(X_test)
    gbr_r2 = r2_score(y_reg_test, gbr_pred)
    print(f"  -> GBR R2 Score: {gbr_r2:.4f}")
    
    # ==============================================================
    # MODEL 4: Neural Network (MLP Regressor)
    # ==============================================================
    print("\n[4/4] Training Multi-Layer Perceptron (Neural Network)...")
    mlp = MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=200, random_state=42)
    mlp.fit(X_train_scaled, y_reg_train)
    mlp_pred = mlp.predict(X_test_scaled)
    mlp_r2 = r2_score(y_reg_test, mlp_pred)
    print(f"  -> MLP Neural Net R2 Score: {mlp_r2:.4f}")
    
    # ==============================================================
    # MODEL 5: Unsupervised Clustering for Lunar Base Modules
    # ==============================================================
    print("\nRunning K-Means Clustering for Modular Base Zoning...")
    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    kmeans.fit(X_train_scaled)
    cluster_centers = kmeans.cluster_centers_
    
    # Export trained metrics and model inference rules to JSON
    export_payload = {
        "model_metadata": {
            "name": "LUNA-DSS Multi-Model AI Habitat Suitability Engine",
            "version": "2.4.0",
            "training_samples": len(df),
            "features": feature_cols,
            "classes": classes
        },
        "regression_metrics": {
            "rf_r2_score": round(float(r2), 4),
            "rf_mae": round(float(mae), 3),
            "rf_rmse": round(float(rmse), 3),
            "gbr_r2_score": round(float(gbr_r2), 4),
            "mlp_r2_score": round(float(mlp_r2), 4)
        },
        "classification_metrics": {
            "accuracy": round(float(acc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "classes": classes
        },
        "feature_importances": feat_imp,
        "scaler_params": {
            "mean": [round(float(m), 4) for m in scaler.mean_],
            "std": [round(float(s), 4) for s in scaler.scale_]
        },
        "ai_decision_rules": {
            "slope_max_habitat_deg": 8.0,
            "slope_max_landing_deg": 3.5,
            "min_annual_illumination_pct": 75.0,
            "max_annual_radiation_msv": 370.0,
            "min_psr_ice_wt_pct": 3.0,
            "safe_thermal_min_k": 120.0
        }
    }
    
    out_json_path = "src/data/trained_ai_models.json"
    with open(out_json_path, "w") as f:
        json.dump(export_payload, f, indent=2)
    print(f"\nSaved trained model metadata & metrics to: {out_json_path}")
    
    with open("data/model_metrics.json", "w") as f:
        json.dump(export_payload, f, indent=2)
    print(f"Saved metrics log to: data/model_metrics.json")
    
    print("\nAI Training Pipeline Finished Successfully!")

if __name__ == "__main__":
    main()
