from PIL import Image, ImageDraw, ImageFilter, ImageChops
import math, random

W, H = 1920, 1080
GOLD = (212, 175, 95)
GOLD_L = (240, 214, 150)
GOLD_D = (150, 118, 55)

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def base_gradient(cx, cy, inner, mid, outer):
    img = Image.new("RGB", (W, H)); px = img.load()
    maxr = math.hypot(W, H) * 0.55
    for y in range(H):
        for x in range(W):
            t = min(1.0, math.hypot(x - cx, y - cy) / maxr)
            px[x, y] = lerp(inner, mid, t / 0.45) if t < 0.45 else lerp(mid, outer, (t - 0.45) / 0.55)
    return img

def layer(): return Image.new("RGBA", (W, H), (0, 0, 0, 0))

def sunburst(cx, cy, n=56, alpha=38, width=3, length=2400):
    L = layer(); d = ImageDraw.Draw(L)
    for i in range(n):
        a = math.pi + (i / (n - 1)) * math.pi  # upward half circle
        a = a - math.pi / 2  # rays from bottom-center going up: angles from 180..360 deg
        ang = math.radians(180 + (i / (n - 1)) * 180)
        x2, y2 = cx + math.cos(ang) * length, cy + math.sin(ang) * length
        d.line([(cx, cy), (x2, y2)], fill=GOLD + (alpha,), width=width)
    L = L.filter(ImageFilter.GaussianBlur(2.5))
    # fade rays near the origin and toward the edges with a radial mask
    mask = Image.new("L", (W, H), 0); mp = mask.load()
    for y in range(H):
        for x in range(W):
            dd = math.hypot(x - cx, y - cy)
            v = 0 if dd < 120 else min(1.0, (dd - 120) / 300) * max(0.0, 1 - (dd - 400) / 1300)
            mp[x, y] = int(255 * max(0.0, v))
    L.putalpha(ImageChops.multiply(L.split()[3], mask))
    return L

def bokeh(n, seed, big=True):
    random.seed(seed)
    L = layer()
    for _ in range(n):
        x, y = random.randint(0, W), random.randint(0, H)
        r = random.randint(40, 140) if big else random.randint(8, 30)
        a = random.randint(22, 48) if big else random.randint(50, 120)
        c = random.choice([(232, 190, 96), (246, 214, 130), (255, 226, 150)])
        tmp = layer(); ImageDraw.Draw(tmp).ellipse([x - r, y - r, x + r, y + r], fill=c + (a,))
        tmp = tmp.filter(ImageFilter.GaussianBlur(r * (0.28 if big else 0.22)))
        L = Image.alpha_composite(L, tmp)
    return L

def sparkles(n, seed):
    random.seed(seed)
    L = layer(); d = ImageDraw.Draw(L)
    for _ in range(n):
        x, y = random.randint(80, W - 80), random.randint(80, H - 80)
        s = random.choice([5, 7, 9, 12, 16])
        a = random.randint(150, 255)
        col = GOLD_L + (a,)
        # 4-point star
        pts = [(x, y - s), (x + s * 0.22, y - s * 0.22), (x + s, y), (x + s * 0.22, y + s * 0.22),
               (x, y + s), (x - s * 0.22, y + s * 0.22), (x - s, y), (x - s * 0.22, y - s * 0.22)]
        d.polygon(pts, fill=col)
        if s >= 12:
            g = layer(); ImageDraw.Draw(g).ellipse([x - s, y - s, x + s, y + s], fill=GOLD_L + (120,))
            L = Image.alpha_composite(L, g.filter(ImageFilter.GaussianBlur(s * 0.8)))
            d = ImageDraw.Draw(L)
    return L

def foil(size, seed=1):
    """Gold foil texture: gold with speckled brightness."""
    random.seed(seed)
    noise = Image.effect_noise(size, 60).filter(ImageFilter.GaussianBlur(1.2))
    tex = Image.new("RGB", size, GOLD)
    light = Image.new("RGB", size, GOLD_L); dark = Image.new("RGB", size, GOLD_D)
    tex = Image.composite(light, dark, noise)
    return tex

