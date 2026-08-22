"""
Spatial Cross-Validation & Anti-Leakage Tiling Engine
====================================================
Prevents spatial autocorrelation leakage between adjacent pixels using 
Grouped Spatial K-Fold on coordinate tiles and Leave-One-Site-Out (LOSO-CV).
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import GroupKFold, KFold

def assign_spatial_tiles(df, lat_col="latitude_deg", lon_col="longitude_deg", tile_size_deg=1.5):
    """
    Assigns every geographic sample to a discrete spatial tile grid (e.g., 1.5° x 1.5°).
    Nearby pixels fall into the same tile group and will never be split across train/test sets.
    """
    df = df.copy()
    lat_bins = np.floor(df[lat_col] / tile_size_deg) * tile_size_deg
    lon_bins = np.floor(df[lon_col] / tile_size_deg) * tile_size_deg
    
    spatial_groups = [f"TILE_{lat:.1f}_{lon:.1f}" for lat, lon in zip(lat_bins, lon_bins)]
    df["spatial_tile_id"] = spatial_groups
    return df, spatial_groups

def get_spatial_kfold_splits(df, n_splits=5, lat_col="latitude_deg", lon_col="longitude_deg", tile_size_deg=1.5):
    """
    Generates 5-fold cross-validation splits grouped by spatial tile.
    """
    df, spatial_groups = assign_spatial_tiles(df, lat_col, lon_col, tile_size_deg)
    unique_tiles = len(set(spatial_groups))
    
    print(f"[*] Spatial Tiling: Assigned {len(df):,} samples into {unique_tiles} discrete {tile_size_deg}° x {tile_size_deg}° spatial clusters.")
    
    if unique_tiles >= n_splits:
        gkf = GroupKFold(n_splits=n_splits)
        splits = list(gkf.split(df, groups=spatial_groups))
    else:
        print(f"[!] Warning: Fewer unique spatial tiles ({unique_tiles}) than n_splits ({n_splits}). Using standard KFold.")
        kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
        splits = list(kf.split(df))
        
    return splits, df

def leave_one_site_out_split(benchmark_df):
    """
    Generates Leave-One-Site-Out Cross Validation splits for reference benchmark sites.
    """
    n_sites = len(benchmark_df)
    splits = []
    for i in range(n_sites):
        val_idx = [i]
        train_idx = [j for j in range(n_sites) if j != i]
        splits.append((train_idx, val_idx))
    return splits
