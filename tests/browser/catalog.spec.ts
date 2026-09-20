import { expect, test } from "@playwright/test";

test("tool search and camera filters are immediate and resettable", async ({
  page,
}) => {
  await page.goto("/hub/apps");
  await expect(page.locator(".tool-card")).toHaveCount(3);
  await page.getByRole("searchbox", { name: "훈련 도구 검색" }).fill("그림");
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "에어 드로잉" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "카메라 없이", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "조건에 맞는 도구가 없습니다" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "전체 도구 보기", exact: true })
    .click();
  await expect(page.locator(".tool-card")).toHaveCount(3);
  await page.getByRole("button", { name: "카메라 활용", exact: true }).click();
  await expect(page.locator(".tool-card")).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: "카메라 활용", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("category URLs and browser history update without a server round trip", async ({
  page,
}) => {
  await page.goto("/hub/apps?cat=kiosk");
  await expect(page.locator(".tool-card")).toHaveCount(1);
  const requests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname === "/hub/apps" && request.headers().rsc === "1")
      requests.push(request.url());
  });
  await page.getByRole("link", { name: "손 인식 AI", exact: true }).click();
  await expect(page).toHaveURL(/cat=hand/);
  await expect(
    page.getByRole("heading", { name: "에어 드로잉" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/cat=kiosk/);
  await expect(
    page.getByRole("heading", { name: "CU 편의점 셀프계산대 훈련" }),
  ).toBeVisible();
  expect(requests).toEqual([]);
});

test("content filters expose counts, empty state, and safe external links", async ({
  page,
}) => {
  await page.goto("/hub");
  await expect(page.locator(".tool-card")).toHaveCount(2);
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  await expect(page.getByText("링크 준비 중", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "영상", exact: true }).click();
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: /감각통합 활동 영상/ }),
  ).toHaveAttribute("target", "_blank");
  await page.getByRole("searchbox", { name: "콘텐츠 검색" }).fill("없는자료");
  await expect(
    page.getByRole("heading", { name: "조건에 맞는 콘텐츠가 없습니다" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "전체 콘텐츠 보기", exact: true })
    .click();
  await expect(page.locator(".tool-card")).toHaveCount(2);
  await page.getByText("관심 주제로 좁혀보기", { exact: true }).click();
  await page.getByRole("button", { name: "지역사회", exact: true }).click();
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "일상생활 참고 자료" }),
  ).toBeVisible();
});

test("home and populated catalogs fit desktop and mobile widths", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [path, name] of [
      ["/", "home"],
      ["/hub/apps", "tools"],
      ["/hub", "content"],
    ]) {
      await page.goto(path);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `test-results/design-${name}-${width}.png`,
          fullPage: true,
        });
    }
  }
  expect(errors).toEqual([]);
});

test("home content is readable without JavaScript or motion", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4180/");
  await expect(
    page.getByRole("heading", { name: /현장의 아이디어를/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "훈련 도구 둘러보기", exact: true }),
  ).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
  await context.close();
});
