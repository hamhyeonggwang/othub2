import { expect, test } from "@playwright/test";

test("slow page data shows navigation feedback while the sidebar stays usable", async ({ page }) => {
  await page.goto("/about");
  await page.route("**/hub?*", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await route.continue();
  });
  const menu = page.getByRole("navigation", { name: "주요 메뉴" });
  const click = menu.getByRole("link", { name: "Content", exact: true }).click();
  await expect(page.locator('.nav-hint[data-pending="true"], .route-loading [role="status"]').first()).toBeVisible({ timeout: 1000 });
  await expect(menu.getByRole("link", { name: "소개", exact: true })).toBeVisible();
  await click;
  await expect(page.getByRole("heading", { name: "Content", exact: true })).toBeVisible();
});

test("prefetch does not count; navigation survives telemetry failure", async ({ page }) => {
  const views: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/page-view", async (route) => {
    views.push(route.request().postDataJSON().path);
    await route.fulfill({ status: 503 });
  });
  await page.goto("/");
  await expect.poll(() => views).toEqual(["/"]);
  const tool = page.getByRole("navigation", { name: "주요 메뉴" }).getByRole("link", { name: "Tool", exact: true });
  await tool.hover();
  await page.waitForTimeout(1200);
  expect(views).toEqual(["/"]);
  await tool.click();
  await expect(tool).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "Tool", exact: true })).toBeVisible();
  await expect.poll(() => views).toEqual(["/", "/hub/apps"]);
  await page.getByRole("link", { name: "키오스크 훈련", exact: true }).click();
  await expect(page).toHaveURL(/cat=kiosk/);
  expect(views).toEqual(["/", "/hub/apps"]);
  await page.goBack();
  await page.goBack();
  await expect.poll(() => views).toEqual(["/", "/hub/apps", "/"]);
  expect(errors).toEqual([]);
});

test("mobile menu is accessible, fits, and closes after navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "메뉴 열기" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "메뉴 닫기" })).toHaveAttribute("aria-expanded", "true");
  const menu = page.getByRole("navigation", { name: "주요 메뉴" });
  await expect(menu.getByRole("link", { name: "소개", exact: true })).toBeInViewport();
  await menu.getByRole("link", { name: "Tool", exact: true }).click();
  await expect(page.getByRole("button", { name: "메뉴 열기" })).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("heading", { name: "Tool", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/tool-mobile.png", fullPage: true });
});

test("anonymous admin and static assessment access remain protected", async ({ request }) => {
  for (const path of ["/admin", "/assess", "/assess/hub.html"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toContain("/login?next=");
  }
});

test("real endpoint preserves the existing table shape on the local backend", async ({ page, request }) => {
  await page.goto("/about");
  await expect.poll(async () => (await request.get("http://127.0.0.1:4181/__views")).json()).toContainEqual({
    path: "/about", visitor_id: expect.any(String),
  });
  await page.screenshot({ path: "test-results/about-desktop.png", fullPage: true });
});
