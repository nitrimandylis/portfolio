"""smallest check: parse the saved feed, merge keeps history and dedupes"""
import sys, pathlib; sys.path.insert(0, str(pathlib.Path(__file__).parent))
from films import parse, merge
xml = pathlib.Path(sys.argv[1]).read_bytes()
films = parse(xml)
assert films and films[0]["title"] and films[0]["watched"]
assert all(f["id"].startswith("letterboxd-") for f in films)
old = [{"id": "letterboxd-watch-1", "title": "old one", "year": 1999, "watched": "2001-01-01", "rating": 3.0, "rewatch": False, "url": "", "poster": None, "review": ""}]
m = merge(old, films + films[:1])
assert len(m) == len(films) + 1 and m[-1]["id"] == "letterboxd-watch-1"
print("ok", len(films), "parsed;", sum(1 for f in films if f["review"]), "with reviews")
