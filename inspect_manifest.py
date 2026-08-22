import json
import os

with open('lunar_visual_archive/node_visual_geological_manifest.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

nodes = manifest.get('nodes', [])
print(f"Total Nodes in Manifest: {len(nodes)}\n")

for i, n in enumerate(nodes, 1):
    nid = n.get('node_id')
    name = n.get('canonical_name')
    folder = n.get('folder_name')
    coords = n.get('coordinates', {})
    lat = coords.get('lat')
    lon = coords.get('lon')
    region = n.get('lunar_region')
    terrain = n.get('terrain_summary', {})
    slope = terrain.get('mean_slope_deg')
    elev = terrain.get('elevation_m')
    geol = n.get('geological_context', {})
    lith = geol.get('primary_lithology')
    print(f"[{i:02d}] ID: {nid} | {name} | Folder: {folder}")
    print(f"     Lat: {lat}°, Lon: {lon}° | Elev: {elev}m | Slope: {slope}° | Region: {region}")
    print(f"     Lithology: {lith}")
    print(f"     Images available: {list(n.get('images', {}).keys())}")
    print()
