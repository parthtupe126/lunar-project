import os
import json
import time
import urllib.request
import urllib.parse
import concurrent.futures
from datetime import datetime

BASE_OUTPUT_DIR = "lunar_node_assets"
PRIMARY_WMS = "https://wms.lroc.asu.edu/lroc/wms"
DELTA = 0.1  # Dynamic bounding box delta in degrees
MIN_FILE_SIZE_BYTES = 5 * 1024  # 5 KB validation threshold

# 23 Predefined Lunar Exploration & Habitat Nodes
LUNAR_NODES = [
    {"id": "01_Shackleton_Crater", "name": "Shackleton Crater Rim", "lat": -89.28, "lon": 15.40},
    {"id": "02_Mons_Malapert", "name": "Mons Malapert Plateau", "lat": -85.99, "lon": 12.90},
    {"id": "03_Faustini_Rim_A", "name": "Faustini Rim A", "lat": -87.15, "lon": 77.00},
    {"id": "04_Connecting_Ridge", "name": "Connecting Ridge (Shackleton-de Gerlache)", "lat": -88.60, "lon": -31.70},
    {"id": "05_de_Gerlache_Rim", "name": "de Gerlache Rim", "lat": -85.90, "lon": 76.30},
    {"id": "06_Haworth_Crater_Rim", "name": "Haworth Crater Rim North", "lat": -87.40, "lon": -5.10},
    {"id": "07_Mons_Mouton", "name": "Mons Mouton (Leibnitz Beta)", "lat": -85.10, "lon": 31.50},
    {"id": "08_Nobile_Crater_Rim", "name": "Nobile Crater Rim", "lat": -85.20, "lon": 53.50},
    {"id": "09_Amundsen_Crater", "name": "Amundsen Crater (Site I)", "lat": -84.50, "lon": 82.80},
    {"id": "10_Marius_Hills_Lava_Tube", "name": "Marius Hills Lava Tube Skylight", "lat": 14.20, "lon": -56.70},
    {"id": "11_Cabeus_Crater", "name": "Cabeus Crater (LCROSS Site)", "lat": -84.90, "lon": -35.50},
    {"id": "12_Shoemaker_Crater_Rim", "name": "Shoemaker Crater Rim South", "lat": -88.10, "lon": 44.90},
    {"id": "13_Chandrayaan3_Shiv_Shakti", "name": "Chandrayaan-3 (Shiv Shakti Point)", "lat": -69.373, "lon": 32.319},
    {"id": "14_Chandrayaan1_Jawahar", "name": "Chandrayaan-1 (Jawahar Point)", "lat": -89.90, "lon": 0.0},
    {"id": "15_Chandrayaan2_Tiranga", "name": "Chandrayaan-2 (Tiranga Point)", "lat": -70.83, "lon": 22.68},
    {"id": "16_Chandrayaan4_LUPEX", "name": "Chandrayaan-4 / LUPEX Candidate", "lat": -89.40, "lon": 145.0},
    {"id": "17_Apollo11_Tranquility_Base", "name": "Apollo 11 (Statio Tranquillitatis)", "lat": 0.674, "lon": 23.473},
    {"id": "18_Apollo12_Ocean_of_Storms", "name": "Apollo 12 (Ocean of Storms)", "lat": -3.012, "lon": -23.422},
    {"id": "19_Apollo14_Fra_Mauro", "name": "Apollo 14 (Fra Mauro Highlands)", "lat": -3.645, "lon": -17.471},
    {"id": "20_Apollo15_Hadley_Apennine", "name": "Apollo 15 (Hadley-Apennine)", "lat": 26.132, "lon": 3.634},
    {"id": "21_Apollo16_Descartes_Highlands", "name": "Apollo 16 (Descartes Highlands)", "lat": -8.973, "lon": 15.498},
    {"id": "22_Apollo17_Taurus_Littrow", "name": "Apollo 17 (Taurus-Littrow Valley)", "lat": 20.191, "lon": 30.772},
    {"id": "23_Artemis3_Ridge_Target", "name": "Artemis III Target (Shackleton Ridge)", "lat": -89.50, "lon": 130.0}
]

# Three required map layers and specs
TARGET_LAYERS = [
    {
        "layer_name": "wac_global",
        "output_filename": "wac_global.png",
        "format": "image/png",
        "expected_mime_prefix": "image/"
    },
    {
        "layer_name": "lola_sldem2015",
        "output_filename": "lola_sldem2015.tif",
        "format": "image/tiff",
        "expected_mime_prefix": "image/"
    },
    {
        "layer_name": "lola_sldem2015_slope",
        "output_filename": "lola_sldem2015_slope.png",
        "format": "image/png",
        "expected_mime_prefix": "image/"
    }
]

