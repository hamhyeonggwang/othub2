import { expect, test, type BrowserContext, type Page } from "@playwright/test";

async function signInFixture(context: BrowserContext, scenario: string) {
  const expires = Math.floor(Date.now() / 1000) + 3600;
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const token = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: "11111111-1111-4111-8111-111111111111", exp: expires, fixture: scenario })}.test-only`;
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      url: "http://127.0.0.1:4180",
      value: `base64-${encode({ access_token: token, refresh_token: "test-only", token_type: "bearer", expires_at: expires, expires_in: 3600, user: { id: "11111111-1111-4111-8111-111111111111" } })}`,
    },
  ]);
}

async function mockTool(page: Page) {
  await page.route("**/apps/test-tool.html", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<!doctype html><html lang="ko"><body style="margin:0;background:#edf5f0;color:#173c36;display:grid;place-items:center;height:100vh;font:18px sans-serif"><p>로컬 테스트용 훈련 화면</p></body></html>',
    }),
  );
}

test("detail preserves embedded tools, category, camera and login return path", async ({
  page,
}) => {
  await mockTool(page);
  await page.goto("/hub/apps/airdrawing");
  await expect(
    page.getByRole("heading", { name: "에어 드로잉", exact: true }),
  ).toBeVisible();
  await expect(page.locator("iframe")).toHaveAttribute(
    "allow",
    "camera; fullscreen",
  );
  await expect(
    page.getByRole("link", { name: "← 훈련 도구 목록으로" }),
  ).toHaveAttribute("href", "/hub/apps?cat=hand");
  await expect(page.getByText("카메라 사용", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "로그인하고 북마크하기 →" }),
  ).toHaveAttribute("href", "/login?next=%2Fhub%2Fapps%2Fairdrawing");
  await expect(
    page.getByRole("button", { name: "북마크", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.goto("/hub/apps/cu-kiosk-trainer");
  await expect(page.locator("iframe")).toHaveAttribute("allow", "fullscreen");
  await expect(
    page.getByText("카메라 없이 이용", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "전체화면으로 보기" }).click();
  await expect(
    page.getByRole("button", { name: "전체화면 종료" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "전체화면 종료" }).click();
  await expect(
    page.getByRole("button", { name: "전체화면으로 보기" }),
  ).toBeVisible();
});

test("member workspace has actionable empty state and certification, not privileged links", async ({
  page,
  context,
}) => {
  await signInFixture(context, "member");
  await page.goto("/me?assess=locked");
  await expect(
    page.getByRole("heading", { name: "My Hub", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "다시 볼 자료를 모아보세요" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "훈련 도구 찾아보기", exact: true }),
  ).toHaveAttribute("href", "/hub/apps");
  await expect(page.getByLabel("면허번호")).toBeVisible();
  await expect(
    page.getByText("평가 도구는 치료사 인증 후 이용할 수 있습니다."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "최근 평가 세션" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "관리자 대시보드 열기" }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.screenshot({
    path: "test-results/design-myhub-member-390.png",
    fullPage: true,
  });
});

test("pending certification avoids duplicate request form", async ({
  page,
  context,
}) => {
  await signInFixture(context, "pending");
  await page.goto("/me");
  await expect(
    page.getByText("인증 요청을 검토 중입니다", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("면허번호")).toHaveCount(0);
});

test("therapist has saved resources, safe external links and only three recent sessions", async ({
  page,
  context,
}) => {
  await signInFixture(context, "therapist");
  await page.goto("/me");
  await expect(page.locator(".saved-card")).toHaveCount(3);
  await expect(page.locator(".personal-sessions li")).toHaveCount(3);
  await expect(page.getByText("전체 4개 중 최근 3개")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /감각통합 활동 영상/ }),
  ).toHaveAttribute("target", "_blank");
  await expect(page.locator("article.saved-card")).toContainText(
    "링크 준비 중",
  );
  await expect(
    page.getByRole("link", { name: "관리자 대시보드 열기" }),
  ).toHaveCount(0);
  await expect(page.getByLabel("면허번호")).toHaveCount(0);
});

test("therapist without sessions has an assessment entry action", async ({
  page,
  context,
}) => {
  await signInFixture(context, "empty-therapist");
  await page.goto("/me");
  await expect(
    page.getByRole("heading", { name: "아직 저장된 평가 세션이 없습니다" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "평가 도구 열기", exact: true }),
  ).toHaveAttribute("href", "/assess");
});

test("admin workspace and detail fit desktop and small screens", async ({
  page,
  context,
}) => {
  await signInFixture(context, "admin");
  await mockTool(page);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [path, name] of [
      ["/me", "myhub"],
      ["/hub/apps/cu-kiosk-trainer", "detail"],
    ]) {
      await page.goto(path);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (path === "/me")
        await expect(
          page.getByRole("link", { name: "관리자 대시보드 열기" }),
        ).toBeVisible();
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `test-results/design-${name}-${width}.png`,
          fullPage: true,
        });
    }
  }
  expect(errors).toEqual([]);
});
