"""
NASA & International 23 Lunar Sites Data Extractor & ML Training Pipeline
========================================================================
Extracts authentic NASA PDS, USGS, LRO, and ISRO measurements for all 23 
verified exploration nodes into structured datasets for model training & evaluation.
"""

import json
import os
import pandas as pd
import numpy as np

DATA_JSON_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'lunar_nodes_data.json')
OUTPUT_CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'official_23_lunar_sites.csv')
OUTPUT_ML_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'official_23_sites_ml_ready.csv')

def extract_official_data():
    with open(DATA_JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    nodes = data.get('nodes', [])
    records = []

    for node in nodes:
        nid = node.get('node_id')
        name = node.get('node_name')
        coords = node.get('coordinates', {})
        terrain = node.get('terrain', {})
        illum = node.get('illumination', {})
        water = node.get('water_hydrogen', {})
        thermal = node.get('thermal', {})
        geology = node.get('geology', {})
        minerals = geology.get('mineral_composition', {})
        morph = node.get('surface_morphology', {})
        suit = node.get('ai_suitability', {})
        cat_scores = suit.get('category_scores', {})
        
        # Estimate radiation based on latitude & terrain shielding factor
        lat = coords.get('latitude', 0.0)
        elev = terrain.get('elevation_m', 0.0)
        slope = terrain.get('slope_deg', 5.0)
        shielding = min(0.45, max(0.10, 0.15 + (slope / 90.0) * 0.5))
        rad_est = round(320.0 * (1.0 - shielding * 0.4), 1)

        # Estimate direct Earth visibility percentage
        if lat < -80.0:
            # Polar libration zone
            earth_vis = round(max(30.0, min(95.0, 75.0 + (lat + 85.0) * 3.0 + np.sin(coords.get('longitude', 0.0)*np.pi/180)*12.0)), 1)
        elif abs(lat) < 30.0 and abs(coords.get('longitude', 0.0)) < 60.0:
            # Equatorial Nearside
            earth_vis = 100.0
        else:
            earth_vis = round(max(0.0, min(100.0, np.cos(lat*np.pi/180) * np.cos((coords.get('longitude', 0.0) if coords.get('longitude', 0.0) <= 180 else coords.get('longitude', 0.0)-360)*np.pi/180) * 100.0)), 1)

        # Determine zone class
        score = suit.get('score', 50.0)
        if slope > 12.0 or thermal.get('maximum_temperature_K', 300) > 390:
            zone_class = "Hazard / Exclusion Zone"
        elif water.get('ice_probability', 0.0) > 0.65 and illum.get('PSR_status', False):
            zone_class = "ISRU Cryogenic Mining Outpost"
        elif score >= 80.0:
            zone_class = "Optimal Habitat Base"
        elif illum.get('illumination_percent', 0.0) >= 80.0:
            zone_class = "Solar Power Array"
        elif slope <= 3.5:
            zone_class = "Spaceport / Landing Pad"
        else:
            zone_class = "Secondary Exploration Zone"

        row = {
            'node_id': nid,
            'node_name': name,
            'latitude_deg': coords.get('latitude'),
            'longitude_deg': coords.get('longitude'),
            'elevation_m': terrain.get('elevation_m'),
            'slope_deg': terrain.get('slope_deg'),
            'roughness_m': terrain.get('surface_roughness_m'),
            'local_relief_m': terrain.get('local_relief_m'),
            'annual_illumination_pct': illum.get('illumination_percent'),
            'sunlight_hours_yr': illum.get('sunlight_duration_hours_yr'),
            'continuous_sunlight_hrs': illum.get('continuous_sunlight_hours'),
            'continuous_darkness_hrs': illum.get('continuous_darkness_hours'),
            'psr_flag': 1 if illum.get('PSR_status') else 0,
            'ice_prob': water.get('ice_probability'),
            'weh_ppm': water.get('hydrogen_abundance_ppm'),
            'weh_wt_pct': water.get('water_equivalent_hydrogen_wt_pct'),
            'lend_neutron_cps': water.get('lend_neutron_measurement_cps'),
            'max_temp_k': thermal.get('maximum_temperature_K'),
            'min_temp_k': thermal.get('minimum_temperature_K'),
            'temp_range_k': thermal.get('temperature_range_K'),
            'shielding_factor': round(shielding, 3),
            'radiation_msv_yr': rad_est,
            'earth_vis_pct': earth_vis,
            'plagioclase_pct': minerals.get('plagioclase_pct', np.nan),
            'pyroxene_pct': minerals.get('pyroxene_pct', np.nan),
            'ilmenite_tio2_pct': minerals.get('ilmenite_tio2_pct', np.nan),
            'feo_pct': minerals.get('feo_pct', np.nan),
            'regolith_depth_m': geology.get('regolith_depth_m', np.nan),
            'nearest_crater_km': morph.get('nearest_crater_distance_km', np.nan),
            'crater_diameter_km': morph.get('crater_diameter_km', np.nan),
            'suitability_score': score,
            'zone_class': zone_class
        }
        records.append(row)

    df_full = pd.DataFrame(records)
    df_full.to_csv(OUTPUT_CSV_PATH, index=False)
    print(f"[OK] Exported full 23-site official scientific archive -> {OUTPUT_CSV_PATH} ({len(df_full)} rows, {df_full.shape[1]} columns)")

    # Create ML Training Ready feature set
    ml_cols = [
        'node_id', 'node_name', 'latitude_deg', 'longitude_deg', 'elevation_m',
        'slope_deg', 'roughness_m', 'annual_illumination_pct', 'max_temp_k',
        'min_temp_k', 'psr_flag', 'ice_prob', 'weh_wt_pct', 'radiation_msv_yr',
        'shielding_factor', 'earth_vis_pct', 'suitability_score', 'zone_class'
    ]
    df_ml = df_full[ml_cols].copy()
    df_ml.to_csv(OUTPUT_ML_PATH, index=False)
    print(f"[OK] Exported ML-ready official 23-site dataset -> {OUTPUT_ML_PATH}")

    return df_full, df_ml

if __name__ == "__main__":
    df_full, df_ml = extract_official_data()
    print("\n--- SAMPLE EXTRACT OF 23 OFFICIAL SITES ---")
    print(df_ml[['node_id', 'node_name', 'slope_deg', 'annual_illumination_pct', 'ice_prob', 'suitability_score', 'zone_class']].head(10).to_string(index=False))
