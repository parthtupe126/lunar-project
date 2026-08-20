# ?? Lunar Habitat AI — ML Pipeline

> **XGBoost-based Habitat Suitability Predictor** trained on 23 real lunar sites.
> MitWPU Hackathon · Google Colab Edition

---

## ?? Folder Structure

```
ml_pipeline/
+-- Lunar_Habitat_Training.ipynb   # ?? Main training notebook (run on Google Colab)
+-- embedded_dataset.json          # ?? 23-site scientific dataset (input to notebook)
+-- ai_predictions.json            # ?? Model output — AI scores for all 23 sites
+-- apply_predictions.py           # ?? Merges ai_predictions.json ? React frontend data
+-- embed_dataset.py               # ???  Dev utility: re-embeds dataset into the notebook
+-- README.md                      # ?? This file
```

---

## ?? Quick Start (Run the ML Model)

### Step 1 — Open the Notebook in Google Colab

1. Go to https://colab.research.google.com
2. Upload `Lunar_Habitat_Training.ipynb`
   *(the dataset is already embedded — no extra upload needed)*
3. **Runtime ? Change runtime type ? T4 GPU**
4. **Runtime ? Run all**

The notebook will:
- Install all Python dependencies automatically
- Load the 23 real lunar site dataset (embedded directly in the notebook)
- Download & sample the 8 GB LOLA Global DEM for real topographic elevation data
- Engineer features & build a ~15,000-sample augmented training set
- Train an XGBoost model (Optuna-tuned, R² ˜ 0.956, MAE ˜ 1.30)
- Run inference on all 23 sites
- Compute SHAP feature importance
- Export **`ai_predictions.json`**

### Step 2 — Download `ai_predictions.json`

After the notebook finishes, download `ai_predictions.json` from the Colab
file panel and place it in `ml_pipeline/`.

### Step 3 — Merge Predictions into the Frontend

```bash
# From the project root:
python ml_pipeline/apply_predictions.py
```

Then start the dev server:

```bash
npm run dev
```

---

## ?? Python Dependencies

All installed automatically inside Colab. For local development:

```bash
pip install -r requirements.txt
```

---

## ?? Model Details

| Attribute        | Value                                                     |
|------------------|-----------------------------------------------------------|
| Algorithm        | XGBoost (GPU — `tree_method: hist`, `device: cuda`)       |
| Tuning           | Optuna (100 trials)                                       |
| Training samples | ~15,000 (synthetic augmentation of 23 real sites)         |
| R² score         | **0.9562**                                                |
| MAE              | **1.30 points**                                           |
| Features         | 23 lunar science features                                 |
| Target           | `mcda_suitability_score` (0–100)                          |

### Feature Columns

```
elevation_m, slope_deg, roughness_rms_m, accessibility_index,
ice_probability_pct, hydrogen_ppm, radar_cpr, distance_to_psr_m,
estimated_ice_depth_m, annual_sunlight_pct, max_continuous_light_days,
max_continuous_dark_days, avg_solar_elevation_deg, seasonal_variance_pct,
gcr_dose_msv_yr, dose_rate_usv_h, terrain_shielding_pct,
earth_los_pct, relay_required, temp_min_k, temp_max_k,
diurnal_swing_k, dem_elevation_m
```

---

## ?? Integration with the React Frontend

`apply_predictions.py` reads `ai_predictions.json` and merges the following fields
into every site in `src/data/lunar_scientific_dataset.json`:

| Field injected                          | Description                        |
|-----------------------------------------|------------------------------------|
| `ai_ml_matrix.mcda_suitability_score`  | XGBoost predicted score (0–100)    |
| `ai_ml_matrix.ai_confidence_pct`       | Model confidence %                 |
| `ai_ml_matrix.suitability_tier`        | HIGHLY SUITABLE / SUITABLE / etc.  |
| `ai_ml_matrix.ai_rank`                 | Rank among all 23 sites            |
| `ai_ml_matrix.score_delta_from_mcda`   | ? vs original MCDA score           |
| `ai_ml_matrix.model_version`           | `xgb_lunar_v1.0`                   |
| `ai_ml_matrix.model_r2` / `model_mae`  | Model metrics                      |
| `ai_ml_matrix.shap_top_features`       | Top SHAP feature drivers           |
| `ai_factors`                           | Radar-chart factor breakdown       |

---

## ??? Developer Notes

### Re-embedding the dataset into the notebook

If you update `embedded_dataset.json`, run:

```bash
python ml_pipeline/embed_dataset.py
```

This updates the data-loading cell in `Lunar_Habitat_Training.ipynb` so Colab
requires no file uploads.

### Backup files

`apply_predictions.py` auto-backs up the dataset before merging:
```
ml_pipeline/lunar_scientific_dataset_backup_YYYYMMDD_HHMMSS.json
```
These backup files are gitignored.

---

## ?? Data Sources

| Dataset                    | Source                                      |
|----------------------------|---------------------------------------------|
| LOLA Global DEM (118 m/px) | NASA / USGS PDS                             |
| Lunar scientific dataset   | ISRO · NASA · JAXA mission data             |
| Chandrayaan-1/2/3 in-situ  | ISRO public mission archives                |
| Apollo mission benchmarks  | NASA Apollo Surface Journal                 |
