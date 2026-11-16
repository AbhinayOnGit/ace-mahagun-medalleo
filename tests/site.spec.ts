import { expect, test, type Page } from "@playwright/test";

const errors: string[] = [];
test.beforeEach(async ({ page }) => {
  errors.length = 0;
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
});

async function fillValid(page: Page, scope: string, mobile: string) {
  const f = page.getByTestId(scope);
  await f.getByLabel("Full name *").fill("Playwright Test");
  await f.getByLabel("Mobile number *").fill(mobile);
  await f.getByLabel(/Email/).fill("qa@example.com");
  await f.getByText("4 BHK", { exact: true }).click();
  await f.getByRole("checkbox").check();
}
const randomMobile = () => "9" + String(Math.floor(100000000 + Math.random() * 899999999));

test("page loads with SEO essentials and no console errors", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/ACE Mahagun Medalleo.*Sector 107/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /UPRERAPRJ125561/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  expect(await page.locator("h1").count()).toBe(1);
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld!).map((x: { "@type": string }) => x["@type"])).toEqual(["ApartmentComplex", "FAQPage"]);
  await expect(page.getByText("UPRERAPRJ125561").first()).toBeVisible();
  await page.waitForTimeout(800);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("all images load and have alt text", async ({ page }) => {
  await page.goto("/");
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.waitForLoadState("networkidle");
  const bad = await page.evaluate(() => Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  expect(bad).toEqual([]);
  const noAlt = await page.evaluate(() => Array.from(document.images).filter((i) => !i.hasAttribute("alt")).map((i) => i.src));
  expect(noAlt).toEqual([]);
});

test("internal anchors resolve and static routes respond", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('a[href^="#"], a[href^="/#"]')).map((a) => a.getAttribute("href")!));
  for (const h of new Set(hrefs)) {
    const id = h.replace(/^\/?#/, "");
    expect(await page.locator(`[id="${id}"]`).count(), `missing target #${id}`).toBe(1);
  }
  for (const p of ["/privacy", "/terms", "/robots.txt", "/sitemap.xml", "/images/og.jpg"]) {
    expect((await request.get(p)).status(), p).toBe(200);
  }
});

test("navigation: sticky header and section links", async ({ page }) => {
  const compact = (page.viewportSize()?.width ?? 1440) < 1024;
  await page.goto("/");
  const header = page.locator("header").first();
  await page.mouse.wheel(0, 900);
  await expect(header).toHaveClass(/bg-ink/);
  if (compact) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: /Amenities/ }).click();
  } else {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Amenities" }).click();
  }
  await expect(page.locator("#amenities")).toBeInViewport();
});

test("hero CTAs and brochure modal (keyboard accessible)", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("hero-brochure").click();
  const modal = page.getByTestId("enquiry-modal");
  await expect(modal).toBeVisible();
  await expect(modal.getByRole("heading", { name: "Request the brochure" })).toBeVisible();
  await expect(modal.getByLabel("Enquiry type *")).toHaveValue("Brochure");
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
  await page.getByTestId("hero-explore").click();
  await expect(page.locator("#residences")).toBeInViewport();
});

test("WhatsApp and click-to-call links are configured and pre-filled", async ({ page }) => {
  await page.goto("/");
  const wa = page.getByTestId("hero-whatsapp");
  await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\/\d{10,15}\?text=.*Medalleo/);
  await expect(page.getByTestId("contact-whatsapp")).toHaveAttribute("href", /site%20visit/);
  await expect(page.getByTestId("contact-call")).toHaveAttribute("href", /^tel:\+?\d+$/);
  await page.mouse.wheel(0, 1500);
  await expect(page.getByTestId("float-whatsapp")).toHaveAttribute("href", /wa\.me/);
});

test("floor-plan viewer: tabs, area table, zoom lightbox", async ({ page }) => {
  await page.goto("/#floor-plans");
  await page.getByTestId("tab-Iconic Tower").click();
  await expect(page.getByTestId("area-table")).toContainText("4,775");
  await page.getByRole("radio", { name: /Unit 2/ }).click();
  await expect(page.getByTestId("area-table")).toContainText("4,650");
  await page.getByRole("button", { name: "sq m" }).click();
  await expect(page.getByTestId("area-table")).toContainText("431.99");
  await page.getByTestId("floorplan-open").click();
  const lb = page.getByTestId("plan-lightbox");
  await expect(lb).toBeVisible();
  await lb.getByRole("button", { name: "Zoom in" }).click();
  await expect(lb).toContainText("150%");
  await page.keyboard.press("ArrowRight");
  await expect(lb).toContainText("09 / 09");
  await page.keyboard.press("Escape");
  await expect(lb).toBeHidden();
});

test("EMI estimator: blank until inputs, computes standard EMI", async ({ page }) => {
  await page.goto("/");
  const out = page.getByTestId("emi-value");
  await page.getByTestId("emi-section").scrollIntoViewIfNeeded();
  await expect(out).toHaveText(/—/);
  await page.getByTestId("emi-price").fill("10000000");
  await expect(out).toHaveText(/—/); // no rate yet → no figure
  await page.getByTestId("emi-rate").fill("9");
  // 1 Cr, 20% down → 80 L loan, 9% p.a., 20 yrs → ₹71,978/month
  await expect(out).toContainText("71,978");
});

