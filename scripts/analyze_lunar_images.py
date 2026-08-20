import os
import json
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
BASE_DIR = "lunar_node_assets"

def analyze_node_images(node_dir):
    wac_path = os.path.join(node_dir, "wac_global.png")
    lola_color_path = os.path.join(node_dir, "lola_sldem2015.tif")
    lola_bw_path = os.path.join(node_dir, "lola_sldem2015_slope.png")
    
    results = {}
    
    # 1. Analyze Albedo / Reflectance (WAC)
    if os.path.exists(wac_path) and os.path.getsize(wac_path) > 0:
        try:
            print(f"  Reading {wac_path}...")
            with Image.open(wac_path) as img:
                img.load()  # Force load
                img_gray = img.convert('L')
                arr = np.array(img_gray)
                results['mean_reflectance'] = float(np.mean(arr))
                results['reflectance_variance'] = float(np.var(arr))
        except Exception as e:
            results['wac_error'] = str(e)
            
    # 2. Analyze Topography Color Map
    if os.path.exists(lola_color_path) and os.path.getsize(lola_color_path) > 0:
        try:
            print(f"  Reading {lola_color_path}...")
            with Image.open(lola_color_path) as img:
                img.load() # Force load
                arr = np.array(img)
                # Just get some basic color stats if it's RGB
                results['elevation_color_mean'] = [float(x) for x in np.mean(arr, axis=(0,1))[:3]] if len(arr.shape) == 3 else float(np.mean(arr))
        except Exception as e:
            results['lola_color_error'] = str(e)
            
    # 3. Analyze Slope / Roughness (LOLA BW)
    if os.path.exists(lola_bw_path) and os.path.getsize(lola_bw_path) > 0:
        try:
            print(f"  Reading {lola_bw_path}...")
            with Image.open(lola_bw_path) as img:
                img.load() # Force load
                img_gray = img.convert('L')
                arr = np.array(img_gray)
                results['mean_roughness_indicator'] = float(np.mean(arr))
                results['roughness_variance'] = float(np.var(arr))
        except Exception as e:
            results['lola_bw_error'] = str(e)
            
    return results

def main():
    print("Starting Lunar Node Image Analysis...")
    analysis_report = {}
    
    for item in os.listdir(BASE_DIR):
        node_dir = os.path.join(BASE_DIR, item)
        if os.path.isdir(node_dir):
            print(f"Analyzing {item}...")
            res = analyze_node_images(node_dir)
            analysis_report[item] = res
            
    out_path = os.path.join(BASE_DIR, "image_analysis_report.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(analysis_report, f, indent=2)
        
    print(f"Analysis complete. Report saved to {out_path}")

if __name__ == "__main__":
    main()
