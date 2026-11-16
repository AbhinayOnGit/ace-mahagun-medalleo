# 3D floor plans

The floor-plan viewer has a **2D plan / 3D view** toggle (`src/components/FloorPlan3D.tsx`, `src/lib/plan3d.ts`).

**How it's built (no invented data):**
- **Floor:** the official brochure plan (`public/images/plans/*.webp`), cropped, with the page background made transparent. All room names, dimensions and furniture shown are the developer's own drawing.
- **Walls:** traced automatically from that drawing by `scripts/plans3d.py` and saved as rectangles in `public/plans3d/<plan>.json`, then extruded in Three.js.
  - Grey-wall plans (Gold/Platinum, Diamond, Sapphire/Garnet): the wall tone is read from each plan's outer edge.
  - Iconic Tower plans draw walls in near-black: `dark` mode.
  - Furniture is filtered out. Wide grey blobs (beds, sofas, rugs) and small isolated blobs are removed.
- **Heights:** an illustrative cut-away (~5.5% of the plan span), **not to scale**. The UI says so on the view and in the caption.
- **Limits:** a few hairline partitions stay flat (they still show on the floor texture). Where the 3D view and the 2D plan differ, the 2D plan rules.

**Performance:** Three.js loads only when a visitor opens 3D (separate chunk; the initial JS budget test still passes). Assets total ~1.3 MB for 8 plans and load per plan.

**Regenerate after a plan image changes:**
```
python3 -I scripts/plans3d.py public/images/plans/<id>.webp public/plans3d/<id>          # grey walls
python3 -I scripts/plans3d.py public/images/plans/<id>.webp public/plans3d/<id> dark     # near-black walls
```
(A `<id>-mask.png` preview of the detected walls is also written; delete it before committing.)
