import os
import sys
import time
import numpy as np
from PIL import Image, ImageFile
from scipy.ndimage import sobel

Image.MAX_IMAGE_PIXELS = None
ImageFile.LOAD_TRUNCATED_IMAGES = True

TIFF_PATH = r"C:\Users\Ayush69\OneDrive\Desktop\lunar project\MoonDemo-master\Moon\Lunar_LRO_LOLA_Global_LDEM_118m_Mar2014.tif"
DEST_DIRS = [
    r"c:\Users\Ayush69\OneDrive\Desktop\lunar project\frontend\public\assets\real-moon",
    r"c:\Users\Ayush69\OneDrive\Desktop\lunar project\public\assets\real-moon"
]

for d in DEST_DIRS:
    os.makedirs(d, exist_ok=True)

print("Starting NASA LOLA Global LDEM 118m map generation...")
t_start = time.time()

# 1. Read TIFF offsets
with Image.open(TIFF_PATH) as im:
    offsets = list(im.tag_v2[273])
    width = im.size[0]  # 92160
    height = im.size[1] # 46080

target_w_8k = 8192
target_h_8k = 4096
step_y = height // target_h_8k # 11.25 -> 46080 / 4096 = 11.25
step_x = width // target_w_8k  # 92160 / 8192 = 11.25

print(f"Input dimensions: {width} x {height} ({len(offsets)} scanlines)")
print(f"Target 8K: {target_w_8k} x {target_h_8k}")

# 2. Resample 8K elevation matrix using direct scanline sampling
elev_8k = np.zeros((target_h_8k, target_w_8k), dtype=np.float32)

y_indices = np.linspace(0, height - 1, target_h_8k).astype(int)
x_indices = np.linspace(0, width - 1, target_w_8k).astype(int)

t0 = time.time()
with open(TIFF_PATH, 'rb') as f:
    for out_y, src_y in enumerate(y_indices):
        f.seek(offsets[src_y])
        # Read entire row of 92160 int16 pixels
        row = np.fromfile(f, dtype='<i2', count=width)
        # Sample target_w_8k columns
        elev_8k[out_y, :] = row[x_indices]
        if (out_y + 1) % 512 == 0 or out_y == target_h_8k - 1:
            pct = (out_y + 1) / target_h_8k * 100
            print(f"  Sampling scanlines: {out_y+1}/{target_h_8k} ({pct:.1f}%) in {time.time()-t0:.1f}s")

min_elev = float(elev_8k.min())
max_elev = float(elev_8k.max())
print(f"LOLA Elevation Data Range: min={min_elev:.1f}m, max={max_elev:.1f}m, mean={elev_8k.mean():.1f}m")

# 3. Generate 8K Elevation / Bump Map (Normalized 0..255)
elev_norm = np.clip((elev_8k - min_elev) / (max_elev - min_elev), 0.0, 1.0)
elev_img_8k = Image.fromarray((elev_norm * 255.0).astype(np.uint8), mode='L')

for d in DEST_DIRS:
    elev_img_8k.save(os.path.join(d, "lola_ldem_8k_bump.jpg"), quality=95)
    elev_img_8k.save(os.path.join(d, "moon_8k_bump.jpg"), quality=95)
print("Saved 8K LOLA Elevation Bump Maps.")

# 4. Generate 8K NASA LOLA Normal Map (Sobel Gradients on Elevation)
print("Computing 8K LOLA surface normal vectors...")
# Sobel gradient along X and Y
dx = sobel(elev_8k, axis=1) / 8.0
dy = sobel(elev_8k, axis=0) / 8.0

# Normal scale tuned for realistic crater relief depth
normal_scale = 0.04
nx = -dx * normal_scale
ny = -dy * normal_scale
nz = np.ones_like(nx)

len_n = np.sqrt(nx*nx + ny*ny + nz*nz)
nx /= len_n
ny /= len_n
nz /= len_n

norm_r = ((nx * 0.5 + 0.5) * 255.0).astype(np.uint8)
norm_g = ((ny * 0.5 + 0.5) * 255.0).astype(np.uint8)
norm_b = ((nz * 0.5 + 0.5) * 255.0).astype(np.uint8)

