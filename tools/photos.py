"""Publish photos: the prints listed in content/photos.txt, from originals/, -> public/img/photos/<name>-1600.webp
and -600.webp (EXIF and GPS stripped), data/photos.json in the same order as the list.
Run locally before pushing; originals/ is gitignored so the full-size files never leave this Mac.
usage: uv run --with pillow tools/photos.py
"""
import json, re
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC, DST, OUT = ROOT / "originals", ROOT / "public" / "img" / "photos", ROOT / "data" / "photos.json"
LIST = ROOT / "content" / "photos.txt"
DST.mkdir(parents=True, exist_ok=True)

# every image in originals/, by name without the extension
files = {p.stem: p for p in SRC.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".heic", ".tif", ".tiff"}}
names = [line.strip() for line in LIST.read_text().splitlines() if line.strip() and not line.startswith("#")]
missing = [n for n in names if n not in files]
if missing:
    raise SystemExit(f"in content/photos.txt but not in originals/: {', '.join(missing)}")

photos = []
for name in names:
    src = files[name]
    slug = re.sub(r"[^a-z0-9]+", "-", src.stem.lower()).strip("-")
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")   # bake the rotation in, then drop all metadata
    w, h = None, None
    for size in (1600, 600):
        copy = im.copy(); copy.thumbnail((size, size))
        copy.save(DST / f"{slug}-{size}.webp", "WEBP", quality=84, method=6)   # a fresh save carries no EXIF
        if size == 1600: w, h = copy.size
    photos.append({"file": slug, "name": src.stem.lower(), "w": w, "h": h})
OUT.write_text(json.dumps({"photos": photos}, indent=1) + "\n")
print(f"{len(photos)} photos")
