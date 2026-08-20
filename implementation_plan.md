# AI-Based Lunar Habitat ML Training & Integration Plan (Colab Edition)

This document outlines the revised strategy to build, train, and integrate the Machine Learning model, leveraging **Google Colab** to handle the massive 8GB DEM file without crashing your local machine, and feeding the results back into your local React frontend.

## Proposed Architecture

Since processing an 8GB `.tif` file requires significant RAM and geospatial libraries (`rasterio`, `gdal`) that can be tricky to configure locally, we will split the architecture:

1. **The Heavy Backend (Google Colab)**: We will write a Jupyter Notebook (`lunar_ml_pipeline.ipynb`) designed specifically for Colab. It will:
   - Download the 8GB DEM directly inside the Colab environment (Colab has ultra-fast download speeds).
   - Install all necessary geospatial libraries instantly.
   - Extract elevation and slope data to build a massive training dataset.
   - Train the XGBoost Regressor to predict the "Suitability Score".
   - Run inference on your 23 real sites and compute SHAP values.
   - Export a single, lightweight `ai_predictions.json` file.

2. **The Local Frontend (Your PC)**: 
   - You download the `ai_predictions.json` from Colab.
   - We will write a quick Python script locally that merges `ai_predictions.json` into your existing `src/data/lunarSites.ts` or `src/data/lunar_scientific_dataset.json`.
   - Your local React/Vite dashboard instantly displays the AI's actual predictions and confidence scores.

## Proposed Changes

We will create an `ml_pipeline/` directory in your project root to keep things organized.

### 1. Colab Notebook Creation
#### [NEW] `ml_pipeline/Lunar_Habitat_Training.ipynb`
- A fully-commented Jupyter Notebook that you can drag-and-drop into Google Colab.
- Contains all code for data extraction, XGBoost training, and inference.

### 2. Local Integration Scripts
#### [NEW] `ml_pipeline/apply_predictions.py`
- A local python script. Once you download `ai_predictions.json` from Colab, you run this script to automatically update your React frontend's data files.

#### [MODIFY] `src/data/lunarSites.ts` (if needed)
- Ensure the frontend can cleanly read the newly injected AI scores and SHAP data.

## Verification Plan

### Execution Steps
1. I will generate the `Lunar_Habitat_Training.ipynb` file.
2. You will upload it to Google Colab, run all cells, and download the resulting `ai_predictions.json`.
3. You will place `ai_predictions.json` in the `ml_pipeline/` folder locally.
4. We will run `python ml_pipeline/apply_predictions.py`.
5. We will verify the React dashboard (`npm run dev`) displays the live AI results.
