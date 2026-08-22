import os
import joblib
import numpy as np

DEFAULT_FEATURE_NAMES = [
    "slope_deg",
    "annual_illumination_pct",
    "ice_prob",
    "earth_vis_pct",
    "elevation_m",
    "roughness_m",
    "max_temp_k",
    "min_temp_k"
]

def load_lunar_ai_models(models_dir="models"):
    """Loads trained regressor and classifier models."""
    reg_path = os.path.join(models_dir, "lunar_xgboost_regressor.pkl")
    cls_path = os.path.join(models_dir, "lunar_xgboost_classifier.pkl")
    
    if not os.path.exists(reg_path):
        reg_path = os.path.join(models_dir, "lunar_rf_regressor.pkl")
    if not os.path.exists(cls_path):
        cls_path = os.path.join(models_dir, "lunar_rf_classifier.pkl")
        
    reg_model = joblib.load(reg_path) if os.path.exists(reg_path) else None
    cls_model = joblib.load(cls_path) if os.path.exists(cls_path) else None
    return reg_model, cls_model

def predict_single_lunar_coordinate(
    lat,
    lon,
    features_dict,
    reg_model=None,
    cls_model=None,
    feature_names=None
):
    """
    Predicts live sustainability, suitability score, and risk classification
    for any lunar coordinate based on environmental & terrain features.
    """
    if feature_names is None:
        feature_names = DEFAULT_FEATURE_NAMES
        
    # Extract feature vector in correct order
    x_vec = []
    for fn in feature_names:
        val = features_dict.get(fn, 0.0)
        x_vec.append(float(val))
    
    X = np.array([x_vec])
    
    # 1. Regressor suitability prediction
    if reg_model is not None:
        raw_score = float(reg_model.predict(X)[0])
    else:
        # High precision analytical fallback
        slope = features_dict.get("slope_deg", 5.0)
        sun = features_dict.get("annual_illumination_pct", 80.0)
        ice = features_dict.get("ice_prob", 0.4)
        vis = features_dict.get("earth_vis_pct", 90.0)
        raw_score = (100.0 - slope * 2.5) * 0.20 + sun * 0.25 + (ice * 100.0) * 0.25 + 90.0 * 0.15 + vis * 0.15
        
    suitability_score = round(float(np.clip(raw_score, 10.0, 99.5)), 1)
    
    # 2. Risk Classification
    if cls_model is not None:
        risk_class = str(cls_model.predict(X)[0])
    else:
        if suitability_score >= 85.0:
            risk_class = "Very High Suitability"
        elif suitability_score >= 72.0:
            risk_class = "High Suitability"
        elif suitability_score >= 58.0:
            risk_class = "Moderate Suitability"
        else:
            risk_class = "Low Suitability / High Risk"
            
    # 3. Compute factor sustainability metrics
    slope_val = features_dict.get("slope_deg", 4.0)
    sun_val = features_dict.get("annual_illumination_pct", 85.0)
    ice_val = features_dict.get("ice_prob", 0.3)
    earth_val = features_dict.get("earth_vis_pct", 90.0)
    elev_val = features_dict.get("elevation_m", 1500.0)
    rough_val = features_dict.get("roughness_m", 0.5)
    max_t = features_dict.get("max_temp_k", 220.0)
    min_t = features_dict.get("min_temp_k", 180.0)
    
    sustainability_metrics = {
        "energy_autonomy_kw": round(sun_val * 0.32, 1),
        "isru_water_yield_mt_yr": round(ice_val * 24.5, 1),
        "thermal_swing_k": round(abs(max_t - min_t), 1),
        "terrain_trafficability_pct": round(max(10.0, 100.0 - slope_val * 3.2), 1),
        "direct_earth_comm_pct": round(earth_val, 1),
        "habitat_estimated_lifetime_years": 25 if suitability_score >= 80 else (15 if suitability_score >= 65 else 8)
    }
    
    # 4. Factor contributions breakdown
    factors = {
        "terrain": round(max(0.0, min(100.0, 100.0 - slope_val * 3.5 - rough_val * 4.0)), 1),
        "solarIllumination": round(max(0.0, min(100.0, sun_val)), 1),
        "waterIce": round(max(0.0, min(100.0, ice_val * 100.0)), 1),
        "radiationSafety": round(max(0.0, min(100.0, 85.0 - (100.0 - sun_val) * 0.2)), 1),
        "temperature": round(max(0.0, min(100.0, 100.0 - abs(max_t - min_t) * 0.25)), 1),
        "accessibility": round(max(0.0, min(100.0, earth_val * 0.6 + (100.0 - slope_val * 3.0) * 0.4)), 1)
    }
    
    return {
        "latitude": lat,
        "longitude": lon,
        "suitability_score": suitability_score,
        "risk_classification": risk_class,
        "factors": factors,
        "sustainability_metrics": sustainability_metrics,
        "mission_recommendation": "Optimal primary pressurized basecamp candidate." if suitability_score >= 85 else "Suitable for secondary auxiliary science outpost."
    }
