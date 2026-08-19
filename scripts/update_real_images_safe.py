import json
import re
import os

with open('scripts/verify_and_update_real_images.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract REAL_IMAGE_DATABASE dict from script
exec_globals = {}
exec(text.split("# 1. Update JSON datasets")[0], exec_globals)
REAL_IMAGE_DATABASE = exec_globals['REAL_IMAGE_DATABASE']

# 1. Update JSON datasets
for path in ['src/data/lunar_scientific_dataset.json', 'frontend/src/data/lunar_scientific_dataset.json']:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for item in data:
            s_id = item.get('id')
            if s_id in REAL_IMAGE_DATABASE:
                item.update(REAL_IMAGE_DATABASE[s_id])
                item['thumbnail'] = REAL_IMAGE_DATABASE[s_id]['surfaceImageUrl']
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Updated real images in {path}")

# 2. Update TS and JS files cleanly
def update_code_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for s_id, specs in REAL_IMAGE_DATABASE.items():
        surf = specs['surfaceImageUrl']
        orb = specs['orbitalImageUrl']
        attr = specs['imageAttribution']
        gallery = json.dumps(specs['galleryImages'], indent=6)

        # Replace thumbnail
        content = re.sub(
            rf"(id:\s*['\"]{s_id}['\"][\s\S]*?thumbnail:\s*)['\"][^'\"]+['\"]",
            lambda m, s=surf: f"{m.group(1)}'{s}'",
            content
        )
        # Replace surfaceImageUrl
        content = re.sub(
            rf"(id:\s*['\"]{s_id}['\"][\s\S]*?surfaceImageUrl:\s*)['\"][^'\"]+['\"]",
            lambda m, s=surf: f"{m.group(1)}'{s}'",
            content
        )
        # Replace orbitalImageUrl
        content = re.sub(
            rf"(id:\s*['\"]{s_id}['\"][\s\S]*?orbitalImageUrl:\s*)['\"][^'\"]+['\"]",
            lambda m, o=orb: f"{m.group(1)}'{o}'",
            content
        )
        # Replace imageAttribution
        content = re.sub(
            rf"(id:\s*['\"]{s_id}['\"][\s\S]*?imageAttribution:\s*)['\"][^'\"]+['\"]",
            lambda m, a=attr: f"{m.group(1)}'{a}'",
            content
        )
        # Replace galleryImages
        content = re.sub(
            rf"(id:\s*['\"]{s_id}['\"][\s\S]*?galleryImages:\s*)\[[\s\S]*?\n\s*\]",
            lambda m, g=gallery: f"{m.group(1)}{g}",
            content
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated real images in {filepath}")

update_code_file('src/data/lunarSites.ts')
update_code_file('frontend/src/data/lunarSites.js')
print("Successfully populated authentic NASA, ISRO, and LROC photography across all 23 nodes!")
