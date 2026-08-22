import json

with open(r'c:\Users\Ayush69\Downloads\Lunar-project-main\Lunar-project-main\frontend\src\data\ai_predictions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    preds = data['predictions']

print(f"Total predictions: {len(preds)}")
for p in preds:
    print(f"{p['id']:25s} | Rank: {p['ai_rank']:2d} | AI Score: {p['ai_suitability_score']:.2f} | MCDA: {p['original_mcda_score']:.1f} | Tier: {p['suitability_tier']}")
 