def fetch_and_validate_layer(node_folder, lat, lon, layer_spec):
    layer_name = layer_spec["layer_name"]
    filename = layer_spec["output_filename"]
    fmt = layer_spec["format"]
    filepath = os.path.join(node_folder, filename)
    
    # Dynamic bounding box calculation (delta 0.1 deg)
    minx = lon - DELTA
    miny = lat - DELTA
    maxx = lon + DELTA
    maxy = lat + DELTA
    bbox_str = f"{minx:.6f},{miny:.6f},{maxx:.6f},{maxy:.6f}"
    
    # Construct WMS GetMap query
    params = {
        "SERVICE": "WMS",
        "VERSION": "1.1.1",
        "REQUEST": "GetMap",
        "LAYERS": layer_name,
        "STYLES": "",
        "SRS": "EPSG:4326",
        "BBOX": bbox_str,
        "WIDTH": "512",
        "HEIGHT": "512",
        "FORMAT": fmt
    }
    
    url = f"{PRIMARY_WMS}?{urllib.parse.urlencode(params)}"
    
    result_meta = {
        "layer": layer_name,
        "filename": filename,
        "url": url,
        "status": "Failed",
        "http_code": None,
        "content_type": None,
        "file_size_bytes": 0,
        "error": None
    }
    
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "LunarGIS-ETL-Pipeline/2.0 (NASA LROC Automated Ingestion)"
            }
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result_meta["http_code"] = response.status
            content_type = response.headers.get("Content-Type", "").lower()
            result_meta["content_type"] = content_type
            
            # Read content
            data = response.read()
            size = len(data)
            result_meta["file_size_bytes"] = size
            
            # Validation 1: Header Check (Ensure image MIME type, not XML/HTML error)
            is_image_mime = any(
                content_type.startswith(p) for p in ["image/", "application/octet-stream", "image/tiff", "image/png"]
            ) and not any(err in content_type for err in ["xml", "html", "json", "text"])
            
            # Validation 2: File Size Check (> 5KB threshold)
            is_valid_size = size >= MIN_FILE_SIZE_BYTES
            
            if response.status == 200 and is_image_mime and is_valid_size:
                with open(filepath, "wb") as f:
                    f.write(data)
                result_meta["status"] = "Approved"
            else:
                # Save diagnostic failure or remove partial corrupt file
                error_reasons = []
                if not is_image_mime:
                    error_reasons.append(f"Invalid Content-Type: '{content_type}' (likely XML/HTML service error)")
                if not is_valid_size:
                    error_reasons.append(f"File size {size} bytes is under the {MIN_FILE_SIZE_BYTES} bytes (5KB) threshold")
                result_meta["error"] = "; ".join(error_reasons)
                
    except urllib.error.HTTPError as he:
        result_meta["http_code"] = he.code
        result_meta["error"] = f"HTTP Error {he.code}: {he.reason}"
    except urllib.error.URLError as ue:
        result_meta["error"] = f"Network URL Error: {str(ue.reason)}"
    except Exception as e:
        result_meta["error"] = f"Exception: {str(e)}"
        
    return result_meta

def process_node(node):
    node_id = node["id"]
    node_name = node["name"]
    lat = node["lat"]
    lon = node["lon"]
    
    # 1. Arrange: Create folder structure
    node_folder = os.path.join(BASE_OUTPUT_DIR, node_id)
    os.makedirs(node_folder, exist_ok=True)
    
    layer_results = {}
    all_layers_approved = True
    
    # 2. Fetch & Validate each of the 3 required layers
    for spec in TARGET_LAYERS:
        res = fetch_and_validate_layer(node_folder, lat, lon, spec)
        layer_results[spec["layer_name"]] = res
        if res["status"] != "Approved":
            all_layers_approved = False
            
    # 3. Log: Generate approval_log.json inside each node folder
    overall_status = "Approved" if all_layers_approved else "Failed"
    
    log_data = {
        "node_id": node_id,
        "node_name": node_name,
        "coordinates": {
            "latitude": lat,
            "longitude": lon,
            "bbox_delta_degrees": DELTA
        },
        "timestamp_utc": datetime.utcnow().isoformat() + "Z",
        "status": overall_status,
        "validation_criteria": {
            "min_file_size_bytes": MIN_FILE_SIZE_BYTES,
            "required_layers_count": len(TARGET_LAYERS),
            "expected_mime_types": ["image/png", "image/tiff"]
        },
        "layers": layer_results,
        "summary": (
            "All 3 layers verified and approved."
            if overall_status == "Approved"
            else "One or more layers failed validation (HTTP error, XML exception, or under 5KB threshold)."
        )
    }
    
    log_path = os.path.join(node_folder, "approval_log.json")
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(log_data, f, indent=2)
        
    return log_data

def main():
    print("=" * 70)
    print("STARTING LUNAR GIS ETL AUTOMATION PIPELINE")
    print(f"Target Master Directory: {os.path.abspath(BASE_OUTPUT_DIR)}")
    print(f"Endpoint: {PRIMARY_WMS}")
    print(f"Total Nodes: {len(LUNAR_NODES)}")
    print("=" * 70)
    
    os.makedirs(BASE_OUTPUT_DIR, exist_ok=True)
    start_time = time.time()
    
    # Process all 23 nodes with concurrent worker threads
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(process_node, LUNAR_NODES))
        
    approved_count = sum(1 for r in results if r["status"] == "Approved")
    failed_count = len(results) - approved_count
    elapsed_time = time.time() - start_time
    
    # Master Summary Report
    summary_report = {
        "pipeline_name": "Lunar GIS Automated ETL Pipeline",
        "execution_timestamp_utc": datetime.utcnow().isoformat() + "Z",
        "total_nodes_processed": len(results),
        "nodes_approved": approved_count,
        "nodes_failed": failed_count,
        "elapsed_seconds": round(elapsed_time, 2),
        "target_endpoint": PRIMARY_WMS,
        "nodes": [
            {
                "id": r["node_id"],
                "name": r["node_name"],
                "status": r["status"]
            } for r in results
        ]
    }
    
    summary_path = os.path.join(BASE_OUTPUT_DIR, "pipeline_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary_report, f, indent=2)
        
    print("\n" + "=" * 70)
    print(f"PIPELINE EXECUTION FINISHED in {elapsed_time:.2f}s")
    print(f"Results: {approved_count} Approved | {failed_count} Failed (Server response logs generated)")
    print(f"Master Directory: {os.path.abspath(BASE_OUTPUT_DIR)}")
    print(f"Summary Log: {os.path.abspath(summary_path)}")
    print("=" * 70)

if __name__ == "__main__":
    main()
