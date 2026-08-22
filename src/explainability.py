"""
SHAP Explainability & Physical Model Interpretation Engine
==========================================================
Generates global feature importance rankings, SHAP beeswarm plots, 
dependence relationships, and individual candidate site explanation breakdowns.
"""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def run_explainability_analysis(model, X_train, X_test, feature_names, output_dir="explainability"):
    """
    Computes global feature importances, SHAP values, and dependence curves.
    """
    os.makedirs(output_dir, exist_ok=True)
    dep_dir = os.path.join(output_dir, "shap_dependence_plots")
    os.makedirs(dep_dir, exist_ok=True)
    
    print("\n" + "=" * 60)
    print(" LUNA-DSS: EXPLAINABILITY & SHAP ANALYSIS")
    print("=" * 60)
    
    # ---------------------------------------------------------
    # 1. Native Model Feature Importance (Gain / MDI)
    # ---------------------------------------------------------
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    else:
        importances = np.ones(len(feature_names)) / len(feature_names)
        
    feat_df = pd.DataFrame({
        "Feature": feature_names,
        "Importance": importances
    }).sort_values(by="Importance", ascending=True)
    
    plt.figure(figsize=(10, 8))
    plt.barh(feat_df["Feature"], feat_df["Importance"] * 100, color="#1f77b4")
    plt.xlabel("Relative Predictive Contribution (%)")
    plt.title("XGBoost / Tree Feature Importance Ranking", fontweight="bold")
    for i, v in enumerate(feat_df["Importance"] * 100):
        plt.text(v + 0.2, i, f"{v:.1f}%", va="center", fontsize=9)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "shap_bar.png"), dpi=150)
    plt.close()
    
    # ---------------------------------------------------------
    # 2. SHAP Values Computation
    # ---------------------------------------------------------
    try:
        import shap
        print("[*] Computing exact TreeExplainer SHAP values...")
        explainer = shap.TreeExplainer(model)
        # Sample for fast computation if test set is large
        sample_X = X_test[:min(500, len(X_test))]
        shap_values = explainer.shap_values(sample_X)
        
        # Summary Plot
        plt.figure(figsize=(10, 8))
        shap.summary_plot(shap_values, sample_X, feature_names=feature_names, show=False)
        plt.title("SHAP Feature Impact Summary (Beeswarm)", fontweight="bold", pad=12)
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "shap_summary.png"), dpi=150, bbox_inches="tight")
        plt.close()
        
        # Dependence Plots for Top 4 Core Drivers
        key_features = ["slope_deg", "annual_illumination_pct", "max_temp_k", "weh_wt_pct"]
        for feat in key_features:
            if feat in feature_names:
                idx = feature_names.index(feat)
                plt.figure(figsize=(8, 5))
                shap.dependence_plot(idx, shap_values, sample_X, feature_names=feature_names, show=False)
                plt.title(f"SHAP Dependence Relationship: {feat}", fontweight="bold")
                plt.tight_layout()
                plt.savefig(os.path.join(dep_dir, f"shap_dep_{feat}.png"), dpi=150, bbox_inches="tight")
                plt.close()
        print(f"[+] Successfully generated SHAP plots in '{output_dir}/'")
        
    except ImportError:
        print("[!] 'shap' library not installed. Generating empirical proxy feature attribution plots...")
        # Generate empirical partial attribution surrogate
        plt.figure(figsize=(10, 8))
        feat_df.tail(15).plot(kind="barh", x="Feature", y="Importance", color="steelblue", legend=False)
        plt.title("Empirical Feature Contribution Summary", fontweight="bold")
        plt.xlabel("Predictive Weight")
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "shap_summary.png"), dpi=150)
        plt.close()
        
    return feat_df

def explain_single_site(site_dict, model, feature_names):
    """
    Generates human-readable engineering explanation for a candidate site.
    """
    row_df = pd.DataFrame([site_dict])[feature_names]
    pred_score = float(model.predict(row_df.values)[0])
    
    pos_factors = []
    neg_factors = []
    
    if site_dict.get("annual_illumination_pct", 0) >= 80:
        pos_factors.append(f"High Annual Solar Illumination ({site_dict['annual_illumination_pct']}%)")
    elif site_dict.get("annual_illumination_pct", 0) < 40:
        neg_factors.append(f"Severe Low Illumination / Extended Darkness ({site_dict['annual_illumination_pct']}%)")
        
    if site_dict.get("slope_deg", 99) <= 5.0:
        pos_factors.append(f"Ultra-Gentle Traversable Slope ({site_dict['slope_deg']}°)")
    elif site_dict.get("slope_deg", 0) > 12.0:
        neg_factors.append(f"Hazardous Steep Incline ({site_dict['slope_deg']}°)")
        
    if site_dict.get("ice_prob", 0) >= 0.5:
        pos_factors.append(f"High Volatile Water-Ice Probability ({site_dict['ice_prob']*100:.0f}%)")
        
    if site_dict.get("earth_vis_pct", 0) >= 80:
        pos_factors.append(f"Continuous Direct-to-Earth Line-of-Sight ({site_dict['earth_vis_pct']}%)")
    elif site_dict.get("earth_vis_pct", 100) < 30:
        neg_factors.append(f"Obstructed Earth Telemetry Communication ({site_dict['earth_vis_pct']}%)")
        
    if site_dict.get("max_temp_k", 0) > 360:
        neg_factors.append(f"Extreme Daytime Heat Stress ({site_dict['max_temp_k']}K)")
        
    return {
        "suitability_score": round(pred_score, 1),
        "positive_factors": pos_factors if pos_factors else ["Moderate baseline terrain"],
        "negative_factors": neg_factors if neg_factors else ["No critical operational constraints detected"]
    }
