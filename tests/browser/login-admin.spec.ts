import { expect, test } from "@playwright/test";
import { signInFixture } from "../helpers/session";

test("login gives public alternatives, role guidance and a bounded error message", async ({
  page,
}) => {
  await page.goto("/login?next=%2Fassess%2Fsample&error=untrusted-message");
  await expect(
    page.getByRole("heading", { name: "로그인 / 회원가입" }),
  ).toBeVisible();
  await expect(
    page.getByText("치료사 인증이 필요한 기능입니다", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "로그인을 완료하지 못했습니다",
  );
  await expect(page.getByText("untrusted-message")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "로그인 없이 훈련 도구 둘러보기 →" }),
  ).toHaveAttribute("href", "/hub/apps");
  await page.goto("/login?next=%2Fadmin%3Ftab%3Dvisits");
  await expect(page.getByText("관리자 계정으로 로그인해 주세요")).toBeVisible();
});

test("login shows pending feedback and preserves the safe OAuth destination", async ({
  page,
}) => {
  await page.route("**/login?**", async (route) => {
    if (route.request().method() === "POST")
      await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.goto("/login?next=%2Fhub%2Fapps%2Fairdrawing");
  const click = page.getByRole("button", { name: "Google로 계속하기" }).click();
  await expect(
    page.getByRole("button", { name: "Google로 이동 중…" }),
  ).toBeDisabled();
  await click;
  await expect(
    page.getByRole("heading", { name: "Local OAuth destination" }),
  ).toBeVisible();
  const url = new URL(page.url());
  expect(url.searchParams.get("provider")).toBe("google");
  const callback = new URL(url.searchParams.get("redirect_to")!);
  expect(callback.pathname).toBe("/auth/callback");
  expect(callback.searchParams.get("next")).toBe("/hub/apps/airdrawing");
});

test("login still submits without JavaScript and rejects an external return path", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4180/login?next=%2F%2Fevil.example");
    await page.getByRole("button", { name: "Google로 계속하기" }).click();
    await expect(
      page.getByRole("heading", { name: "Local OAuth destination" }),
    ).toBeVisible();
    const callback = new URL(
      new URL(page.url()).searchParams.get("redirect_to")!,
    );
    expect(callback.searchParams.get("next")).toBe("/me");
  } finally {
    await context.close();
  }
});

test("visit period updates metrics and rankings together", async ({
  page,
  context,
}) => {
  await signInFixture(context, "admin");
  await page.goto("/admin?tab=visits");
  await expect(
    page.getByRole("heading", { name: "방문 현황", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".analytics-metrics")).toContainText("84");
  await expect(page.locator(".analytics-metrics")).toContainText("28");
  await expect(page.locator(".analytics-ranking li")).toHaveCount(3);
  await expect(page.locator(".analytics-ranking li").first()).toContainText(
    "42",
  );
  const period = page.getByRole("navigation", { name: "방문 통계 집계 기간" });
  await period.getByRole("link", { name: "최근 30일" }).click();
  await expect(period.getByRole("link", { name: "최근 30일" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.locator(".analytics-metrics")).toContainText("360");
  await expect(page.locator(".analytics-metrics")).toContainText("90");
  await expect(page.locator(".analytics-ranking li").first()).toContainText(
    "180",
  );
  await expect(page.locator(".analytics-total")).toContainText("1,200");
  await page.goBack();
  await expect(page.locator(".analytics-metrics")).toContainText("84");
});

for (const scenario of ["admin-stats-error", "admin-top-error"]) {
  test(`partial statistics failure preserves successful results: ${scenario}`, async ({
    page,
    context,
  }) => {
    await signInFixture(context, scenario);
    await page.goto("/admin?tab=visits&days=30");
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "데이터가 0건이라는 뜻은 아닙니다",
    );
    await expect(
      page.getByRole("link", { name: "통계 다시 불러오기 →" }),
    ).toHaveAttribute("href", "/admin?tab=visits&days=30");
    if (scenario === "admin-stats-error") {
      await expect(page.locator(".analytics-metrics")).toHaveCount(0);
      await expect(page.locator(".analytics-ranking li")).toHaveCount(3);
    } else {
      await expect(page.locator(".analytics-metrics")).toContainText("360");
      await expect(page.locator(".analytics-ranking li")).toHaveCount(0);
    }
  });
}

test("genuine zero data is not shown as a load error", async ({
  page,
  context,
}) => {
  await signInFixture(context, "admin-empty");
  await page.goto("/admin?tab=visits&days=30");
  await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
  await expect(page.locator(".analytics-metrics dd").first()).toHaveText("0회");
  await expect(
    page.getByRole("heading", { name: "선택한 기간의 방문 기록이 없습니다" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "최근 7일 보기 →" }),
  ).toHaveAttribute("href", "/admin?tab=visits&days=7");
});

test("non-admin roles cannot enter visit statistics", async ({
  page,
  context,
}) => {
  for (const scenario of ["member", "therapist"]) {
    await signInFixture(context, scenario);
    await page.goto("/admin?tab=visits");
    await expect(page).toHaveURL(/\/me$/);
    await expect(
      page.getByRole("heading", { name: "방문 현황", exact: true }),
    ).toHaveCount(0);
  }
});

test("login and visit dashboard fit mobile and desktop", async ({
  page,
  context,
}) => {
  await signInFixture(context, "admin");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [path, name] of [
      ["/login", "login"],
      ["/admin?tab=visits", "admin-visits"],
    ]) {
      await page.goto(path);
      await expect(page.locator("main h1")).toBeVisible();
      if (name === "admin-visits")
        await expect(page.locator(".analytics-ranking li")).toHaveCount(3);
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
