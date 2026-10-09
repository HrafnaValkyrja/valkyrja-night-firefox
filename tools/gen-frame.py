# Build theme/images/frame-gradient.png: a desktop title-bar style gradient (indigo #5b4bd6 -> blue -> cyan), with the
# blue/cyan stops darkened (saturation kept) so ice-white tab text #dce8f5 stays >= 4.5:1 on EVERY column.
# Static themes can't stretch images: 2048 css px wide (a common full-screen logical width), aligned left;
# the manifest frame colour = the last stop so wider windows continue without an edge.
import sys
from PIL import Image
W, H = 2048, 120
STOPS = [(0.0, '#5b4bd6'), (0.55, '#1c62c4'), (1.0, '#00708e')]
TXT = '#dce8f5'
def rgb(h): return [int(h[i:i+2], 16) for i in (1, 3, 5)]
def lin(c): c /= 255; return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
def unlin(c): c = 12.92 * c if c <= .0031308 else 1.055 * c ** (1 / 2.4) - .055; return max(0, min(255, round(c * 255)))
def L(p): r, g, b = [lin(x) for x in p]; return .2126 * r + .7152 * g + .0722 * b
def col(t):
    for (t0, a), (t1, b) in zip(STOPS, STOPS[1:]):
        if t <= t1:
            k = (t - t0) / (t1 - t0); A, B = rgb(a), rgb(b)
            return tuple(unlin(lin(x) * (1 - k) + lin(y) * k) for x, y in zip(A, B))
im = Image.new('RGB', (W, H)); worst = 99
for x in range(W):
    c = col(x / (W - 1)); cr = (L(rgb(TXT)) + .05) / (L(c) + .05); worst = min(worst, cr)
    for y in range(H): im.putpixel((x, y), c)
im.save(sys.argv[1]); print('min contrast vs', TXT, round(worst, 2), 'end colour #%02x%02x%02x' % col(1.0))
assert worst >= 4.5
