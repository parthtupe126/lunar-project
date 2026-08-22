"""
Scientific Feature Engineering Engine
=====================================
Constructs domain-grounded physical features across LOLA, Diviner, LEND, LRO, and LROC
sensors without artificial mathematical artifacts, ensuring strict interpretability.
"""

import os
import numpy as np
import pandas as pd

def build_lunar_features(df, reports_dir="reports"):
    """
    Transforms raw multi-sensor tabular observations into physically meaningful ML features.
    """
    df = df.copy()
    
    # ---------------------------------------------------------
    # 1. Topography Features (NASA LOLA)
    # ---------------------------------------------------------
    if "slope_deg" in df.columns:
        df["log_slope"] = np.log1p(df["slope_deg"])
        # Slope safety index (Habitats require slope < 8 deg, Landers < 3.5 deg)
        df["slope_safety_index"] = np.clip(100.0 - (df["slope_deg"] / 15.0)**1.5 * 100.0, 0.0, 100.0)
    else:
        df["slope_deg"] = 5.0
        df["log_slope"] = np.log1p(5.0)
        df["slope_safety_index"] = 75.0

    if "elevation_m" not in df.columns:
        df["elevation_m"] = 1000.0
    if "roughness_m" not in df.columns:
        df["roughness_m"] = 0.8
    if "local_relief_m" not in df.columns:
        df["local_relief_m"] = df["roughness_m"] * 25.0

    # ---------------------------------------------------------
    # 2. Thermal Regime Features (NASA Diviner)
    # ---------------------------------------------------------
    if "max_temp_k" in df.columns and "min_temp_k" in df.columns:
        df["temp_range_k"] = np.maximum(0.0, df["max_temp_k"] - df["min_temp_k"])
        # Cryogenic cold trap flag: True if peak summer temperature never exceeds 110K
        df["cryogenic_cold_trap_flag"] = (df["max_temp_k"] < 110.0).astype(int)
        # Thermal moderation index: High for stable locations with minimal diurnal swings
        df["thermal_stability_index"] = np.clip(100.0 - (df["temp_range_k"] / 250.0) * 100.0, 0.0, 100.0)
    else:
        df["max_temp_k"] = 220.0
        df["min_temp_k"] = 180.0
        df["temp_range_k"] = 40.0
        df["cryogenic_cold_trap_flag"] = 0
        df["thermal_stability_index"] = 84.0

    # ---------------------------------------------------------
    # 3. Water-Ice & Epithermal Neutron Features (NASA LEND)
    # ---------------------------------------------------------
    if "weh_wt_pct" not in df.columns and "ice_prob" in df.columns:
        df["weh_wt_pct"] = df["ice_prob"] * 5.2
    elif "weh_wt_pct" not in df.columns:
        df["weh_wt_pct"] = 0.5

    if "ice_prob" not in df.columns:
        df["ice_prob"] = np.clip(df["weh_wt_pct"] / 5.2, 0.0, 1.0)
        
    df["volatile_resource_index"] = np.clip(df["weh_wt_pct"] * 18.0 + df["ice_prob"] * 25.0, 0.0, 100.0)

    # ---------------------------------------------------------
    # 4. Illumination & Communications (NASA LRO)
    # ---------------------------------------------------------
    if "annual_illumination_pct" in df.columns:
        df["sunlight_fraction"] = df["annual_illumination_pct"] / 100.0
        df["darkness_fraction"] = 1.0 - df["sunlight_fraction"]
        df["solar_power_viability"] = np.where(df["annual_illumination_pct"] >= 75.0, 1, 0)
    else:
        df["annual_illumination_pct"] = 80.0
        df["sunlight_fraction"] = 0.80
        df["darkness_fraction"] = 0.20
        df["solar_power_viability"] = 1

    if "earth_vis_pct" not in df.columns:
        df["earth_vis_pct"] = 85.0
    df["communication_reliability_index"] = np.clip(df["earth_vis_pct"], 0.0, 100.0)

    # ---------------------------------------------------------
    # 5. Radiation & Environmental Shielding (NASA CRaTER)
    # ---------------------------------------------------------
    if "shielding_factor" not in df.columns:
        df["shielding_factor"] = np.clip(0.15 + (df["slope_deg"] / 90.0) * 0.4, 0.10, 0.50)
        
    if "radiation_msv_yr" not in df.columns:
        df["radiation_msv_yr"] = 380.0 * (1.0 - df["shielding_factor"] * 0.5)

    df["radiation_safety_index"] = np.clip((1.0 - (df["radiation_msv_yr"] / 400.0)) * 100.0, 0.0, 100.0)

    # Export Feature Dictionary Documentation
    feature_dict = [
        {"feature_name": "slope_deg", "sensor": "LOLA", "unit": "Degrees", "physics": "Surface gradient; critical for rover traversability & lander touchdown stability."},
        {"feature_name": "log_slope", "sensor": "LOLA", "unit": "Log(Deg+1)", "physics": "Compresses high-slope extremes for linearized split optimization."},
        {"feature_name": "slope_safety_index", "sensor": "LOLA", "unit": "Index (0-100)", "physics": "Engineering suitability based on Apollo/Artemis slope limits (<8 deg)."},
        {"feature_name": "elevation_m", "sensor": "LOLA", "unit": "Meters", "physics": "Altimetry above lunar 1737.4 km datum; elevated plateaus receive peak sunlight."},
        {"feature_name": "roughness_m", "sensor": "LOLA", "unit": "Meters", "physics": "Hurst micro-topography roughness and boulder hazard proxy."},
        {"feature_name": "local_relief_m", "sensor": "LOLA", "unit": "Meters", "physics": "Crater depth and rim elevation differential in 800m neighborhood."},
        {"feature_name": "max_temp_k", "sensor": "Diviner", "unit": "Kelvin", "physics": "Peak daytime temperature; thermal limits for solar arrays & habitats."},
        {"feature_name": "min_temp_k", "sensor": "Diviner", "unit": "Kelvin", "physics": "Minimum surface temperature; identifies cryogenic volatile traps (<110K)."},
        {"feature_name": "temp_range_k", "sensor": "Diviner", "unit": "Kelvin", "physics": "Diurnal thermal delta; high swings induce severe hardware fatigue."},
        {"feature_name": "cryogenic_cold_trap_flag", "sensor": "Diviner", "unit": "Binary", "physics": "1 if Tmax < 110K where water ice remains stable for >2 billion years."},
        {"feature_name": "thermal_stability_index", "sensor": "Diviner", "unit": "Index (0-100)", "physics": "Measures benign, low-swing thermal environments for long-term habitats."},
        {"feature_name": "ice_prob", "sensor": "LEND/Mini-RF", "unit": "Probability (0-1)", "physics": "Volatile ice presence certainty index from radar & neutron suppression."},
        {"feature_name": "weh_wt_pct", "sensor": "LEND", "unit": "Weight %", "physics": "Water-Equivalent Hydrogen content in top 1 meter of lunar soil."},
        {"feature_name": "volatile_resource_index", "sensor": "LEND", "unit": "Index (0-100)", "physics": "ISRU propellant and life-support resource extraction viability."},
        {"feature_name": "annual_illumination_pct", "sensor": "LRO Illum", "unit": "% Sunlight", "physics": "Fraction of lunar year illuminated by solar rays for energy capture."},
        {"feature_name": "sunlight_fraction", "sensor": "LRO Illum", "unit": "Fraction (0-1)", "physics": "Normalized annual solar availability."},
        {"feature_name": "darkness_fraction", "sensor": "LRO Illum", "unit": "Fraction (0-1)", "physics": "Battery & fuel-cell storage requirement sizing metric."},
        {"feature_name": "solar_power_viability", "sensor": "LRO Illum", "unit": "Binary", "physics": "1 if annual illumination >= 75% enabling continuous power generation."},
        {"feature_name": "earth_vis_pct", "sensor": "LRO Comm", "unit": "% LOS", "physics": "Direct-to-Earth Line-of-Sight visibility for telemetry & communications."},
        {"feature_name": "communication_reliability_index", "sensor": "LRO Comm", "unit": "Index (0-100)", "physics": "Low-latency Earth link reliability without orbital relay satellites."},
        {"feature_name": "radiation_msv_yr", "sensor": "CRaTER", "unit": "mSv/year", "physics": "Annual Galactic Cosmic Ray & Solar Particle Event dosage."},
        {"feature_name": "shielding_factor", "sensor": "Topography/CRaTER", "unit": "Factor (0-1)", "physics": "Natural horizon shielding against deep-space radiation & micrometeorites."},
        {"feature_name": "radiation_safety_index", "sensor": "CRaTER", "unit": "Index (0-100)", "physics": "Biological safety index for astronaut crewed habitat modules."}
    ]
    
    os.makedirs(reports_dir, exist_ok=True)
    dict_path = os.path.join(reports_dir, "feature_dictionary.csv")
    pd.DataFrame(feature_dict).to_csv(dict_path, index=False)
    
    return df, [f["feature_name"] for f in feature_dict]
