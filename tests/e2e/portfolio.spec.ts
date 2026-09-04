import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const hydrationErrorPatterns = [
  /hydration failed/i,
  /hydrated but some attributes/i,
  /server rendered html didn't match/i,
  /text content does not match server-rendered html/i,
];

test("renders every section without browser or hydration errors", async ({ page }) => {
  const browserErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  const response = await page.goto("/", { waitUntil: "networkidle" });

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Harish Chintala Portfolio");
  await expect(page.locator("main section[id]")).toHaveCount(8);
  await expect(page.locator("#contact")).toBeVisible();

  const pageWidths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(pageWidths.document).toBeLessThanOrEqual(pageWidths.viewport);

  expect(
    browserErrors.filter((message) =>
      hydrationErrorPatterns.some((pattern) => pattern.test(message)),
    ),
  ).toEqual([]);
  expect(browserErrors).toEqual([]);
});

test("desktop interactive flows remain functional", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop", "Covered once in desktop Chromium");

  await page.goto("/", { waitUntil: "networkidle" });

  const contactDetailsBox = await page.locator(".contact-details-card").boundingBox();
  const contactFormBox = await page.locator(".contact-form-card").boundingBox();
  expect(contactDetailsBox).not.toBeNull();
  expect(contactFormBox).not.toBeNull();
  expect(Math.abs(contactDetailsBox!.y - contactFormBox!.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(contactDetailsBox!.height - contactFormBox!.height)).toBeLessThanOrEqual(1);

  const commandPaletteTrigger = page.getByRole("button", { name: "Open command palette" });
  await commandPaletteTrigger.click();
  await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search commands" }).fill("case studies");
  await expect(page.getByRole("group", { name: "Command results" })).toContainText(
    "Explore Case Studies",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Command palette" })).toBeHidden();
  await expect(commandPaletteTrigger).toHaveAttribute("data-dialog-focus-restored", "true");
  await expect(commandPaletteTrigger).toBeFocused();
  await page.mouse.move(0, 400);
  await expect(commandPaletteTrigger).not.toHaveAttribute("data-dialog-focus-restored");

  await page.getByRole("button", { name: "Architecture & Details" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("link", { name: "View Resume" }).click();
  await expect(page.getByRole("dialog", { name: /Resume Download/ })).toBeVisible();
  await page.getByRole("button", { name: "Close resume download modal" }).click();
  await expect(page.getByRole("dialog", { name: /Resume Download/ })).toBeHidden();

  await page.route("**/formsubmit.co/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: "true", message: "Thank you!" }),
    });
  });

  await page.getByLabel("Your Name").fill("Portfolio Tester");
  await page.getByLabel("Your Email").fill("tester@example.com");
  await page.getByLabel("Your Message").fill("Automated portfolio smoke test");
  await page.getByRole("button", { name: "Send Email" }).click();
  await expect(page.getByRole("heading", { name: /Thank You/ })).toBeVisible();
});

test("mobile navigation opens, closes, and fits the viewport", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium-small-mobile",
    "Covered once at the narrowest supported viewport",
  );

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
});

test("public APIs return safe, usable responses", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop", "API behavior is browser-independent");

  const availability = await request.get("/api/contact");
  expect(availability.status()).toBe(200);
  expect(await availability.json()).toHaveProperty("secureDeliveryAvailable");

  const invalidSubmission = await request.post("/api/contact", {
    data: { name: "Test User", email: "invalid", company: "", message: "Hello" },
  });
  expect(invalidSubmission.status()).toBe(400);

  const resume = await request.get("/api/resume");
  expect(resume.status()).toBe(200);
  expect(resume.headers()["content-type"]).toContain("application/pdf");
  expect((await resume.body()).byteLength).toBeGreaterThan(1_000);

  const profile = await request.get("/api/profile-image");
  expect(profile.status()).toBe(200);
  expect(profile.headers()["content-type"]).toMatch(/^image\//);
});

test("has no automatically detectable accessibility violations", async ({ page }, testInfo) => {
  test.skip(
    !["chromium-desktop", "chromium-small-mobile"].includes(testInfo.project.name),
    "Covered at representative desktop and mobile viewports",
  );

  await page.goto("/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
