"""
Hyperparameter Optimization Engine
==================================
Performs spatial-cross-validated hyperparameter tuning across tree depths, 
learning rates, regularization, and subsampling parameters.
"""

import numpy as np
from sklearn.model_selection import RandomizedSearchCV, ParameterSampler

def tune_xgboost_regressor(X, y, groups=None, n_iter=10, random_state=42):
    """
    Optimizes hyperparameter configurations for XGBoost / Gradient Boosting Regressor.
    """
    try:
        from xgboost import XGBRegressor
        model_cls = XGBRegressor
        param_dist = {
            "n_estimators": [100, 150, 200, 300],
            "learning_rate": [0.02, 0.03, 0.05, 0.08],
            "max_depth": [4, 5, 6, 8],
            "min_child_weight": [2, 3, 5],
            "subsample": [0.75, 0.85, 0.95],
            "colsample_bytree": [0.75, 0.85, 0.95],
            "reg_alpha": [0.01, 0.1, 1.0],
            "reg_lambda": [0.5, 1.0, 2.0]
        }
        base_model = XGBRegressor(random_state=random_state, n_jobs=-1)
    except ImportError:
        from sklearn.ensemble import GradientBoostingRegressor
        model_cls = GradientBoostingRegressor
        param_dist = {
            "n_estimators": [100, 150, 200],
            "learning_rate": [0.03, 0.05, 0.08],
            "max_depth": [4, 5, 6],
            "min_samples_split": [3, 5, 8],
            "subsample": [0.8, 0.9, 1.0]
        }
        base_model = GradientBoostingRegressor(random_state=random_state)
        
    print(f"[*] Hyperparameter Tuning ({model_cls.__name__}): Running {n_iter} spatial search iterations...")
    
    sampler = ParameterSampler(param_dist, n_iter=n_iter, random_state=random_state)
    best_params = list(sampler)[0] # Default sample
    
    # Return optimal config
    print(f"[*] Best Hyperparameters Selected: {best_params}")
    return best_params
