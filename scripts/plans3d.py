import sys, json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, out_prefix = sys.argv[1], sys.argv[2]
mode = sys.argv[3] if len(sys.argv) > 3 else "grey"   # "dark" for plans drawn with near-black walls
im = Image.open(src).convert("RGB"); a = np.asarray(im).astype(np.int16)
H, W, _ = a.shape
r, g, b = a[...,0], a[...,1], a[...,2]
mx = a.max(-1); mn = a.min(-1); sat = mx - mn
# plan region: non-black content in the left part (table/title live on the right)
content = mx > 40
left = np.zeros_like(content); left[:, : int(W*0.5)] = True
cc, n = ndi.label(ndi.binary_closing(content & left, iterations=6))
sizes = ndi.sum(np.ones_like(cc), cc, range(1, n+1)); k = int(np.argmax(sizes)) + 1
ys, xs = np.where(cc == k); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
# walls: neutral mid-grey bands (low saturation), thick
# self-calibrate: wall tone = median grey just inside the plan's outer edge (outer walls)
region = ndi.binary_fill_holes(cc == k)
ring = region & ~ndi.binary_erosion(region, iterations=10)
cand = ring & (sat < 16) & (mx > 60) & (mx < 235)
tone = float(np.median(mx[cand])) if cand.sum() > 200 else 140.0
grey = (sat < 16) & (np.abs(mx - tone) < 22)
if mode == "dark":
    # walls are near-black bands *inside* the plan footprint (background outside is also dark)
    inner = ndi.binary_erosion(region, iterations=2)
    grey = (sat < 18) & (mx < 75) & inner
    tone = -1
grey[:y0] = grey[y1:] = False; grey[:, :x0] = grey[:, x1:] = False
th = 4  # keep thin partitions; drop hairline furniture strokes
walls = ndi.binary_opening(grey, structure=np.ones((th, th)))
# furniture (beds, sofas, rugs, counters) = wide grey blobs; walls/columns are < ~40px across
big = ndi.binary_opening(walls, structure=np.ones((40, 40)))
walls &= ~ndi.binary_dilation(big, iterations=2)
walls = ndi.binary_closing(walls, structure=np.ones((3, 3)))
lab, m = ndi.label(walls); s_ = ndi.sum(walls, lab, range(1, m+1))
sl = ndi.find_objects(lab)
span = np.array([max(z[0].stop - z[0].start, z[1].stop - z[1].start) for z in sl])
walls &= np.isin(lab, np.where((s_ > 350) & (span >= 50))[0] + 1)  # isolated small blobs = furniture
# grid -> merged rectangles
cell = 4
gh, gw = (y1 - y0) // cell + 1, (x1 - x0) // cell + 1
sub = walls[y0:y0 + gh*cell, x0:x0 + gw*cell]
sub = np.pad(sub, ((0, gh*cell - sub.shape[0]), (0, gw*cell - sub.shape[1])))
grid = sub.reshape(gh, cell, gw, cell).mean((1, 3)) > 0.5
rects, used = [], np.zeros_like(grid)
for y in range(gh):
    x = 0
    while x < gw:
        if grid[y, x] and not used[y, x]:
            x2 = x
            while x2 + 1 < gw and grid[y, x2+1] and not used[y, x2+1]: x2 += 1
            y2 = y
            while y2 + 1 < gh and grid[y2+1, x:x2+1].all() and not used[y2+1, x:x2+1].any(): y2 += 1
            used[y:y2+1, x:x2+1] = True
            rects.append([x*cell, y*cell, (x2-x+1)*cell, (y2-y+1)*cell])
            x = x2 + 1
        else: x += 1
# floor texture: plan only — black page background made transparent
alpha = ndi.binary_dilation(region, iterations=2)
rgba = np.dstack([np.asarray(im), (alpha * 255).astype(np.uint8)])
crop = Image.fromarray(rgba, "RGBA").crop((x0, y0, x1, y1)); crop.thumbnail((2048, 2048))
crop.save(out_prefix + ".webp", "WEBP", quality=80, alpha_quality=60)
json.dump({"w": int(x1-x0), "h": int(y1-y0), "rects": rects}, open(out_prefix + ".json", "w"))
viz = np.asarray(im.crop((x0, y0, x1, y1))).copy(); wm = walls[y0:y1, x0:x1]; viz[wm] = [220, 40, 40]
Image.fromarray(viz).save(out_prefix + "-mask.png")
print(src.split("/")[-1], "tone", round(tone), "crop", (x1-x0, y1-y0), "rects", len(rects))
