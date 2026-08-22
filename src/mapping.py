"""
Lunar Geospatial Mapping & Cartographic Visualizer
=================================================
Generates polar stereographic suitability heatmaps, top-candidate overlay maps,
and 2D spatial distribution plots for mission landing site selection.
"""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def generate_spatial_maps(grid_predictions_df, official_predictions_df, output_dir="evaluation"):
    """
    Renders 2D lunar polar suitability heatmaps and top candidate location maps.
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # ---------------------------------------------------------
    # 1. Lunar South Pole Suitability Heatmap
    # ---------------------------------------------------------
    plt.figure(figsize=(10, 8))
    scatter = plt.scatter(
        grid_predictions_df["longitude_deg"],
        grid_predictions_df["latitude_deg"],
        c=grid_predictions_df["suitability_score"],
        cmap="plasma",
        s=15,
        alpha=0.8,
        edgecolors="none"
    )
    plt.colorbar(scatter, label="XGBoost Site Suitability Index (0 - 100)")
    plt.xlabel("Longitude (°)")
    plt.ylabel("Latitude (°)")
    plt.title("Lunar South Pole ML-Derived Site Suitability Map", fontweight="bold", pad=12)
    plt.tight_layout()
    map_path = os.path.join(output_dir, "spatial_prediction_map.png")
    plt.savefig(map_path, dpi=150)
    plt.close()
    
    # ---------------------------------------------------------
    # 2. Top Candidate Locations Overlay Map
    # ---------------------------------------------------------
    top10 = grid_predictions_df.head(10)
    plt.figure(figsize=(10, 8))
    plt.scatter(
        grid_predictions_df["longitude_deg"],
        grid_predictions_df["latitude_deg"],
        c=grid_predictions_df["suitability_score"],
        cmap="Blues",
        s=10,
        alpha=0.3
    )
    
    # Highlight top 10
    plt.scatter(
        top10["longitude_deg"],
        top10["latitude_deg"],
        c="crimson",
        s=120,
        marker="*",
        edgecolors="black",
        label="Top 10 Candidate Landing Nodes"
    )
    
    for idx, row in top10.iterrows():
        plt.annotate(
            f"#{int(row['rank'])} ({row['suitability_score']:.1f})",
            (row["longitude_deg"], row["latitude_deg"]),
            textcoords="offset points",
            xytext=(6, 6),
            fontsize=9,
            fontweight="bold",
            color="black"
        )
        
    plt.xlabel("Longitude (°)")
    plt.ylabel("Latitude (°)")
    plt.title("Top Ranked Lunar Candidate Landing Locations", fontweight="bold", pad=12)
    plt.legend(loc="upper right")
    plt.tight_layout()
    top_map_path = os.path.join(output_dir, "top_candidate_site_map.png")
    plt.savefig(top_map_path, dpi=150)
    plt.close()
    
    # ---------------------------------------------------------
    # 3. Suitability Score Distribution Plot
    # ---------------------------------------------------------
    plt.figure(figsize=(8, 5))
    sns.histplot(grid_predictions_df["suitability_score"], kde=True, color="teal", bins=35)
    plt.axvline(grid_predictions_df["suitability_score"].mean(), color="red", linestyle="--", label=f"Mean Score ({grid_predictions_df['suitability_score'].mean():.1f})")
    plt.xlabel("Suitability Score (0 - 100)")
    plt.ylabel("Site Count")
    plt.title("Candidate Site Suitability Score Distribution", fontweight="bold")
    plt.legend()
    plt.tight_layout()
    dist_path = os.path.join(output_dir, "suitability_score_distribution.png")
    plt.savefig(dist_path, dpi=150)
    plt.close()
    
    print(f"[+] Exported cartographic spatial suitability maps into '{output_dir}/'")
