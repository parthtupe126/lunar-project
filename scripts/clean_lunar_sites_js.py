import re

with open('src/data/lunarSites.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Strip all TS annotations
code = re.sub(r'import\s+\{\s*LunarSite\s*\}\s+from\s+[\'\"].*?[\'\"];\n?', '', code)
code = re.sub(r'export function latLonToVector3\(lat: number, lon: number, radius = \d+(\.\d+)?\)', 'export function latLonToVector3(lat, lon, radius = 1.5)', code)
code = re.sub(r':\s*LunarSite\[\]', '', code)
code = re.sub(r':\s*LunarMission\[\]', '', code)
code = re.sub(r':\s*LunarLandmark\[\]', '', code)
code = re.sub(r'export\s+interface\s+LunarMission\s*\{[\s\S]*?\}\n?', '', code)
code = re.sub(r'export\s+interface\s+LunarLandmark\s*\{[\s\S]*?\}\n?', '', code)

with open('frontend/src/data/lunarSites.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated frontend/src/data/lunarSites.js cleanly!")
