import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

/*
 * 같은 것 찾기(N-back) 전체 흐름: 연습 → 본 과제 3블록 → 결과 → 치료사 보기 → CSV.
 * ?timing=fast로 제시 시간을 줄여 돌린다. 1-back에서 직전 글자와 같으면 누르는 '완벽한 수행자'를 흉내 낸다.
 */
test("N-back runs practice and three blocks, then exports matching trial data", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/apps/ef/nback.html?timing=fast");
  await page.getByRole("button", { name: /1단계/ }).click();
  await expect(page.locator("#rule-text")).toContainText("바로 앞 글자와 같으면");

  // 직전 글자와 같을 때만 누르는 반응기: 자극이 바뀔 때마다 확인한다
  await page.evaluate(() => {
    let prev: string | null = null;
    const stage = document.getElementById("stage")!;
    const btn = document.getElementById("respond")!;
    new MutationObserver(() => {
      const cur = stage.textContent?.trim();
      if (!cur) return;
      if (cur === prev) btn.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerType: "touch" }));
      prev = cur;
    }).observe(stage, { childList: true, subtree: true, characterData: true });
  });

  await page.getByRole("button", { name: "연습 시작" }).click();
  for (let b = 1; b <= 3; b++) {
    await page.getByRole("button", { name: "계속하기" }).click({ timeout: 30_000 });
  }
  await expect(page.getByRole("heading", { name: "끝까지 해냈어요!" })).toBeVisible({ timeout: 40_000 });

  await page.getByRole("button", { name: "치료사 보기" }).click();
  const rows = page.locator("#pro-table tbody tr");
  await expect(rows).toHaveCount(4); // 연습 + 3블록
  // 완벽한 1-back 수행이면 정확도 100%로 단계가 1 → 2 → 3으로 오른다
  await expect(rows.nth(1).locator("td").nth(1)).toHaveText("1");
  await expect(rows.nth(2).locator("td").nth(1)).toHaveText("2");
  await expect(rows.nth(1).locator("td").nth(6)).toHaveText("100%");
  await expect(page.locator("#pro-table")).not.toContainText(/정상|저하/);

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "시행 기록 CSV 내려받기" }).click(),
  ]);
  const csv = (await readFile((await download.path())!, "utf8")).replace(/^﻿/, "");
  const lines = csv.trim().split("\r\n");
  expect(lines[0]).toContain("session,task,mode,phase,block,level,trial,stimulus,is_target");
  // 시행 수 = 연습(8+1) + 블록마다 (20 + 그 블록 단계). 3번째 블록 단계는 2-back 수행에 따라 달라진다
  const levels = await rows.locator("td:nth-child(2)").allTextContents();
  const expected = 9 + levels.slice(1).reduce((s, l) => s + 20 + Number(l), 0);
  expect(lines.length - 1).toBe(expected);
  // 채점 대상 시행의 correct 열은 표적 여부와 반응이 일치할 때 1이다
  const head = lines[0].split(",");
  const col = (name: string) => head.indexOf(name);
  for (const line of lines.slice(1)) {
    const c = line.split(",");
    if (c[col("scored")] !== "1") continue;
    expect(c[col("correct")]).toBe(c[col("is_target")] === c[col("response")] ? "1" : "0");
  }
  expect(errors).toEqual([]);
});