test("gallery: filter, lightbox navigation, show all", async ({ page }) => {
  await page.goto("/#gallery");
  const before = await page.getByTestId("gallery-item").count();
  await page.getByTestId("gallery-toggle").click();
  expect(await page.getByTestId("gallery-item").count()).toBeGreaterThan(before);
  await page.getByRole("tab", { name: "Interiors" }).click();
  await page.getByTestId("gallery-item").first().click();
  const lb = page.getByTestId("gallery-lightbox");
  await expect(lb).toContainText("01 /");
  await page.getByTestId("gallery-lightbox-next").click();
  await expect(lb).toContainText("02 /");
  await page.getByTestId("gallery-lightbox-close").click();
  await expect(lb).toBeHidden();
});

test("location: distances and interactive map loads on request", async ({ page }) => {
  await page.goto("/#location");
  await page.getByRole("tab", { name: "Metro" }).click();
  await expect(page.getByTestId("distance-list")).toContainText("Sector 101 Metro (Aqua Line)");
  await expect(page.locator('iframe[title^="Map"]')).toHaveCount(0);
  await page.getByTestId("load-map").click();
  await expect(page.locator('iframe[title^="Map"]')).toHaveAttribute("src", /google\.com\/maps.*Medalleo/);
});

test("FAQ expands", async ({ page }) => {
  await page.goto("/");
  const q = page.getByText("What is the project's RERA registration number?");
  await q.click();
  await expect(page.getByText(/registration number is UPRERAPRJ125561/)).toBeVisible();
});

test("enquiry form validation (client side)", async ({ page }) => {
  await page.goto("/#contact");
  const f = page.getByTestId("enquiry-form-contact");
  await f.getByTestId("enquiry-submit").click();
  await expect(f.getByText("Please enter your full name")).toBeVisible();
  await expect(f.getByText("Enter a valid 10-digit Indian mobile number")).toBeVisible();
  await expect(f.getByText("Select a configuration")).toBeVisible();
  await expect(f.getByText("Please accept to be contacted")).toBeVisible();
  await f.getByLabel("Mobile number *").fill("12345");
  await f.getByLabel(/Email/).fill("not-an-email");
  await f.getByTestId("enquiry-submit").click();
  await expect(f.getByText("Enter a valid email address")).toBeVisible();
  await expect(f.getByLabel("Full name *")).toBeFocused();
});

test("@local enquiry submission stores a test lead; duplicate is detected", async ({ page, request }, info) => {
  const mobile = randomMobile();
  await page.goto("/#contact");
  await fillValid(page, "enquiry-form-contact", `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`);
  await page.getByTestId("enquiry-form-contact").getByTestId("enquiry-submit").click();
  await expect(page.getByTestId("enquiry-success")).toContainText("site visit request has been received");

  // Same person, same type via modal → duplicate message
  await page.getByTestId("final-sitevisit").click();
  await fillValid(page, "enquiry-form-final-cta", mobile);
  await page.getByTestId("enquiry-form-final-cta").getByTestId("enquiry-submit").click();
  await expect(page.getByTestId("enquiry-modal").getByTestId("enquiry-success")).toContainText("already have your recent enquiry");

  const rows = await (await request.get("http://localhost:54321/__admin/leads")).json();
  const mine = rows.filter((r: { mobile: string }) => r.mobile === mobile);
  expect(mine).toHaveLength(1);
  expect(mine[0]).toMatchObject({ customer_name: "Playwright Test", configuration: "4 BHK", enquiry_type: "Site Visit", lead_status: "Test", is_test: true, consent_status: true, form_location: "contact" });
  info.annotations.push({ type: "lead", description: JSON.stringify(mine[0]) });
});

test("@local API: server-side validation, honeypot, rejects bad payloads", async ({ request }) => {
  const base = { name: "API Test", mobile: "9812345678", email: "", configuration: "3 BHK", enquiryType: "Callback", consent: true, idempotencyKey: crypto.randomUUID() };
  let r = await request.post("/api/enquiry", { data: { ...base, mobile: "5812345678" } });
  expect(r.status()).toBe(422);
  expect((await r.json()).fieldErrors.mobile).toBeTruthy();
  r = await request.post("/api/enquiry", { data: { ...base, consent: false } });
  expect(r.status()).toBe(422);
  r = await request.post("/api/enquiry", { data: { ...base, company: "spam-bot" } });
  expect(r.status()).toBe(200); // silently accepted, not stored
  const rows = await (await request.get("http://localhost:54321/__admin/leads")).json();
  expect(rows.find((x: { mobile: string }) => x.mobile === "9812345678")).toBeUndefined();
  r = await request.fetch("/api/enquiry", { method: "POST", headers: { "content-type": "application/json" }, data: Buffer.from("{not json") });
  expect(r.status()).toBe(400);
});

test("reduced motion: content visible without animation", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("#overview").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: /More Than a Residence/ })).toBeVisible();
  await ctx.close();
});

test("@local API: per-IP rate limit returns 429", async ({ request }) => {
  test.skip(test.info().project.name !== "desktop", "run once");
  const ip = `10.0.0.${Math.floor(Math.random() * 200) + 20}`;
  const mk = () => ({ name: "Rate Test", mobile: "9" + String(Math.floor(100000000 + Math.random() * 899999999)), configuration: "3 BHK", enquiryType: "Callback", consent: true, idempotencyKey: crypto.randomUUID() });
  const limit = Number(process.env.ENQUIRY_RATE_LIMIT || 5);
  let last = 0;
  for (let i = 0; i <= limit; i++) last = (await request.post("/api/enquiry", { data: mk(), headers: { "x-forwarded-for": ip } })).status();
  expect(last).toBe(429);
});
