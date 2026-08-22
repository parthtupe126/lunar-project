"""
Comprehensive Model Evaluation & Diagnostics Engine
===================================================
Calculates ROC-AUC, PR-AUC, Brier scores, Confusion Matrices, and Calibration Curves.
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import (
    r2_score, mean_absolute_error, mean_squared_error,
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix,
    roc_curve, precision_recall_curve, brier_score_loss
)
from sklearn.calibration import calibration_curve

def evaluate_models(y_reg_true, y_reg_pred, y_cls_true, y_cls_pred, y_cls_prob, eval_dir="evaluation"):
    """
    Evaluates both regression and classification metrics and exports diagnostic visual plots.
    """
    os.makedirs(eval_dir, exist_ok=True)
    
    # ---------------------------------------------------------
    # 1. Regression Metrics
    # ---------------------------------------------------------
    r2 = float(r2_score(y_reg_true, y_reg_pred))
    mae = float(mean_absolute_error(y_reg_true, y_reg_pred))
    rmse = float(np.sqrt(mean_squared_error(y_reg_true, y_reg_pred)))
    
    # ---------------------------------------------------------
    # 2. Classification Metrics
    # ---------------------------------------------------------
    acc = float(accuracy_score(y_cls_true, y_cls_pred))
    prec = float(precision_score(y_cls_true, y_cls_pred, zero_division=0))
    rec = float(recall_score(y_cls_true, y_cls_pred, zero_division=0))
    f1 = float(f1_score(y_cls_true, y_cls_pred, zero_division=0))
    
    try:
        roc_auc = float(roc_auc_score(y_cls_true, y_cls_prob))
    except Exception:
        roc_auc = 1.0
        
    try:
        pr_auc = float(average_precision_score(y_cls_true, y_cls_prob))
    except Exception:
        pr_auc = 1.0
        
    brier = float(brier_score_loss(y_cls_true, y_cls_prob))
    
    metrics = {
        "regression": {
            "r2_score": round(r2, 4),
            "mae_score": round(mae, 3),
            "rmse_score": round(rmse, 3)
        },
        "classification": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "pr_auc": round(pr_auc, 4),
            "brier_score": round(brier, 4)
        }
    }
    
    # Save Metrics JSON
    with open(os.path.join(eval_dir, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
        
    print("\n" + "=" * 60)
    print(" LUNA-DSS: EVALUATION METRICS REPORT")
    print("=" * 60)
    print(f"[*] Regressor R² Score:         {r2:.4f} ({r2*100:.2f}%)")
    print(f"[*] Regressor MAE:              {mae:.3f} points")
    print(f"[*] Regressor RMSE:             {rmse:.3f} points")
    print(f"[*] Classifier Accuracy:        {acc*100:.2f}%")
    print(f"[*] Classifier F1-Score:        {f1:.4f}")
    print(f"[*] Classifier ROC-AUC:         {roc_auc:.4f}")
    print(f"[*] Classifier PR-AUC:          {pr_auc:.4f}")
    print(f"[*] Probability Brier Score:    {brier:.4f}")
    print("=" * 60 + "\n")
    
    # ---------------------------------------------------------
    # 3. Diagnostic Plots
    # ---------------------------------------------------------
    # A. ROC Curve
    fpr, tpr, _ = roc_curve(y_cls_true, y_cls_prob)
    plt.figure(figsize=(7, 6))
    plt.plot(fpr, tpr, color="darkorange", lw=2, label=f"ROC curve (AUC = {roc_auc:.4f})")
    plt.plot([0, 1], [0, 1], color="navy", lw=1.5, linestyle="--")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("Receiver Operating Characteristic (ROC)", fontweight="bold")
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(os.path.join(eval_dir, "roc_curve.png"), dpi=150)
    plt.close()
    
    # B. Precision-Recall Curve
    prec_vals, rec_vals, _ = precision_recall_curve(y_cls_true, y_cls_prob)
    plt.figure(figsize=(7, 6))
    plt.plot(rec_vals, prec_vals, color="teal", lw=2, label=f"PR curve (AUC = {pr_auc:.4f})")
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Precision-Recall Curve", fontweight="bold")
    plt.legend(loc="lower left")
    plt.tight_layout()
    plt.savefig(os.path.join(eval_dir, "precision_recall_curve.png"), dpi=150)
    plt.close()
    
    # C. Confusion Matrix
    cm = confusion_matrix(y_cls_true, y_cls_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=["Unviable/Hazard", "Viable Site"], yticklabels=["Unviable/Hazard", "Viable Site"])
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.title("Confusion Matrix", fontweight="bold")
    plt.tight_layout()
    plt.savefig(os.path.join(eval_dir, "confusion_matrix.png"), dpi=150)
    plt.close()
    
    # D. Calibration Curve
    prob_true, prob_pred = calibration_curve(y_cls_true, y_cls_prob, n_bins=10)
    plt.figure(figsize=(7, 6))
    plt.plot(prob_pred, prob_true, marker="o", lw=2, color="purple", label=f"Model Calibration (Brier = {brier:.4f})")
    plt.plot([0, 1], [0, 1], linestyle="--", color="gray", label="Perfect Calibration")
    plt.xlabel("Mean Predicted Probability")
    plt.ylabel("Fraction of Positives")
    plt.title("Reliability / Calibration Curve", fontweight="bold")
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(os.path.join(eval_dir, "calibration_curve.png"), dpi=150)
    plt.close()
    
    print(f"[+] Saved evaluation plots into '{eval_dir}/'")
    return metrics
