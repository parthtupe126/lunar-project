import os
import pandas as pd
import numpy as np

data_dir = "data"
csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]

print(f"Found {len(csv_files)} CSV files in '{data_dir}':\n")

for f in sorted(csv_files):
    path = os.path.join(data_dir, f)
    df = pd.read_csv(path)
    print("=" * 60)
    print(f"File: {f}")
    print(f"Shape: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"Columns: {list(df.columns)}")
    print(f"Nulls: {df.isnull().sum().sum()}")
    print("=" * 60)
