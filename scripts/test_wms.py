import urllib.request
import ssl

endpoints = [
    "https://wms.lroc.asu.edu/cgi-bin/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities",
    "https://wms.lroc.asu.edu/lroc/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities",
    "https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities",
    "https://trek.nasa.gov/moon/TrekWS/rest/cat/wmts/1.0.0/WMTSCapabilities.xml"
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for url in endpoints:
    print(f"\nTesting {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=5) as response:
            print("Status:", response.status)
            data = response.read(200).decode('utf-8', errors='ignore')
            print("Data:", data.replace('\n', ' '))
    except Exception as e:
        print("Error:", str(e))
