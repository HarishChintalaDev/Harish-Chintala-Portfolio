import { defineConfig, devices } from "@playwright/test";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // The page intentionally exercises media-rich sections. One browser at a
  // time keeps WebKit and native Edge runs deterministic on lower-memory CI
  // and developer machines.
  workers: 1,
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "line",
  timeout: 90_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: externalBaseUrl ?? "http://127.0.0.1:3200",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    actionTimeout: 20_000,
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        // `npm run test:e2e` builds first via its npm lifecycle pre-script, so
        // the checks exercise the same optimized server shipped to production.
        command: "npm run start -- --hostname 127.0.0.1 --port 3200",
        url: "http://127.0.0.1:3200",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "edge-laptop",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: "firefox-desktop",
      use: { ...devices["Desktop Firefox"], viewport: { width: 1366, height: 768 } },
    },
    {
      name: "webkit-mobile",
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "chromium-small-mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 320, height: 568 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
    {
      name: "webkit-tablet",
      use: {
        browserName: "webkit",
        viewport: { width: 820, height: 1180 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
    {
      name: "chromium-landscape",
      use: {
        browserName: "chromium",
        viewport: { width: 844, height: 390 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
  ],
});
