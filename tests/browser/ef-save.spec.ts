import { expect, test } from "@playwright/test";
import { signInFixture } from "../helpers/session";

/*
 * 실행기능 과제 결과 저장(2단계)
 * - 비로그인·일반 회원에게는 저장 상자가 없다
 * - 인증 치료사는 대상자 코드로 저장하고, 이름 같은 코드는 막힌다
 * - 저장한 기록은 /assess/ef 에서 대상자별 추이와 CSV·삭제 버튼으로 보인다
 */
const PRESS = `(el) => el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerType: "touch" }))`;

async function finishHeartsFlowers(page: import("@playwright/test").Page) {
  await page.goto("/apps/ef/hearts-flowers.html?timing=fast");
  await page.evaluate((src) => {
    const press = eval(src);
    const field = document.getElementById("field")!;
    new MutationObserver(() => {
      for (const side of ["left", "right"]) {
        const svg = document.querySelector(`#box-${side} svg`);
        if (!svg) continue;
        const heart = Boolean(svg.querySelector("path[fill='#d1242f']"));
        setTimeout(() => press(document.getElementById(`key-${heart ? side : side === "left" ? "right" : "left"}`)), 5);
      }
    }).observe(field, { childList: true, subtree: true });
  }, PRESS);
  await page.locator("#start").click();
  for (let i = 0; i < 4; i++) {
    await expect(page.locator("#break")).toBeVisible({ timeout: 30_000 });
    await page.locator("#next").click();
  }
  await expect(page.locator("#summary")).toBeVisible({ timeout: 60_000 });
  await page.locator("#pro-toggle").click();
}

test("anonymous visitors see no save box", async ({ page }) => {
  await finishHeartsFlowers(page);
  await page.waitForTimeout(500);
  await expect(page.getByRole("button", { name: "결과 저장" })).toBeHidden();
});

test("certified therapist saves with a subject code; names are refused", async ({ page, context, request }) => {
  await signInFixture(context, "therapist");
  await finishHeartsFlowers(page);
  const save = page.getByRole("button", { name: "결과 저장" });
  await expect(save).toBeVisible();
  await page.getByLabel("대상자 코드").fill("홍길동");
  await save.click();
  await expect(page.locator("#ef-save-status")).toContainText("영문·숫자");

  await page.getByLabel("대상자 코드").fill("C-012");
  await save.click();
  await expect(page.locator("#ef-save-status")).toContainText("저장했습니다");
  await expect(page.getByRole("link", { name: "C-012 추이 보기" })).toHaveAttribute("href", "/assess/ef?code=C-012");
  // 같은 회기를 두 번 저장하지 않는다
  await save.click();
  await expect(page.locator("#ef-save-status")).toContainText("이미 저장");

  const saved = await (await request.get("http://127.0.0.1:4181/__ef")).json();
  const session = saved.filter((s: { table: string }) => s.table === "sessions").at(-1).row;
  const trials = saved.filter((s: { table: string }) => s.table === "trials").at(-1).row.trials;
  expect(session).toMatchObject({ subject_code: "C-012", task: "hearts_flowers" });
  expect(session.summary.mixedAccuracy).toBe(1);
  expect(trials).toHaveLength(4 + 12 + 4 + 12 + 20 + 20);
  expect(Object.keys(trials[0])).not.toContain("user_agent");
});

test("therapist records page shows subjects, trend and per-session CSV/delete", async ({ page, context }) => {
  await signInFixture(context, "therapist");
  await page.goto("/assess/ef");
  await expect(page.getByRole("heading", { name: "실행기능 과제 기록" })).toBeVisible();
  await expect(page.getByRole("link", { name: /C-001/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /B-7/ })).toBeVisible();
  await page.getByRole("link", { name: /C-001/ }).click();
  await expect(page.getByRole("heading", { name: "대상자 C-001" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "같은 것 찾기 (N-back)" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "불빛 순서 기억하기 (Corsi)" })).toBeVisible();
  // 그래프는 오래된 회기부터: 1 → 2 → 3
  await expect(page.getByRole("img", { name: /본 과제 최고 단계\(n\) 회기별 변화: 1, 2, 3/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "CSV" }).first()).toHaveAttribute("href", /\/api\/ef\/sessions\//);
  await expect(page.getByRole("button", { name: "삭제" })).toHaveCount(4);
  await expect(page.locator("main, #main")).not.toContainText(/정상입니다|저하/);
});

test("members cannot open the therapist records page", async ({ page, context }) => {
  await signInFixture(context, "member");
  await page.goto("/assess/ef");
  await expect(page).toHaveURL(/\/me\?assess=locked/);
});
