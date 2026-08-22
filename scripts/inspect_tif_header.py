import struct
import os

tif_path = "data/Lunar_LRO_LOLA_Global_LDEM_118m_Mar2014.tif"

if not os.path.exists(tif_path):
    print("File not found:", tif_path)
    exit()

file_size = os.path.getsize(tif_path)
print(f"File size: {file_size:,} bytes ({file_size / (1024**3):.2f} GB)")

with open(tif_path, "rb") as f:
    header = f.read(16)
    byte_order = header[:2]
    endian = "<" if byte_order == b"II" else ">" if byte_order == b"MM" else None
    print("Endianness:", "Little-endian (II)" if endian == "<" else "Big-endian (MM)" if endian == ">" else byte_order)
    
    if endian:
        magic = struct.unpack(endian + "H", header[2:4])[0]
        print(f"Magic version: {magic} ({'BigTIFF' if magic == 43 else 'Standard TIFF' if magic == 42 else 'Unknown'})")
        if magic == 43:
            bytesize, zero, ifd_offset = struct.unpack(endian + "HHQ", header[4:16])
            print(f"BigTIFF IFD offset: {ifd_offset}")
