"""Render a word in Nick's handwriting as a small SVG, using the rm-handwrite glyph library.
usage: python3 tools/handwrite_svg.py "night shift" > hand/night-shift.svg
"""
import sys, random
sys.path.insert(0, str(__import__("pathlib").Path.home() / ".claude/skills/rm-handwrite/scripts"))
import hw

def word_svg(text, seed=1):
    hw.rng = random.Random(seed)
    box = hw.layout(hw.parse(text), 1.0)
    polylines = []
    for g in box.glyphs:
        strokes, dx, dy, sc = g[:4]
        for st in strokes:
            polylines.append([(dx + p[0] * sc, dy + p[1] * sc) for p in st])
    for st in box.extra:
        polylines.append(list(st))
    xs = [x for pl in polylines for x, _ in pl]; ys = [y for pl in polylines for _, y in pl]
    pad = 4
    x0, y0, x1, y1 = min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad
    w, h = x1 - x0, y1 - y0
    pts = "".join('<polyline points="%s"/>' % " ".join("%.1f,%.1f" % (x - x0, y - y0) for x, y in pl) for pl in polylines)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.0f %.0f" width="%.0f" height="%.0f" '
            'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">%s</svg>'
            % (w, h, w, h, pts))

if __name__ == "__main__":
    text = sys.argv[1]; seed = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    sys.stdout.write(word_svg(text, seed))
