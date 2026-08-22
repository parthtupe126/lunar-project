"""
Candidate Site Scoring, Risk Categorization & Ranking Engine
============================================================
Performs inference on candidate coordinates, computes calibrated suitability,
assigns mission risk tiers, and outputs ranked lunar site catalogs.
"""

import os
import numpy as np
import pandas as pd

def assign_risk_category(score):
    """
    Maps continuous suitability score to model-defined risk classifications.
    """
    if score >= 80.0:
        return "Very High Suitability"
    elif score >= 65.0:
        return "High Suitability"
    elif score >= 50.0:
        return "Moderate Suitability"
    elif score >= 35.0:
        return "Low Suitability"
    else:
        return "Very Low Suitability / Hazard"

def score_candidate_catalog(candidate_df, reg_model, cls_model, feature_names, output_dir="predictions"):
    """
    Scores all candidate lunar locations and exports ranked prediction catalogs.
    """
    os.makedirs(output_dir, exist_ok=True)
    df = candidate_df.copy()
    
    # Ensure feature alignment
    X = df[feature_names].values
    
    # Predict continuous suitability score and viability probability
    predicted_scores = np.clip(reg_model.predict(X), 0.0, 100.0)
    
    if hasattr(cls_model, "predict_proba"):
        predicted_probs = cls_model.predict_proba(X)[:, 1]
    else:
        predicted_probs = np.clip(predicted_scores / 100.0, 0.0, 1.0)
        
    df["suitability_score"] = np.round(predicted_scores, 2)
    df["suitability_probability"] = np.round(predicted_probs, 4)
    df["risk_category"] = [assign_risk_category(s) for s in predicted_scores]
    
    # Sort descending by suitability score
    df = df.sort_values(by="suitability_score", ascending=False).reset_index(drop=True)
    df["rank"] = df.index + 1
    
    # Export full predictions catalog
    cols_to_save = ["rank"] + [c for c in ["point_id", "node_id", "node_name", "latitude_deg", "longitude_deg"] if c in df.columns] + ["suitability_score", "suitability_probability", "risk_category"] + feature_names
    full_csv = os.path.join(output_dir, "lunar_site_predictions.csv")
    df[cols_to_save].to_csv(full_csv, index=False)
    print(f"[+] Exported full candidate site predictions ({len(df):,} sites) -> '{full_csv}'")
    
    # Export Top 10 Lunar Exploration Locations
    top10_csv = os.path.join(output_dir, "top_10_lunar_sites.csv")
    df.head(10)[cols_to_save].to_csv(top10_csv, index=False)
    print(f"[+] Exported Top 10 Prime Lunar Candidate Sites -> '{top10_csv}'")
    
    return df

def predict_single_lunar_coordinate(lat, lon, features_dict, reg_model, cls_model, feature_names):
    """
    Interactive API for predicting site suitability for any user-provided coordinate.
    """
    from src.feature_engineering import build_lunar_features
    
    features_dict = dict(features_dict)
    features_dict["latitude_deg"] = lat
    features_dict["longitude_deg"] = lon
    
    raw_df = pd.DataFrame([features_dict])
    eng_df, _ = build_lunar_features(raw_df)
    row_df = eng_df[feature_names]
    
    pred_score = float(np.clip(reg_model.predict(row_df.values)[0], 0.0, 100.0))
    
    if hasattr(cls_model, "predict_proba"):
        prob = float(cls_model.predict_proba(row_df.values)[0][1])
    else:
        prob = pred_score / 100.0
        
    risk_cat = assign_risk_category(pred_score)
    
    pos_factors = []
    neg_factors = []
    
    if features_dict.get("annual_illumination_pct", 0) >= 80.0:
        pos_factors.append(f"Abundant Sunlight ({features_dict['annual_illumination_pct']}%)")
    elif features_dict.get("annual_illumination_pct", 0) < 40.0:
        neg_factors.append(f"Extended Darkness / Low Solar Flux ({features_dict['annual_illumination_pct']}%)")
        
    if features_dict.get("slope_deg", 99) <= 5.0:
        pos_factors.append(f"Gentle Traversable Slope ({features_dict['slope_deg']} deg)")
    elif features_dict.get("slope_deg", 0) > 12.0:
        neg_factors.append(f"Hazardous Steep Terrain ({features_dict['slope_deg']} deg)")
        
    if features_dict.get("ice_prob", 0) >= 0.4:
        pos_factors.append(f"High Volatile Water-Ice Probability ({features_dict['ice_prob']*100:.0f}%)")
        
    if features_dict.get("earth_vis_pct", 0) >= 80.0:
        pos_factors.append(f"Direct Earth Telemetry Link ({features_dict['earth_vis_pct']}%)")
        
    result = {
        "latitude": lat,
        "longitude": lon,
        "suitability_probability": round(prob, 4),
        "suitability_score": round(pred_score, 1),
        "risk_classification": risk_cat,
        "top_positive_factors": pos_factors if pos_factors else ["Acceptable baseline conditions"],
        "top_negative_factors": neg_factors if neg_factors else ["No severe hazards detected"]
    }
    return result
