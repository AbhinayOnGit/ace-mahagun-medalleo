/**
 * Visible "Artist's impression" label for every render or representative image.
 * Place inside a positioned (relative/absolute) container that wraps the image.
 */
type Corner = "tl" | "tr" | "bl" | "br";
const pos: Record<Corner, string> = {
  tl: "left-3 top-3",
  tr: "right-3 top-3",
  bl: "left-3 bottom-3",
  br: "right-3 bottom-3",
};

export const IMPRESSION_TEXT = "Artist's impression";

export default function ImpressionTag({ corner = "br", extra }: { corner?: Corner; extra?: string }) {
  return (
    <span
      className={`pointer-events-none absolute z-10 ${pos[corner]} bg-ink/60 px-2 py-1 text-xs font-medium uppercase tracking-[0.16em] text-ivory backdrop-blur-sm`}
      data-testid="impression-tag"
    >
      {IMPRESSION_TEXT}
      {extra ? ` · ${extra}` : ""}
    </span>
  );
}
