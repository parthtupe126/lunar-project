"""
Lunar Habitat & Landing Site MCDM Evaluator
===========================================
Author: Aerospace Systems & Data Science Team
Framework: Multi-Criteria Decision Making (MCDM) with Go/No-Go Safety Constraints
"""

import numpy as np
import pandas as pd

def evaluate_lunar_sites(df: pd.DataFrame) -> pd.DataFrame:
    """
    Evaluates and ranks candidate lunar landing/habitat sites using 
    a Multi-Criteria Decision Making (MCDM) model with hard Go/No-Go constraints.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Input dataset containing:
        ['site_id', 'earth_vis_pct', 'slope_deg', 'ice_prob', 
         'annual_illumination_pct', 'roughness_m', 'shielding_factor']
        
    Returns:
    --------
    pd.DataFrame
        Ranked DataFrame with normalized feature scores, viability flag, and final_score.
    """
    # Create a working copy to preserve original input
    df_eval = df.copy()
    
    # -------------------------------------------------------------
    # STEP 1: Apply Hard Constraints (Go/No-Go Filter)
    # -------------------------------------------------------------
    # Convert annual_illumination_pct to 0.0 - 1.0 scale if provided as 0 - 100%
    if df_eval['annual_illumination_pct'].max() > 1.0:
        illum_ratio = df_eval['annual_illumination_pct'] / 100.0
    else:
        illum_ratio = df_eval['annual_illumination_pct']
        
    # Standardize earth_vis_pct to 0.0 - 1.0 scale if provided as 0 - 100%
    if df_eval['earth_vis_pct'].max() > 1.0:
        df_eval['earth_vis_pct'] = df_eval['earth_vis_pct'] / 100.0

    # Hard constraint boolean conditions
    pass_slope = df_eval['slope_deg'] <= 5.0
    pass_illum = illum_ratio >= 0.30
    pass_roughness = df_eval['roughness_m'] <= 2.0

    # is_viable: 1 if all constraints are satisfied, 0 otherwise
    df_eval['is_viable'] = (pass_slope & pass_illum & pass_roughness).astype(int)

    # -------------------------------------------------------------
    # STEP 2: Feature Normalization (Min-Max Feature Scaling)
    # -------------------------------------------------------------
    def min_max_norm(series: pd.Series, invert: bool = False) -> pd.Series:
        min_val = series.min()
        max_val = series.max()
        if max_val == min_val:
            return pd.Series(1.0 if not invert else 0.0, index=series.index)
        
        # Standard Benefit Normalization: 0 (worst) to 1 (best)
        norm = (series - min_val) / (max_val - min_val)
        
        # Inverted Cost Normalization: lower original value -> higher score
        if invert:
            norm = 1.0 - norm
        return norm

    # Benefit Criteria (Higher is Better)
    norm_illum = min_max_norm(illum_ratio, invert=False)
    norm_ice = min_max_norm(df_eval['ice_prob'], invert=False)
    norm_earth = min_max_norm(df_eval['earth_vis_pct'], invert=False)
    norm_shield = min_max_norm(df_eval['shielding_factor'], invert=False)

    # Cost / Hazard Criteria (Lower is Better -> Inverted)
    norm_slope = min_max_norm(df_eval['slope_deg'], invert=True)
    norm_roughness = min_max_norm(df_eval['roughness_m'], invert=True)

    # Store normalized metrics for telemetry inspection
    df_eval['norm_illumination'] = norm_illum.round(4)
    df_eval['norm_ice_prob'] = norm_ice.round(4)
    df_eval['norm_slope'] = norm_slope.round(4)
    df_eval['norm_earth_vis'] = norm_earth.round(4)
    df_eval['norm_shielding'] = norm_shield.round(4)
    df_eval['norm_roughness'] = norm_roughness.round(4)

    # -------------------------------------------------------------
    # STEP 3: Multi-Criteria Weighted Scoring & Viability Gating
    # -------------------------------------------------------------
    # Defined MCDM Weights (Sum = 1.00)
    weights = {
        'illumination': 0.30,
        'ice_prob':     0.25,
        'slope':        0.15,
        'earth_vis':    0.10,
        'shielding':    0.10,
        'roughness':    0.10
    }

    # Composite weighted score calculation
    raw_composite_score = (
        weights['illumination'] * norm_illum +
        weights['ice_prob']     * norm_ice +
        weights['slope']        * norm_slope +
        weights['earth_vis']    * norm_earth +
        weights['shielding']    * norm_shield +
        weights['roughness']    * norm_roughness
    )

    # Gated by is_viable filter (fails -> 0.0)
    df_eval['final_score'] = (df_eval['is_viable'] * raw_composite_score).round(4)

    # -------------------------------------------------------------
    # STEP 4: Rank Sites in Descending Order
    # -------------------------------------------------------------
    ranked_df = df_eval.sort_values(by='final_score', ascending=False).reset_index(drop=True)
    ranked_df['rank'] = range(1, len(ranked_df) + 1)
    
    return ranked_df

# =================================================================
# DEMONSTRATION & EXECUTION SCRIPT
# =================================================================
if __name__ == "__main__":
    # Sample dataset representative of Lunar South Pole candidate sites
    sample_data = {
        'site_id': [
            'Site_A_Shackleton_Rim',
            'Site_B_Malapert_Peak',
            'Site_C_Faustini_Ridge',
            'Site_D_Shoemaker_Wall',    # Slope failure (> 5.0 deg)
            'Site_E_Amundsen_Plain',
            'Site_F_Cabeus_Floor',      # Illumination failure (< 30%)
            'Site_G_Nobile_Outcrop',
            'Site_H_Connecting_Ridge',
            'Site_I_Boulder_Field'      # Roughness failure (> 2.0 m)
        ],
        'earth_vis_pct':           [0.89, 0.95, 0.76, 0.65, 0.88, 0.00, 0.79, 0.82, 0.50],
        'slope_deg':               [ 4.2,  3.8,  4.9, 14.5,  2.1, 16.0,  4.8,  4.5,  4.1],
        'ice_prob':                [0.35, 0.20, 0.78, 0.85, 0.40, 0.95, 0.81, 0.65, 0.30],
        'annual_illumination_pct': [0.91, 0.89, 0.82, 0.45, 0.72, 0.00, 0.76, 0.84, 0.65],
        'roughness_m':             [ 0.8,  0.6,  1.1,  2.8,  0.4,  3.1,  0.9,  0.9,  2.5],
        'shielding_factor':        [0.22, 0.15, 0.25, 0.38, 0.18, 0.42, 0.23, 0.24, 0.20]
    }

    df_lunar = pd.DataFrame(sample_data)

    print("=====================================================================")
    print(" LUNAR HABITAT & LANDING SITE MCDM EVALUATION SYSTEM")
    print("=====================================================================\n")

    # Run MCDM evaluation
    ranked_sites = evaluate_lunar_sites(df_lunar)

    # Display Top 5 Candidate Sites
    top_5 = ranked_sites.head(5)[[
        'rank', 'site_id', 'is_viable', 'slope_deg', 
        'annual_illumination_pct', 'ice_prob', 'final_score'
    ]]

    print("--- TOP 5 OPTIMAL LUNAR SITES (RANKED) ---")
    print(top_5.to_string(index=False))
    print("\n=====================================================================")
