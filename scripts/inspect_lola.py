import os
from PIL import Image, ImageFile, TiffTags
Image.MAX_IMAGE_PIXELS = None
ImageFile.LOAD_TRUNCATED_IMAGES = True

tiff_path = r"C:\Users\Ayush69\OneDrive\Desktop\lunar project\MoonDemo-master\Moon\Lunar_LRO_LOLA_Global_LDEM_118m_Mar2014.tif"

print("File size:", os.path.getsize(tiff_path) / (1024*1024), "MB")
with Image.open(tiff_path) as im:
    print("Format:", im.format)
    print("Mode:", im.mode)
    print("Size:", im.size)
    print("Tile:", getattr(im, 'tile', None)[:5] if hasattr(im, 'tile') else 'No tile')
    print("Is tiled:", getattr(im, 'is_tiled', False))
    print("Tags count:", len(im.tag_v2))
    for k in [256, 257, 258, 259, 273, 277, 278, 279, 322, 323, 324, 325]:
        if k in im.tag_v2:
            print(f"Tag {k} ({TiffTags.TAGS_V2.get(k, 'Unknown')}): {im.tag_v2[k]}")
