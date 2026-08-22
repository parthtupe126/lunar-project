"""
Dataset Audit and Schema Inspection Engine
==========================================
Scans, audits, and checks data quality, missingness, duplicate coordinates, 
and physical ranges across all NASA lunar datasets.
"""

import os
import numpy as np
import pandas as pd

def run_dataset_audit(data_dir="data", reports_dir="reports"):
    """
    Performs full data quality, schema, and range audit on all CSV datasets.
    """
    os.makedirs(reports_dir, exist_ok=True)
    csv_files = [f for f in os.listdir(data_dir) if f.endswith(".csv")]
    
    print("=" * 80)
    print(" LUNA-DSS: COMPREHENSIVE DATASET AUDIT & HEALTH INSPECTION")
    print("=" * 80)
    print(f"[*] Scanning '{data_dir}' -> Found {len(csv_files)} dataset files.\n")
    
    audit_rows = []
    
    for filename in sorted(csv_files):
        filepath = os.path.join(data_dir, filename)
        df = pd.read_csv(filepath)
        
        # 1. Identify coordinate columns
        lat_cols = [c for c in df.columns if any(k in c.lower() for k in ["latitude", "lat_deg", "lat"])]
        lon_cols = [c for c in df.columns if any(k in c.lower() for k in ["longitude", "lon_deg", "lon"])]
        
        lat_col = lat_cols[0] if lat_cols else None
        lon_col = lon_cols[0] if lon_cols else None
        
        lat_range = f"[{df[lat_col].min():.2f}, {df[lat_col].max():.2f}]" if lat_col else "N/A"
        lon_range = f"[{df[lon_col].min():.2f}, {df[lon_col].max():.2f}]" if lon_col else "N/A"
        
        # 2. Check duplicates
        n_dups = df.duplicated().sum()
        
        # 3. Check nulls
        null_count = df.isnull().sum().sum()
        null_pct = (null_count / (df.shape[0] * df.shape[1])) * 100.0 if df.size > 0 else 0.0
        
        # 4. Check potential target columns
        target_cols = [c for c in df.columns if any(k in c.lower() for k in ["suitability", "target", "class", "zone", "score"])]
        
        # 5. Summarize suspicious values (inf, -9999, etc.)
        suspicious_count = 0
        for col in df.select_dtypes(include=[np.number]).columns:
            suspicious_count += np.isinf(df[col]).sum()
            suspicious_count += (df[col] < -90000).sum()
        
        print(f"[*] Dataset: {filename}")
        print(f"    - Rows: {df.shape[0]:,} | Columns: {df.shape[1]}")
        print(f"    - Coordinates: Lat='{lat_col}' {lat_range} | Lon='{lon_col}' {lon_range}")
        print(f"    - Duplicates: {n_dups} | Missing Values: {null_count} ({null_pct:.2f}%)")
        print(f"    - Identified Targets: {target_cols}")
        print(f"    - Column Types: {dict(df.dtypes.value_counts())}\n")
        
        for col in df.columns:
            col_data = df[col]
            is_num = np.issubdtype(col_data.dtype, np.number)
            
            audit_rows.append({
                "dataset_file": filename,
                "column_name": col,
                "data_type": str(col_data.dtype),
                "total_rows": len(col_data),
                "missing_count": col_data.isnull().sum(),
                "missing_pct": round((col_data.isnull().sum() / len(col_data)) * 100.0, 2),
                "unique_values": col_data.nunique(),
                "min_val": round(float(col_data.min()), 3) if is_num and col_data.notnull().any() else "N/A",
                "max_val": round(float(col_data.max()), 3) if is_num and col_data.notnull().any() else "N/A",
                "mean_val": round(float(col_data.mean()), 3) if is_num and col_data.notnull().any() else "N/A",
                "median_val": round(float(col_data.median()), 3) if is_num and col_data.notnull().any() else "N/A",
                "std_val": round(float(col_data.std()), 3) if is_num and len(col_data) > 1 else "N/A",
                "is_coordinate": col in [lat_col, lon_col],
                "is_potential_target": col in target_cols
            })
            
    audit_df = pd.DataFrame(audit_rows)
    audit_csv_path = os.path.join(reports_dir, "dataset_audit.csv")
    audit_df.to_csv(audit_csv_path, index=False)
    print(f"[+] Full Dataset Audit report saved to: '{audit_csv_path}'\n")
    return audit_df

if __name__ == "__main__":
    run_dataset_audit()
