import json
import re
import os

IMAGE_SPECS = {
    "site-shackleton": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)"
    },
    "site-malapert": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / LRO / Intuitive Machines IM-1"
    },
    "site-faustini": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / Diviner Science Team / UCLA"
    },
    "site-connecting-ridge": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / GSFC / LROC (Artemis III Target Survey)"
    },
    "site-de-gerlache": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / GSFC / ASU Lunaserv WMS"
    },
    "site-haworth": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / LRO LOLA Altimetry Team"
    },
    "site-mons-mouton": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / VIPER Science Team / Ames Research Center"
    },
    "site-nobile": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / GSFC / ASU / LRO ShadowCam"
    },
    "site-i": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / Southwest Research Institute (LAMP Team)"
    },
    "site-j": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "JAXA / SELENE (Kaguya) Terrain Camera & LROC NAC"
    },
    "site-k": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / LCROSS Science Team / ARC"
    },
    "site-l": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / GSFC / ASU / LRO Narrow Angle Camera"
    },
    "ch3_shiv_shakti": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "ISRO / ISTRAC / Pragyan Rover NavCam & Chandrayaan-2 OHRC"
    },
    "ch1_jawahar": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "ISRO / Moon Impact Probe & NASA M3 Team"
    },
    "ch2_tiranga": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "ISRO / Chandrayaan-2 Dual-Frequency SAR & OHRC"
    },
    "lupex_ch4": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "ISRO / JAXA Lunar Polar Exploration Mission Concept"
    },
    "apollo_11": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / Neil Armstrong & Buzz Aldrin / LROC NAC (M102360879R)"
    },
    "apollo_12": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / Pete Conrad & Alan Bean / Surveyor 3 Survey"
    },
    "apollo_14": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / Alan Shepard & Edgar Mitchell / Cone Crater Traverses"
    },
    "apollo_15": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / David Scott & James Irwin / Lunar Roving Vehicle LRV-1"
    },
    "apollo_16": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / John Young & Charles Duke / Cayley Formation"
    },
    "apollo_17": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / Gene Cernan & Harrison Schmitt (Shorty Crater)"
    },
    "artemis_3": {
        "surfaceImageUrl": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
        "orbitalImageUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        "imageAttribution": "NASA / SpaceX / Axiom Space / LROC NAC High-Res Mosaic"
    }
}

# 1. Update JSON datasets
for path in ['src/data/lunar_scientific_dataset.json', 'frontend/src/data/lunar_scientific_dataset.json']:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for item in data:
            site_id = item.get('id')
            if site_id in IMAGE_SPECS:
                item.update(IMAGE_SPECS[site_id])
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Updated {path}")

# 2. Update TS and JS lunarSites files
def enrich_code(filepath, is_ts=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()
    
    for site_id, specs in IMAGE_SPECS.items():
        # Look for thumbnail in this site's block
        pattern = re.compile(rf"(id:\s*['\"]{site_id}['\"][\s\S]*?thumbnail:\s*['\"][^'\"]+['\"])", re.MULTILINE)
        match = pattern.search(code)
        if match:
            original_match = match.group(1)
            if "surfaceImageUrl" not in original_match:
                replacement = (
                    f"{original_match},\n"
                    f"    surfaceImageUrl: '{specs['surfaceImageUrl']}',\n"
                    f"    orbitalImageUrl: '{specs['orbitalImageUrl']}',\n"
                    f"    imageAttribution: '{specs['imageAttribution']}'"
                )
                code = code.replace(original_match, replacement)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Updated {filepath}")

enrich_code('src/data/lunarSites.ts', is_ts=True)
enrich_code('frontend/src/data/lunarSites.js', is_ts=False)
print("Enrichment complete!")
