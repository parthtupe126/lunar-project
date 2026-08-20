import json

with open('src/data/lunar_scientific_dataset.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, s in enumerate(data, 1):
    sid = s['id']
    code = s['code']
    name = s['name']
    coords = s['coordinates']
    lat = coords['latitude']
    lon = coords['longitude']
    dem = s['terrain_dem']
    ice = s['water_ice']
    sun = s['solar_illumination']
    rad = s['radiation_environment']
    ml = s['ai_ml_matrix']
    agency = s.get('imageAttribution', 'NASA / ISRO / JAXA')
    
    print(f"{i:02d} | {code} | {name} | {lat}° | {lon}° | {dem['elevation_m']}m | {dem['slope_deg']}° | {ice['ice_probability_pct']}% ({ice['hydrogen_content_ppm']} ppm) | {sun['annual_sunlight_pct']}% | {rad['gcr_dose_msv_yr']} mSv | {ml['mcda_suitability_score']} | {agency}")
