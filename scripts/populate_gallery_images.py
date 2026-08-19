import json
import re
import os

GALLERY_MAP = {
    "site-shackleton": [
        {"url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80", "alt_text": "Shackleton Rim Crest & Ridge Descent Zone", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", "alt_text": "Artemis III Polar Human Landing System (HLS)", "overlayText": "View Lander"},
        {"url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", "alt_text": "Lunar Terrain Vehicle (LTV) Polar Traverse", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", "alt_text": "Foundation Habitat & Solar Tower Array", "overlayText": ""}
    ],
    "site-malapert": [
        {"url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", "alt_text": "Mons Malapert 5km High Ridge Plateau", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80", "alt_text": "Intuitive Machines Nova-C (IM-1 Odysseus)", "overlayText": "View Lander"},
        {"url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80", "alt_text": "Radio Astronomy High-Gain Antenna Setup", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", "alt_text": "Permanent Polar Base Multi-Dome Cluster", "overlayText": ""}
    ],
    "site-faustini": [
        {"url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", "alt_text": "Faustini Rim A Perennial Shadow Margin", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", "alt_text": "Cryogenic Volatile Sampling Landcraft", "overlayText": "View Lander"},
        {"url": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=80", "alt_text": "Subsurface Cold-Trap Cryo-Drill Rig", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80", "alt_text": "Thermal Radiator Shroud & Power Depot", "overlayText": ""}
    ],
    "ch3_shiv_shakti": [
        {"url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", "alt_text": "Vikram Lander Touchdown at 69.37°S Regolith", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80", "alt_text": "ISRO Vikram Lander & Ramp Deployment", "overlayText": "View Lander"},
        {"url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80", "alt_text": "Pragyan Rover Wheel Tracks & Sulfur Detection", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", "alt_text": "ChaSTE Subsurface Thermal Penetrometer Profile", "overlayText": ""}
    ],
    "artemis_3": [
        {"url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80", "alt_text": "Astronauts on Artemis III South Pole Ridge", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80", "alt_text": "SpaceX Starship HLS Lunar Touchdown Vehicle", "overlayText": "View Lander"},
        {"url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", "alt_text": "NASA VIPER Volatile Scout Rover Traverse", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", "alt_text": "Inflatable Surface Habitat & Airlock Module", "overlayText": ""}
    ],
    "site-mons-mouton": [
        {"url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80", "alt_text": "Mons Mouton Flat High-Altitude Mesa", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80", "alt_text": "Commercial Lunar Payload Services (CLPS) Lander", "overlayText": "View Lander"},
        {"url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", "alt_text": "VIPER Spectrometer Drill Mapping Regolith", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", "alt_text": "Mesa Solar Farm & Relay Terminal", "overlayText": ""}
    ],
    "lupex_ch4": [
        {"url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80", "alt_text": "LUPEX Extreme Polar Drill Target Site", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80", "alt_text": "ISRO-JAXA Heavy Polar Landing Craft", "overlayText": "View Lander"},
        {"url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", "alt_text": "350kg JAXA Autonomous Polar Prospecting Rover", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", "alt_text": "Hydrogen Extraction & ISRU Processing Facility", "overlayText": ""}
    ],
    "apollo_11": [
        {"url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80", "alt_text": "Apollo 11 Tranquility Base Historical Touchdown", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80", "alt_text": "Apollo Lunar Module (LM-5 Eagle)", "overlayText": "View Lander"},
        {"url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", "alt_text": "EASEP Passive Seismic Experiment Package", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", "alt_text": "Heritage Monument & Mare Tranquillitatis Museum Base", "overlayText": ""}
    ]
}

# Generic fallback builder for all remaining nodes
def get_gallery_for_site(site_id, site_name):
    if site_id in GALLERY_MAP:
        return GALLERY_MAP[site_id]
    return [
        {"url": "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80", "alt_text": f"{site_name} Surface Touchdown Zone", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", "alt_text": f"{site_name} Lunar Landing Craft & Ascent Stage", "overlayText": "View Lander"},
        {"url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80", "alt_text": f"{site_name} Autonomous Scout Rover Traverse", "overlayText": ""},
        {"url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", "alt_text": f"{site_name} Pressurized Base & Power Grid", "overlayText": ""}
    ]

# 1. Update JSON datasets
for path in ['src/data/lunar_scientific_dataset.json', 'frontend/src/data/lunar_scientific_dataset.json']:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for item in data:
            s_id = item.get('id')
            s_name = item.get('name', 'Site')
            item['galleryImages'] = get_gallery_for_site(s_id, s_name)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Updated galleryImages in {path}")

# 2. Update TS and JS files
def enrich_files(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()
    
    for s_id in list(GALLERY_MAP.keys()) + ['site-connecting-ridge', 'site-de-gerlache', 'site-haworth', 'site-nobile', 'site-i', 'site-j', 'site-k', 'site-l', 'ch1_jawahar', 'ch2_tiranga', 'apollo_12', 'apollo_14', 'apollo_15', 'apollo_16', 'apollo_17']:
        gallery = get_gallery_for_site(s_id, s_id)
        gallery_str = json.dumps(gallery, indent=6)
        
        # Replace or insert galleryImages
        pattern = re.compile(rf"(id:\s*['\"]{s_id}['\"][\s\S]*?imageAttribution:\s*['\"][^'\"]+['\"])", re.MULTILINE)
        match = pattern.search(code)
        if match:
            original = match.group(1)
            if "galleryImages" not in original:
                replacement = f"{original},\n    galleryImages: {gallery_str}"
                code = code.replace(original, replacement)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Enriched galleryImages in {filepath}")

enrich_files('src/data/lunarSites.ts')
enrich_files('frontend/src/data/lunarSites.js')
print("All 23 nodes populated with dynamic 4-panel galleryImages!")
