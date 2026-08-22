import sys

for pkg in ['xgboost', 'shap', 'sklearn', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'joblib', 'scipy']:
    try:
        mod = __import__(pkg)
        print(f"[+] {pkg:12s}: Available ({getattr(mod, '__version__', 'installed')})")
    except ImportError as e:
        print(f"[-] {pkg:12s}: NOT INSTALLED ({e})")
