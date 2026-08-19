import os
import numpy as np
from PIL import Image, ImageFile
Image.MAX_IMAGE_PIXELS = None
ImageFile.LOAD_TRUNCATED_IMAGES = True

tiff_path = r"C:\Users\Ayush69\OneDrive\Desktop\lunar project\MoonDemo-master\Moon\Lunar_LRO_LOLA_Global_LDEM_118m_Mar2014.tif"

with Image.open(tiff_path) as im:
    offsets = im.tag_v2[273] # StripOffsets
    print("First offset:", offsets[0], "Last offset:", offsets[-1])
    print("Total strips:", len(offsets))
    
    # Read row 0 directly
    with open(tiff_path, 'rb') as f:
        f.seek(offsets[0])
        row0 = np.fromfile(f, dtype='>i2' if im.tag_v2.get(258) == 16 else '<i2', count=92160)
        print("Row 0 stats: min=", row0.min(), "max=", row0.max(), "mean=", row0.mean())

        # Read middle row (Equator)
        f.seek(offsets[23040])
        row_eq = np.fromfile(f, dtype='>i2' if im.tag_v2.get(258) == 16 else '<i2', count=92160)
        print("Equator row stats: min=", row_eq.min(), "max=", row_eq.max(), "mean=", row_eq.mean())
