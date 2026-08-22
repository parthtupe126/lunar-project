# 📁 LUNA-DSS: Machine Learning Pipeline Directory Taxonomy

Every file in this project is organized into modular directories categorized strictly by their **functional purpose** and **file type**:

```
d:\MitWPU(hackathon)\
│
├── 📂 src\                   # CORE PYTHON MACHINE LEARNING MODULES (.py)
│   ├── train_xgboost.py            # Master single-command orchestration engine
│   ├── data_audit.py               # Automated schema, bounds, null & health auditing
│   ├── preprocessing.py            # Coordinate normalization & physical bounds cleaning
│   ├── feature_engineering.py      # Scientific derived feature construction engine
│   ├── spatial_validation.py       # 1.5° Tile Clustering & GroupKFold anti-leakage splitting
│   ├── hyperparameter_tuning.py    # Spatial Cross-Validated hyperparameter optimization
│   ├── evaluate.py                 # Multi-metric evaluation & diagnostics generator
│   ├── explainability.py           # SHAP tree explainers & feature attributions
│   ├── prediction.py               # Candidate scoring, probability calibration & ranking
│   ├── mapping.py                  # 2D & 3D Polar cartographic mapping engine
│   └── __init__.py                 # Python package initialization
│
├── 📂 notebooks\             # JUPYTER NOTEBOOKS (.ipynb)
│   ├── lunar_site_selection_xgboost.ipynb  # Complete 12-stage Google Colab / local notebook
│   └── lunar_habitat_ai_random_forest.ipynb # Baseline Random Forest & EDA interactive notebook
│
├── 📂 models\                # SERIALIZED TRAINED ML MODELS (.pkl, .json)
│   ├── lunar_xgboost_regressor.pkl         # Trained XGBoost Regressor (Suitability Score 0-100)
│   └── lunar_xgboost_classifier.pkl        # Trained XGBoost Classifier (Viable vs Hazard)
│
├── 📂 data\                  # MULTI-SENSOR CSV DATASETS (.csv)
│   ├── lunar_ml_training_dataset.csv       # Master multi-sensor training dataset (8,000 samples)
│   ├── lunar_south_pole_grid.csv           # Candidate polar exploration grid (10,000 samples)
│   ├── official_23_sites_ml_ready.csv      # NASA Artemis 23 benchmark ground truth nodes
│   ├── official_23_sites_lola_118m_enriched.csv # 23 sites enriched with LOLA 118m DEM altimetry
│   ├── diviner_lunar_thermal_dataset.csv   # Diviner surface temperatures (5,000 samples)
│   ├── lend_hydrogen_ice_dataset.csv       # LEND neutron suppression & WEH (5,000 samples)
│   ├── lro_illumination_polar_dataset.csv  # LRO solar illumination & darkness (5,000 samples)
│   ├── lroc_optical_morphology_dataset.csv # LROC NAC rock hazards (5,000 samples)
│   └── pds_geochemistry_mineralogy_dataset.csv # PDS M3 geochemistry (5,000 samples)
│
├── 📂 preprocessing\         # PREPROCESSING ARTIFACTS & SCHEMAS (.json, .pkl)
│   ├── feature_columns.json                # JSON schema of all 23 engineered physical features
│   └── preprocessing_pipeline.pkl          # Serialized scikit-learn preprocessor pipeline
│
├── 📂 predictions\           # INFERENCE OUTPUTS & PREDICTION CATALOGS (.csv)
│   ├── top_10_lunar_sites.csv              # Top 10 prime candidate landing locations
│   ├── lunar_site_predictions.csv          # Scored 10,000 polar candidate grid points
│   └── official_23_site_predictions.csv    # LOSO-CV predictions for 23 NASA Artemis sites
│
├── 📂 evaluation\            # METRICS & DIAGNOSTIC VISUALIZATIONS (.png, .json)
│   ├── metrics.json                        # Machine-readable performance metrics
│   ├── spatial_prediction_map.png          # 2D Lunar South Pole Suitability Heatmap
│   ├── top_candidate_site_map.png          # Cartographic map of Top 10 candidate landing nodes
│   ├── roc_curve.png                       # Receiver Operating Characteristic curve
│   ├── precision_recall_curve.png          # Precision-Recall curve
│   ├── confusion_matrix.png                # Classifier Confusion Matrix heatmap
│   ├── calibration_curve.png               # Reliability calibration curve
│   └── suitability_score_distribution.png  # Histogram of predicted suitability scores
│
├── 📂 explainability\        # SHAP EXPLAINABILITY ARTIFACTS (.png)
│   ├── shap_summary.png                    # SHAP Beeswarm summary plot
│   ├── shap_bar.png                        # Global feature importance ranking bar chart
│   └── shap_dependence_plots\              # Feature dependence curves (slope, temp, ice, sun)
│
├── 📂 reports\               # SCIENTIFIC REPORTS & DICTIONARIES (.md, .csv)
│   ├── model_report.md                     # Comprehensive Scientific Performance Report
│   ├── dataset_audit.csv                   # Full data audit report across 15 CSV datasets
│   ├── feature_dictionary.csv              # Physical descriptions & formulas for 23 features
│   └── sensor_ablation_results.csv         # Comparative ablation results (Model A -> Model E)
│
└── 📂 scripts\               # DATA INGESTION & DOWNLOAD UTILITIES (.py)
    ├── download_diviner_dataset.py         # Diviner dataset extraction script
    ├── download_lend_dataset.py            # LEND dataset extraction script
    ├── download_lro_illumination_dataset.py # LRO illumination extraction script
    ├── download_lroc_dataset.py            # LROC morphology extraction script
    ├── download_pds_mineralogy_dataset.py  # PDS geochemistry extraction script
    ├── extract_lola_dem_features.py        # LOLA 118m DEM window-reading feature extractor
    └── export_official_23_sites_dataset.py # 23 official sites data exporter
```
