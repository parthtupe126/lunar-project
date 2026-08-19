import re
import os

with open('src/data/lunarSites.ts', 'r', encoding='utf-8') as f:
    ts_code = f.read()

# Strip TypeScript specific type annotations
js_code = ts_code
js_code = re.sub(r'import\s+\{\s*LunarSite\s*\}\s+from\s+[\'\"].*?[\'\"];\n?', '', js_code)
js_code = re.sub(r':\s*LunarSite\[\]', '', js_code)
js_code = re.sub(r':\s*LunarMission\[\]', '', js_code)
js_code = re.sub(r':\s*LunarLandmark\[\]', '', js_code)
js_code = re.sub(r'export\s+interface\s+LunarMission\s*\{[\s\S]*?\}\n?', '', js_code)
js_code = re.sub(r'export\s+interface\s+LunarLandmark\s*\{[\s\S]*?\}\n?', '', js_code)

os.makedirs('frontend/src/data', exist_ok=True)
with open('frontend/src/data/lunarSites.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print("Successfully synced lunarSites.js for frontend!")
