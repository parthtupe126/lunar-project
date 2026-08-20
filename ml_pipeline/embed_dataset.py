import json

# Load the clean embedded dataset
with open('ml_pipeline/embedded_dataset.json', 'r', encoding='utf-8') as f:
    raw_json_str = f.read()

# Load the existing notebook
with open('ml_pipeline/Lunar_Habitat_Training.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Build the replacement data-loading cell source
cell_source = [
    "import json\n",
    "import numpy as np\n",
    "import pandas as pd\n",
    "\n",
    "# ── Dataset is embedded directly — no upload needed! ─────────────────────\n",
    "LUNAR_DATASET_JSON = " + repr(raw_json_str) + "\n",
    "\n",
    "raw_sites = json.loads(LUNAR_DATASET_JSON)\n",
    "print(f'✅ Loaded {len(raw_sites)} real lunar sites directly from embedded dataset')\n",
    "\n",
    "def flatten_site(site):\n",
    "    terrain = site.get('terrain_dem', {})\n",
    "    ice     = site.get('water_ice', {})\n",
    "    solar   = site.get('solar_illumination', {})\n",
    "    rad     = site.get('radiation_environment', {})\n",
    "    comms   = site.get('geographic_communications', {})\n",
    "    ai      = site.get('ai_ml_matrix', {})\n",
    "    temp    = site.get('environmental_temperatures', {})\n",
    "    coords  = site.get('coordinates', {})\n",
    "    return {\n",
    "        'id':                        site.get('id'),\n",
    "        'name':                      site.get('name'),\n",
    "        'node_id':                   site.get('node_id'),\n",
    "        'code':                      site.get('code'),\n",
    "        'latitude':                  coords.get('latitude', 0),\n",
    "        'longitude':                 coords.get('longitude', 0),\n",
    "        'elevation_m':               terrain.get('elevation_m', 0),\n",
    "        'slope_deg':                 terrain.get('slope_deg', 0),\n",
    "        'roughness_rms_m':           terrain.get('roughness_rms_m', 0),\n",
    "        'accessibility_index':       terrain.get('accessibility_index_100', 0),\n",
    "        'ice_probability_pct':       ice.get('ice_probability_pct', 0),\n",
    "        'hydrogen_ppm':              ice.get('hydrogen_content_ppm', 0),\n",
    "        'radar_cpr':                 ice.get('radar_cpr', 0),\n",
    "        'distance_to_psr_m':         ice.get('distance_to_psr_m', 0),\n",
    "        'estimated_ice_depth_m':     ice.get('estimated_ice_depth_m', 0),\n",
    "        'annual_sunlight_pct':       solar.get('annual_sunlight_pct', 0),\n",
    "        'max_continuous_light_days': solar.get('max_continuous_light_days', 0),\n",
    "        'max_continuous_dark_days':  solar.get('max_continuous_dark_days', 0),\n",
    "        'avg_solar_elevation_deg':   solar.get('avg_solar_elevation_deg', 0),\n",
    "        'seasonal_variance_pct':     solar.get('seasonal_variance_pct', 0),\n",
    "        'gcr_dose_msv_yr':           rad.get('gcr_dose_msv_yr', 0),\n",
    "        'dose_rate_usv_h':           rad.get('dose_rate_usv_h', 0),\n",
    "        'terrain_shielding_pct':     rad.get('terrain_shielding_factor_pct', 0),\n",
    "        'earth_los_pct':             comms.get('earth_direct_los_pct', 0),\n",
    "        'relay_required':            1 if comms.get('relay_satellite_required', False) else 0,\n",
    "        'temp_min_k':                temp.get('temp_min_k', 0),\n",
    "        'temp_max_k':                temp.get('temp_max_k', 0),\n",
    "        'diurnal_swing_k':           temp.get('diurnal_temperature_swing_k', 0),\n",
    "        'mcda_suitability_score':    ai.get('mcda_suitability_score', 0),\n",
    "        'ai_confidence_pct':         ai.get('ai_confidence_pct', 0),\n",
    "        'suitability_tier':          ai.get('suitability_tier', 'MODERATE'),\n",
    "    }\n",
    "\n",
    "real_df = pd.DataFrame([flatten_site(s) for s in raw_sites])\n",
    "real_df['dem_elevation_m'] = real_df['elevation_m']\n",
    "print(f'✅ Feature matrix ready: {real_df.shape[0]} sites x {real_df.shape[1]} columns')\n",
    "real_df[['name', 'mcda_suitability_score', 'suitability_tier']].head(10)\n",
]

# Find & replace the old data-loading cell (Step 2)
replaced = False
for i, cell in enumerate(nb['cells']):
    if cell['cell_type'] == 'code' and 'OPTION A' in ''.join(cell['source']):
        nb['cells'][i]['source'] = cell_source
        replaced = True
        print(f'Replaced cell index {i}')
        break

if not replaced:
    print('WARNING: Target cell not found!')

# Save the updated notebook
with open('ml_pipeline/Lunar_Habitat_Training.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print('Done: Notebook updated with embedded dataset!')
