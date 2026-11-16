import { expect, test } from "@playwright/test";

test("accessibility basics: landmarks, labels, heading order, focusable controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  // every form control has an accessible name
  const unnamed = await page.evaluate(() =>
    Array.from(document.querySelectorAll("input:not([type=hidden]):not([tabindex='-1']), select, textarea"))
      .filter((el) => { const id = el.id; const lab = id && document.querySelector(`label[for="${id}"]`); return !lab && !el.closest("label") && !el.getAttribute("aria-label"); })
      .map((el) => el.outerHTML.slice(0, 80)));
  expect(unnamed).toEqual([]);
  // buttons/links have names
  const nameless = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href], button")).filter((el) => !(el.textContent?.trim() || el.getAttribute("aria-label"))).map((el) => el.outerHTML.slice(0, 80)));
  expect(nameless).toEqual([]);
  // heading levels never skip downward by more than one
  const levels = await page.evaluate(() => Array.from(document.querySelectorAll("h1,h2,h3,h4")).map((h) => +h.tagName[1]));
  for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  // skip link
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
});

test("performance budget (lab, local)", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  const m = await page.evaluate(async () => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const lcp = await new Promise<number>((res) => {
      new PerformanceObserver((l) => { const e = l.getEntries(); res(e[e.length - 1].startTime); }).observe({ type: "largest-contentful-paint", buffered: true });
      setTimeout(() => res(-1), 3000);
    });
    const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const js = res.filter((r) => r.initiatorType === "script").reduce((s, r) => s + (r.transferSize || r.encodedBodySize), 0);
    const cls = await new Promise<number>((r) => { let v = 0; new PerformanceObserver((l) => { for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) v += e.value; }).observe({ type: "layout-shift", buffered: true }); setTimeout(() => r(v), 1500); });
    return { ttfb: nav.responseStart, domContentLoaded: nav.domContentLoadedEventEnd, lcp, jsKB: Math.round(js / 1024), cls };
  });
  test.info().annotations.push({ type: "perf", description: JSON.stringify(m) });
  console.log("PERF", test.info().project.name, JSON.stringify(m));
  expect(m.lcp).toBeLessThan(2500);
  expect(m.cls).toBeLessThan(0.1);
  expect(m.jsKB).toBeLessThan(350);
});

test("axe: no WCAG 2.1 A/AA violations across the whole page", async ({ browser }) => {
  // Reduced motion so scroll-reveal content is visible and gets checked too.
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: test.info().project.use.viewport ?? undefined });
  const page = await ctx.newPage();
  await page.goto("/");
  for (let y = 0; y < 16000; y += 800) await page.mouse.wheel(0, 800);
  await page.waitForTimeout(500);
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const summary = r.violations.map((v) => `${v.id} x${v.nodes.length}: ${v.nodes[0]?.html.slice(0, 80)}`);
  expect(summary).toEqual([]);
  await ctx.close();
});

test("every render carries a visible 'Artist's impression' label", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("impression-tag").first()).toBeVisible(); // hero
  await page.locator("#gallery").scrollIntoViewIfNeeded();
  const items = page.getByTestId("gallery-item");
  const n = await items.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) await expect(items.nth(i).getByTestId("impression-tag")).toHaveText(/Artist's impression/);
  await expect(page.locator("#amenities").getByTestId("impression-tag").first()).toHaveText(/Artist's impression/);
  await expect(page.locator("#residences").getByTestId("impression-tag").first()).toHaveText(/Artist's impression/);
});
