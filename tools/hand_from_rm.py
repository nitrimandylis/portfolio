"""Cut Nick's handwritten words out of one reMarkable page into hand/*.svg.

The strokes JSON comes from the rm-handwrite skill (fetch.py + extract.py).
usage: python3 tools/hand_from_rm.py STROKES.json OUTDIR [take numbers, one per word]
With no take numbers it writes every take (word-1.svg, word-2.svg, ...) so you can pick.
"""
import json, sys
from pathlib import Path

# The page, top to bottom: each row is (word, how many takes are on that row).
ROWS = [("name", 2), ("name", 2), ("about", 4), ("cv", 4), ("work", 4),
        ("films", 4), ("photos", 4), ("night-shift", 2), ("night-shift", 2)]
ABOVE, BELOW, PAD = 62, 26, 4   # same frame above/below the baseline for every word, so they share a scale


def mid_y(stroke):
    return sum(p[1] for p in stroke) / len(stroke)


def split_rows(strokes):
    strokes = sorted(strokes, key=mid_y)
    rows = [[strokes[0]]]
    for s in strokes[1:]:
        if mid_y(s) - mid_y(rows[-1][-1]) < 40:
            rows[-1].append(s)
        else:
            rows.append([s])
    return rows


def split_takes(row, count):
    # Cut the row at its (count - 1) widest horizontal gaps.
    row = sorted(row, key=lambda s: min(p[0] for p in s))
    gaps = []
    right = max(p[0] for p in row[0])
    for i in range(1, len(row)):
        left = min(p[0] for p in row[i])
        gaps.append((left - right, i))
        right = max(right, max(p[0] for p in row[i]))
    cuts = sorted(i for _, i in sorted(gaps, reverse=True)[:count - 1])
    takes, start = [], 0
    for c in cuts + [len(row)]:
        takes.append(row[start:c])
        start = c
    return takes


def to_svg(strokes):
    bottoms = sorted(max(p[1] for p in s) for s in strokes)
    baseline = bottoms[len(bottoms) // 2]
    x0 = min(p[0] for s in strokes for p in s) - PAD
    x1 = max(p[0] for s in strokes for p in s) + PAD
    y0 = baseline - ABOVE
    w, h = x1 - x0, ABOVE + BELOW
    lines = "".join('<polyline points="%s"/>' % " ".join("%.1f,%.1f" % (x - x0, y - y0) for x, y in s)
                    for s in strokes)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.0f %.0f" width="%.0f" height="%.0f" '
            'fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">%s</svg>'
            % (w, h, w, h, lines))


def all_takes(strokes_path):
    data = json.loads(Path(strokes_path).read_text())
    strokes = [[(p[0], p[1]) for p in s["pts"]] for s in data["strokes"]]
    strokes = [s for s in strokes if min(y for _, y in s) < 2000]   # drop the tick in the corner
    rows = split_rows(strokes)
    assert len(rows) == len(ROWS), "expected %d rows, found %d" % (len(ROWS), len(rows))
    takes = {}
    for (word, count), row in zip(ROWS, rows):
        takes.setdefault(word, []).extend(split_takes(row, count))
    return takes


if __name__ == "__main__":
    takes = all_takes(sys.argv[1])
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    picks = [int(n) for n in sys.argv[3:]]
    for i, (word, options) in enumerate(takes.items()):
        if picks:
            (out / f"{word}.svg").write_text(to_svg(options[picks[i] - 1]))
        else:
            for n, t in enumerate(options, 1):
                (out / f"{word}-{n}.svg").write_text(to_svg(t))
