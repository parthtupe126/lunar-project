import sys

packages = ['rasterio', 'tifffile', 'PIL', 'scipy', 'cv2', 'imageio', 'numpy', 'pandas', 'sklearn', 'joblib']

print("Python executable:", sys.executable)
print("Python version:", sys.version)

for pkg in packages:
    try:
        mod = __import__(pkg)
        ver = getattr(mod, '__version__', 'unknown version')
        print(f"[+] {pkg:12s} : Available ({ver})")
    except ImportError:
        print(f"[-] {pkg:12s} : NOT INSTALLED")
