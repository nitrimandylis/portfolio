"""Write Nick's public GitHub repos to data/repos.json. Stdlib only; runs daily in CI and by hand.
src/data/work.ts lists any repo here that it does not already name, under the hand-written ones.
usage: python3 tools/work.py
"""
import json, os, urllib.request
from pathlib import Path

API = "https://api.github.com/users/nitrimandylis/repos?type=owner&sort=pushed&per_page=100"
OUT = Path(__file__).resolve().parent.parent / "data" / "repos.json"

if __name__ == "__main__":
    headers = {"User-Agent": "nicktrim.com work (python)"}
    if os.environ.get("GITHUB_TOKEN"):   # CI: shared runner IPs hit the 60/hour anonymous limit
        headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]
    req = urllib.request.Request(API, headers=headers)
    repos = json.loads(urllib.request.urlopen(req, timeout=30).read())
    keep = []
    for r in repos:
        if r["fork"] or r["archived"] or not r["description"]:
            continue   # forks and archived repos are not mine to show; no description means no sentence
        keep.append({
            "name": r["name"],
            "code": r["html_url"],
            "homepage": r["homepage"] or None,
            "what": r["description"].strip(),
        })
    OUT.write_text(json.dumps(keep, indent=1, ensure_ascii=False) + "\n")
    print(f"{len(repos)} repos, {len(keep)} kept")
