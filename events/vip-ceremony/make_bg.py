from PIL import Image, ImageDraw, ImageFilter
import math, random

W, H = 1920, 1080

def radial(center, inner, outer, radius_scale=1.0):
    """Radial gradient image from inner color at center to outer color."""
    img = Image.new("RGB", (W, H), outer)
    px = img.load()
    cx, cy = center
    maxr = math.hypot(W, H) * 0.5 * radius_scale
    for y in range(H):
        for x in range(W):
            d = math.hypot(x - cx, y - cy) / maxr
            t = min(1.0, d) ** 1.35
            px[x, y] = tuple(int(inner[i] * (1 - t) + outer[i] * t) for i in range(3))
    return img

def add_glow(img, center, color, radius, strength):
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(glow)
    cx, cy = center
    d.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color)
    glow = glow.filter(ImageFilter.GaussianBlur(radius * 0.6))
    return Image.blend(img, Image.eval(glow, lambda v: v), 0) if strength == 0 else \
        Image.merge("RGB", [Image.eval(Image.blend(a, b, strength), lambda v: v) for a, b in zip(img.split(), glow.split())]) if False else \
        _screen(img, glow, strength)

def _screen(base, glow, strength):
    bp, gp = base.load(), glow.load()
    out = base.copy(); op = out.load()
    for y in range(H):
        for x in range(W):
            b = bp[x, y]; g = gp[x, y]
            op[x, y] = tuple(min(255, int(b[i] + g[i] * strength)) for i in range(3))
    return out

def add_particles(img, n, seed):
    random.seed(seed)
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        x, y = random.randint(0, W), random.randint(0, H)
        r = random.choice([1, 1, 1, 2, 2, 3])
        v = random.randint(90, 200)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(v, int(v * 0.85), int(v * 0.5)))
    layer = layer.filter(ImageFilter.GaussianBlur(1.2))
    return _screen(img, layer, 0.55)

def frame(img, gold=(201, 169, 97), inset=48, gap=10):
    d = ImageDraw.Draw(img)
    # outer thin line
    d.rectangle([inset, inset, W - inset, H - inset], outline=gold, width=2)
    # inner hairline
    i2 = inset + gap
    d.rectangle([i2, i2, W - i2, H - i2], outline=tuple(int(c * 0.75) for c in gold), width=1)
    # corner ornaments: small diagonal flourishes
    L = 46
    for (x, y, sx, sy) in [(inset, inset, 1, 1), (W - inset, inset, -1, 1),
                           (inset, H - inset, 1, -1), (W - inset, H - inset, -1, -1)]:
        d.line([(x, y + sy * L), (x, y), (x + sx * L, y)], fill=gold, width=4)
        d.line([(x + sx * 14, y + sy * (L + 14)), (x + sx * 14, y + sy * 14), (x + sx * (L + 14), y + sy * 14)], fill=gold, width=1)
    return img

NAVY_IN, NAVY_OUT = (26, 40, 72), (6, 10, 22)
GOLD_GLOW = (120, 95, 40)

# Title background: centered glow, particles, frame
t = radial((W // 2, H * 0.55), NAVY_IN, NAVY_OUT, 1.1)
t = _screen(t, Image.new("RGB", (W, H), (0, 0, 0)).filter(ImageFilter.GaussianBlur(1)), 0)
g = Image.new("RGB", (W, H), (0, 0, 0)); ImageDraw.Draw(g).ellipse([W//2-520, H*0.55-300, W//2+520, H*0.55+300], fill=GOLD_GLOW)
g = g.filter(ImageFilter.GaussianBlur(260))
t = _screen(t, g, 0.75)
t = add_particles(t, 140, 7)
t = frame(t)
t.save("bg_title.png", optimize=True)

# Content background: glow top-left, calmer, frame
c = radial((W * 0.25, H * 0.2), NAVY_IN, NAVY_OUT, 1.25)
g2 = Image.new("RGB", (W, H), (0, 0, 0)); ImageDraw.Draw(g2).ellipse([-200, -300, 900, 500], fill=GOLD_GLOW)
g2 = g2.filter(ImageFilter.GaussianBlur(300))
c = _screen(c, g2, 0.55)
c = add_particles(c, 70, 11)
c = frame(c)
c.save("bg_content.png", optimize=True)

# Plain (no frame) variant for users who want to add their own elements
p = radial((W // 2, H * 0.5), NAVY_IN, NAVY_OUT, 1.1)
p = _screen(p, g, 0.6)
p = add_particles(p, 100, 3)
p.save("bg_plain.png", optimize=True)
print("done")