normal_rgb_8k = np.stack([norm_r, norm_g, norm_b], axis=-1)
normal_img_8k = Image.fromarray(normal_rgb_8k, mode='RGB')

for d in DEST_DIRS:
    normal_img_8k.save(os.path.join(d, "lola_ldem_8k_normal.jpg"), quality=96)
    normal_img_8k.save(os.path.join(d, "moon_8k_normal.jpg"), quality=96)
print("Saved 8K LOLA Normal Maps.")

# 5. Generate 8K NASA LOLA Hypsometric Topography Colormap
print("Generating 8K NASA LOLA Hypsometric Topography Color Map...")
# NASA LOLA Color Ramp: Elevation from -9000m to +10700m
# Points: (elev_val, (r, g, b))
color_stops = [
    (-9000, np.array([44, 0, 77], dtype=np.float32)),     # Deepest craters (South Pole / SPA basin) - Deep Violet
    (-6000, np.array([30, 58, 138], dtype=np.float32)),   # Deep basins - Royal Blue
    (-3000, np.array([2, 132, 199], dtype=np.float32)),   # Lowlands - Sky Cyan
    (-1000, np.array([5, 150, 105], dtype=np.float32)),   # Basin margins - Emerald Green
    (0,     np.array([234, 179, 8], dtype=np.float32)),   # Lunar Datum (Maria baseline) - Amber Gold
    (2000,  np.array([234, 88, 12], dtype=np.float32)),   # Low highlands - Warm Orange
    (5000,  np.array([220, 38, 38], dtype=np.float32)),   # Central highlands - Crimson Red
    (8000,  np.array([236, 72, 153], dtype=np.float32)),  # High massifs - Magenta Pink
    (10700, np.array([255, 255, 255], dtype=np.float32)), # Highest peaks (Montes Apenninus) - Radiant White
]

hypso_rgb_8k = np.zeros((target_h_8k, target_w_8k, 3), dtype=np.uint8)

# Linear piecewise interpolation between color stops
for i in range(len(color_stops) - 1):
    e0, c0 = color_stops[i]
    e1, c1 = color_stops[i+1]
    
    mask = (elev_8k >= e0) & (elev_8k < e1)
    if not np.any(mask):
        continue
    
    t = (elev_8k[mask] - e0) / (e1 - e0)
    t = t[:, np.newaxis]
    col = c0 + t * (c1 - c0)
    hypso_rgb_8k[mask] = np.clip(col, 0, 255).astype(np.uint8)

# Edge case for max elevation
hypso_rgb_8k[elev_8k >= color_stops[-1][0]] = [255, 255, 255]
hypso_rgb_8k[elev_8k < color_stops[0][0]] = [44, 0, 77]

hypso_img_8k = Image.fromarray(hypso_rgb_8k, mode='RGB')

for d in DEST_DIRS:
    hypso_img_8k.save(os.path.join(d, "lola_ldem_8k_hypsometric.jpg"), quality=95)
print("Saved 8K LOLA Hypsometric Topography Color Maps.")

# 6. Generate 4K fast loading versions
print("Creating 4K versions...")
elev_img_4k = elev_img_8k.resize((4096, 2048), resample=Image.Resampling.BILINEAR)
normal_img_4k = normal_img_8k.resize((4096, 2048), resample=Image.Resampling.BILINEAR)
hypso_img_4k = hypso_img_8k.resize((4096, 2048), resample=Image.Resampling.BILINEAR)

for d in DEST_DIRS:
    elev_img_4k.save(os.path.join(d, "lola_ldem_4k_bump.jpg"), quality=92)
    normal_img_4k.save(os.path.join(d, "lola_ldem_4k_normal.jpg"), quality=92)
    hypso_img_4k.save(os.path.join(d, "lola_ldem_4k_hypsometric.jpg"), quality=92)

print(f"ALL LOLA MAPS GENERATED SUCCESSFULLY in {time.time()-t_start:.2f}s!")
