"""Publish photos: originals/*.jpg -> public/img/photos/<name>-1600.webp and -600.webp (EXIF and GPS stripped), data/photos.json.
Run locally before pushing; originals/ is gitignored so the full-size files never leave this Mac.
usage: uv run --with pillow tools/photos.py
"""
import json, re
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC, DST, OUT = ROOT / "originals", ROOT / "public" / "img" / "photos", ROOT / "data" / "photos.json"
DST.mkdir(parents=True, exist_ok=True)
photos = []
for src in sorted(SRC.glob("*"), key=lambda p: p.stat().st_mtime, reverse=True):
    if src.suffix.lower() not in {".jpg", ".jpeg", ".png", ".heic", ".tif", ".tiff"}:
        continue
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
