import urllib.request
import urllib.error
import sys
import time
import os

url = "https://planetarymaps.usgs.gov/mosaic/Lunar_LRO_LOLA_Global_LDEM_118m_Mar2014.tif"
file_name = "Lunar_LRO_LOLA_Global_LDEM_118m_Mar2014.tif"

def download_with_progress(url, file_name):
    print(f"Starting/resuming download of {file_name} (approx 8GB)...")
    
    # Check if file exists to resume
    downloaded = 0
    if os.path.exists(file_name):
        downloaded = os.path.getsize(file_name)
        
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0',
        'Range': f'bytes={downloaded}-'
    })
    
    try:
        with urllib.request.urlopen(req) as response:
            content_length = response.getheader('Content-Length')
            if content_length is None:
                total_size = downloaded
            else:
                total_size = downloaded + int(content_length.strip())
            
            chunk_size = 8192 * 1024 # 8MB chunks
            session_start_time = time.time()
            session_downloaded = 0
            
            # Use 'ab' mode to append to existing file
            mode = 'ab' if downloaded > 0 else 'wb'
            with open(file_name, mode) as out_file:
                while True:
                    chunk = response.read(chunk_size)
                    if not chunk:
                        break
                    out_file.write(chunk)
                    chunk_len = len(chunk)
                    downloaded += chunk_len
                    session_downloaded += chunk_len
                    
                    # Print progress every chunk
                    elapsed = time.time() - session_start_time
                    speed = session_downloaded / (1024 * 1024) / elapsed if elapsed > 0 else 0
                    
                    percent = (downloaded / total_size) * 100 if total_size > 0 else 0
                    print(f"Downloaded {downloaded / (1024*1024*1024):.2f} GB of {total_size / (1024*1024*1024):.2f} GB ({percent:.2f}%) - Speed: {speed:.2f} MB/s", flush=True)
    except urllib.error.HTTPError as e:
        if e.code == 416:
            print("File is already fully downloaded.")
        else:
            raise e

if __name__ == "__main__":
    download_with_progress(url, file_name)
    print("Download complete!")
