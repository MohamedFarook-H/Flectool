"""Generate Flectool PWA/app icons.

Draws the same 4-pointed sparkle used in the navbar logo, on the brand
indigo -> cyan gradient, into public/icons/.
"""
import os
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(OUT, exist_ok=True)

# Brand gradient stops (navbar: indigo-600 -> cyan-400)
GRAD_START = (79, 70, 229)    # #4f46e5  indigo-600
GRAD_END = (34, 211, 238)     # #22d3ee  cyan-400

# 4-pointed sparkle polygon in the logo's 24x24 viewBox
STAR = [
    (12.0, 3.0),
    (8.813, 10.088),
    (3.0, 12.0),
    (8.813, 13.912),
    (12.0, 21.0),
    (15.187, 13.912),
    (21.0, 12.0),
    (15.187, 10.088),
]


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(size):
    """Diagonal indigo -> cyan gradient image."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            px[x, y] = lerp(GRAD_START, GRAD_END, (x + y) / (2 * (size - 1)))
    return img


def rounded_mask(size, radius_ratio=0.225):
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=int(size * radius_ratio), fill=255
    )
    return mask


def make_icon(size, with_bg=True):
    if with_bg:
        base = gradient(size).convert("RGBA")
    else:
        base = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    # Sparkle occupies ~62% of the canvas, centred.
    span = size * 0.62
    off = (size - span) / 2
    scale = span / 24.0
    star = [((off + px * scale), (off + py * scale)) for px, py in STAR]

    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(layer).polygon(star, fill=(255, 255, 255, 255))
    base.alpha_composite(layer)

    if with_bg:
        base.putalpha(rounded_mask(size))
    return base


targets = [
    ("icon-192.png", 192, True),
    ("icon-512.png", 512, True),
    ("apple-touch-icon.png", 180, True),
    ("icon-maskable-512.png", 512, True),
]

for name, size, bg in targets:
    icon = make_icon(size, bg)
    path = os.path.join(OUT, name)
    icon.save(path, "PNG", optimize=True)
    print(f"  wrote {name}  {size}x{size}  {os.path.getsize(path)} bytes")
