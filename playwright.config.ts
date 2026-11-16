import { defineConfig, devices } from "@playwright/test";

/**
 * E2E suite. Runs against a production build with a local PGlite-backed
 * Supabase test double (tests/support/mock-supabase.mjs) — never a live database.
 *   npm run test:e2e
 * To test a deployed preview instead: BASE_URL=https://<preview> npx playwright test --grep-invert @local
 */
const PORT = 3100;
const external = !!process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: { baseURL: process.env.BASE_URL || `http://localhost:${PORT}`, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: external
    ? undefined
    : [
        { command: "node tests/support/mock-supabase.mjs", port: 54321, reuseExistingServer: true },
        { command: `npx next start -p ${PORT}`, port: PORT, reuseExistingServer: false, timeout: 60_000 },
      ],
});
