"""
apply_predictions.py
─────────────────────────────────────────────────────────────────────────────
Lunar Habitat AI — Frontend Integration Script
─────────────────────────────────────────────────────────────────────────────

USAGE:
  1. Download ai_predictions.json from Google Colab.
  2. Place it in this ml_pipeline/ folder.
  3. Run: python ml_pipeline/apply_predictions.py

This script:
  - Reads ai_predictions.json (output of the Colab notebook)
  - Merges AI scores, confidence, tier, factors, and SHAP data into
    src/data/lunar_scientific_dataset.json
  - Generates a summary report

"""

import json
import os
import sys
import shutil
from datetime import datetime

# ── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR      = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT    = os.path.dirname(SCRIPT_DIR)
PREDICTIONS_IN  = os.path.join(SCRIPT_DIR, 'ai_predictions.json')
DATASET_PATH    = os.path.join(PROJECT_ROOT, 'src', 'data', 'lunar_scientific_dataset.json')
BACKUP_PATH     = os.path.join(SCRIPT_DIR, f'lunar_scientific_dataset_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')

def load_json(path, label):
    if not os.path.exists(path):
        print(f'❌ ERROR: {label} not found at:\n   {path}')
        sys.exit(1)
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    print('=' * 65)
    print('🌙 LUNAR HABITAT AI — Frontend Integration Script')
    print('=' * 65)

    # ── 1. Load files ─────────────────────────────────────────────────────────
    print('\n📂 Loading files...')
    predictions_data = load_json(PREDICTIONS_IN, 'ai_predictions.json')
    dataset          = load_json(DATASET_PATH,   'lunar_scientific_dataset.json')

    predictions = predictions_data['predictions']
    metadata    = predictions_data['metadata']

    print(f'   ✅ Loaded {len(predictions)} AI predictions')
    print(f'   ✅ Loaded {len(dataset)} sites from dataset')
    print(f'   Model: {metadata["model_version"]} | R²={metadata["model_r2"]} | MAE={metadata["model_mae"]}')

    # ── 2. Backup original dataset ────────────────────────────────────────────
    shutil.copy2(DATASET_PATH, BACKUP_PATH)
    print(f'\n💾 Original dataset backed up to:\n   {BACKUP_PATH}')

    # ── 3. Build prediction lookup by id ─────────────────────────────────────
    pred_by_id = {p['id']: p for p in predictions}

    # ── 4. Merge AI predictions into dataset ──────────────────────────────────
    print('\n🔄 Merging AI predictions...')
    updated_count = 0
    not_found = []

    for site in dataset:
        site_id = site.get('id')
        pred    = pred_by_id.get(site_id)

        if pred is None:
            not_found.append(site_id)
            continue

        # Update ai_ml_matrix with real model outputs
        if 'ai_ml_matrix' not in site:
            site['ai_ml_matrix'] = {}

        site['ai_ml_matrix']['mcda_suitability_score'] = pred['ai_suitability_score']
        site['ai_ml_matrix']['ai_confidence_pct']       = pred['ai_confidence_pct']
        site['ai_ml_matrix']['suitability_tier']         = pred['suitability_tier']
        site['ai_ml_matrix']['ai_rank']                  = pred['ai_rank']
        site['ai_ml_matrix']['score_delta_from_mcda']    = pred['score_delta']
        site['ai_ml_matrix']['model_version']            = metadata['model_version']
        site['ai_ml_matrix']['model_r2']                 = metadata['model_r2']
        site['ai_ml_matrix']['model_mae']                = metadata['model_mae']
        site['ai_ml_matrix']['generated_at']             = metadata['generated_at']

        # Inject SHAP top features
        site['ai_ml_matrix']['shap_top_features'] = pred['shap_top_features']

        # Inject AI-computed factor breakdown (for the factor radar chart)
        site['ai_factors'] = pred['factors']

        updated_count += 1

    print(f'   ✅ Updated {updated_count} sites with AI predictions')
    if not_found:
        print(f'   ⚠️  {len(not_found)} sites not matched: {not_found}')

    # ── 5. Save updated dataset ───────────────────────────────────────────────
    with open(DATASET_PATH, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)

    print(f'\n✅ Dataset updated at:\n   {DATASET_PATH}')

    # ── 6. Print summary report ───────────────────────────────────────────────
    print('\n' + '=' * 65)
    print('📊 AI SITE RANKING SUMMARY')
    print('=' * 65)
    sorted_preds = sorted(predictions, key=lambda x: x['ai_suitability_score'], reverse=True)

    tier_colors = {
        'HIGHLY SUITABLE': '🟢',
        'SUITABLE':        '🔵',
        'MODERATE':        '🟡',
        'POOR':            '🔴',
    }

    for p in sorted_preds:
        icon  = tier_colors.get(p['suitability_tier'], '⚪')
        delta = p['score_delta']
        delta_str = f'+{delta:.1f}' if delta >= 0 else f'{delta:.1f}'
        print(f"  #{p['ai_rank']:2d} {icon} {p['name'][:45]:45s} "
              f"Score: {p['ai_suitability_score']:5.1f}  "
              f"Δ{delta_str:>6}  "
              f"Conf: {p['ai_confidence_pct']:.0f}%")

    print('\n' + '=' * 65)
    print('🚀 NEXT STEP: Start your React dev server!')
    print('   Run: npm run dev')
    print('   Then open: http://localhost:5173')
    print('=' * 65)


if __name__ == '__main__':
    main()