def art_deco_frame(inset=42):
    L = layer(); d = ImageDraw.Draw(L)
    o = (255, 255, 255, 255)
    # outer bold line, inner thin line, third hairline
    d.rectangle([inset, inset, W - inset, H - inset], outline=o, width=3)
    d.rectangle([inset + 12, inset + 12, W - inset - 12, H - inset - 12], outline=o, width=1)
    # mid-edge diamonds
    for (x, y) in [(W // 2, inset), (W // 2, H - inset), (inset, H // 2), (W - inset, H // 2)]:
        d.polygon([(x, y - 10), (x + 10, y), (x, y + 10), (x - 10, y)], fill=o)
        d.polygon([(x, y - 5), (x + 5, y), (x, y + 5), (x - 5, y)], fill=(0, 0, 0, 0))
    # corner ornaments: stepped chevrons + fan rays + small circle
    for (x, y, sx, sy) in [(inset, inset, 1, 1), (W - inset, inset, -1, 1), (inset, H - inset, 1, -1), (W - inset, H - inset, -1, -1)]:
        for k, (ln, wd) in enumerate([(120, 3), (92, 2), (66, 1)]):
            off = 12 * k
            d.line([(x + sx * off, y + sy * (off + ln)), (x + sx * off, y + sy * off), (x + sx * (off + ln), y + sy * off)], fill=o, width=wd)
        # fan rays
        for i in range(5):
            ang = math.radians(10 + i * 17.5)
            d.line([(x + sx * 46, y + sy * 46), (x + sx * (46 + math.cos(ang) * 70), y + sy * (46 + math.sin(ang) * 70))], fill=o, width=1)
        d.ellipse([x + sx * 46 - 7, y + sy * 46 - 7, x + sx * 46 + 7, y + sy * 46 + 7], fill=o)
        d.polygon([(x + sx * 150, y + sy * 42), (x + sx * 160, y + sy * 50), (x + sx * 150, y + sy * 58), (x + sx * 140, y + sy * 50)], fill=o)
        d.polygon([(x + sx * 42, y + sy * 150), (x + sx * 50, y + sy * 160), (x + sx * 58, y + sy * 150), (x + sx * 50, y + sy * 140)], fill=o)
    # colorize with foil
    tex = foil((W, H)).convert("RGBA"); tex.putalpha(L.split()[3])
    return tex

def crest(cx, cy, scale=1.0):
    """Art-deco sunburst crest: half fan of rays over a diamond medallion."""
    L = layer(); d = ImageDraw.Draw(L); o = (255, 255, 255, 255)
    R = int(150 * scale)
    for i in range(13):
        ang = math.radians(180 + i * 15)
        x2, y2 = cx + math.cos(ang) * R, cy + math.sin(ang) * R
        d.line([(cx + math.cos(ang) * 40 * scale, cy + math.sin(ang) * 40 * scale), (x2, y2)], fill=o, width=2)
        d.ellipse([x2 - 3, y2 - 3, x2 + 3, y2 + 3], fill=o)
    d.arc([cx - 40 * scale, cy - 40 * scale, cx + 40 * scale, cy + 40 * scale], 180, 360, fill=o, width=2)
    d.arc([cx - R - 14, cy - R - 14, cx + R + 14, cy + R + 14], 183, 357, fill=o, width=1)
    s = 22 * scale
    d.polygon([(cx, cy - s), (cx + s, cy), (cx, cy + s), (cx - s, cy)], fill=o)
    d.polygon([(cx, cy - s * 0.5), (cx + s * 0.5, cy), (cx, cy + s * 0.5), (cx - s * 0.5, cy)], fill=(0, 0, 0, 0))
    # side flourishes
    for sx in (1, -1):
        d.line([(cx + sx * 40, cy), (cx + sx * 260 * scale, cy)], fill=o, width=2)
        d.polygon([(cx + sx * 270 * scale, cy - 8), (cx + sx * 286 * scale, cy), (cx + sx * 270 * scale, cy + 8), (cx + sx * 254 * scale, cy)], fill=o)
        d.line([(cx + sx * 60, cy + 10), (cx + sx * 200 * scale, cy + 10)], fill=o, width=1)
    tex = foil((W, H), 3).convert("RGBA"); tex.putalpha(L.split()[3])
    return tex

def flourish_line(cx, cy, span):
    L = layer(); d = ImageDraw.Draw(L); o = (255, 255, 255, 255)
    d.line([(cx - span, cy), (cx - 30, cy)], fill=o, width=2); d.line([(cx + 30, cy), (cx + span, cy)], fill=o, width=2)
    d.line([(cx - span * 0.75, cy + 9), (cx - 50, cy + 9)], fill=o, width=1); d.line([(cx + 50, cy + 9), (cx + span * 0.75, cy + 9)], fill=o, width=1)
    d.polygon([(cx, cy - 12), (cx + 12, cy), (cx, cy + 12), (cx - 12, cy)], fill=o)
    for sx in (1, -1):
        d.polygon([(cx + sx * 22, cy - 6), (cx + sx * 28, cy), (cx + sx * 22, cy + 6), (cx + sx * 16, cy)], fill=o)
        d.ellipse([cx + sx * span - 5, cy - 5, cx + sx * span + 5, cy + 5], fill=o)
    tex = foil((W, H), 5).convert("RGBA"); tex.putalpha(L.split()[3])
    return tex

def vignette(strength=0.55):
    m = Image.new("L", (W, H), 0); mp = m.load()
    for y in range(H):
        for x in range(W):
            dx, dy = (x - W / 2) / (W / 2), (y - H / 2) / (H / 2)
            v = min(1.0, (dx * dx + dy * dy) ** 0.5 / 1.25)
            mp[x, y] = int(255 * strength * v ** 2.2)
    L = Image.new("RGBA", (W, H), (0, 0, 0, 255)); L.putalpha(m)
    return L

def compose(kind):
    if kind == "title":
        bg = base_gradient(W // 2, int(H * 0.62), (34, 50, 98), (14, 22, 50), (4, 6, 14))
    else:
        bg = base_gradient(int(W * 0.3), int(H * 0.25), (30, 44, 88), (13, 20, 46), (4, 6, 14))
    img = bg.convert("RGBA")
    img = Image.alpha_composite(img, sunburst(W // 2, H + 60, alpha=34 if kind == "title" else 22))
    img = Image.alpha_composite(img, bokeh(13 if kind == "title" else 9, 21 if kind == "title" else 33))
    img = Image.alpha_composite(img, bokeh(40, 44, big=False).filter(ImageFilter.GaussianBlur(1)))
    img = Image.alpha_composite(img, vignette(0.5))
    img = Image.alpha_composite(img, sparkles(70 if kind == "title" else 45, 9 if kind == "title" else 19))
    img = Image.alpha_composite(img, art_deco_frame())
    if kind == "title":
        img = Image.alpha_composite(img, crest(W // 2, 265, 1.0))
        img = Image.alpha_composite(img, flourish_line(W // 2, 1080 - 230, 330))
    else:
        img = Image.alpha_composite(img, crest(W - 230, 180, 0.42))
    return img.convert("RGB")

compose("title").save("bg_title.png", optimize=True)
compose("content").save("bg_content.png", optimize=True)
print("ok")
