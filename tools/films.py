"""Append new Letterboxd diary entries to data/films.json. Stdlib only; runs daily in CI and by hand.
usage: python3 tools/films.py
"""
import json, re, html, urllib.request, xml.etree.ElementTree as ET
from pathlib import Path

RSS = "https://letterboxd.com/nick_trim8/rss/"
OUT = Path(__file__).resolve().parent.parent / "data" / "films.json"
NS = {"l": "https://letterboxd.com"}

def text(item, tag):
    el = item.find(tag, NS)
    return el.text.strip() if el is not None and el.text else None

def parse(xml_bytes):
    films = []
    for it in ET.fromstring(xml_bytes).iter("item"):
        guid = it.findtext("guid") or ""
        if not (guid.startswith("letterboxd-watch") or guid.startswith("letterboxd-review")):
            continue   # lists and likes also appear in the feed
        desc = it.findtext("description") or ""
        poster = re.search(r'<img src="([^"]+)"', desc)
        paras = [html.unescape(re.sub(r"<[^>]+>", "", p)).strip() for p in re.findall(r"<p>(.*?)</p>", desc, re.S)]
        review = "\n".join(p for p in paras if p and not p.startswith("Watched on") and "<img" not in p)
        rating = text(it, "l:memberRating")
        films.append({
            "id": guid,
            "title": text(it, "l:filmTitle"),
            "year": int(text(it, "l:filmYear") or 0),
            "watched": text(it, "l:watchedDate"),
            "rating": float(rating) if rating else None,
            "rewatch": text(it, "l:rewatch") == "Yes",
            "url": it.findtext("link"),
            "poster": poster.group(1) if poster else None,
            "review": review,
        })
    return films

def merge(old, new):
    by_id = {f["id"]: f for f in old}
    by_id.update({f["id"]: f for f in new})   # a later edit to a review wins
    return sorted(by_id.values(), key=lambda f: (f["watched"] or "", f["id"]), reverse=True)

if __name__ == "__main__":
    old = json.loads(OUT.read_text())["films"] if OUT.exists() else []
    req = urllib.request.Request(RSS, headers={"User-Agent": "nicktrim.com films (python)"})
    new = parse(urllib.request.urlopen(req, timeout=30).read())
    films = merge(old, new)
    OUT.write_text(json.dumps({"source": RSS, "films": films}, indent=1, ensure_ascii=False) + "\n")
    print(f"{len(new)} in feed, {len(films) - len(old)} new, {len(films)} total")
