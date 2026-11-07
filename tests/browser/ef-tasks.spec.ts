import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

/*
 * 실행기능 과제 4종(Stroop, Corsi, Card Sort, Hearts and Flowers) 전체 흐름.
 * 각 과제는 ?timing=fast로 돌리고, 페이지 안에 '규칙대로 답하는 반응기'를 심어 끝까지 수행한다.
 * 확인: 결과 화면 도달, 치료사 표, 판정 문구 없음, CSV 행 수와 정답 열, 페이지 오류 없음.
 */

const press = `(el) => el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerType: "touch" }))`;

/** RFC 4180 CSV 읽기 (따옴표 안 쉼표·줄바꿈 처리) */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\r" && text[i + 1] === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; i++; }
    else cell += ch;
  }
  row.push(cell); rows.push(row);
  return rows;
}

async function csvRows(page: Page) {
  await page.getByRole("button", { name: "치료사 보기" }).click();
  await expect(page.locator("#pro")).not.toContainText(/정상입니다|저하/);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "시행 기록 CSV 내려받기" }).click(),
  ]);
  const csv = (await readFile((await download.path())!, "utf8")).replace(/^﻿/, "");
  const [head, ...body] = parseCSV(csv.trim());
  return body.map((c) => Object.fromEntries(head.map((h, i) => [h, c[i]])));
}

/** 쉬는 화면의 버튼을 차례로 누른다 (시작 화면 버튼과 이름이 같아도 쉬는 화면 것만) */
async function clickThrough(page: Page, name: string, times: number) {
  const brk = page.locator("#break");
  for (let i = 0; i < times; i++) {
    await expect(brk).toBeVisible({ timeout: 30_000 });
    await brk.getByRole("button", { name, exact: true }).click();
    await expect(brk).toBeHidden({ timeout: 30_000 });
  }
}

test("Stroop: color check, practice and two halves end with condition table and interference", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/apps/ef/stroop.html?timing=fast");
  await page.getByRole("button", { name: /그림/ }).click();
  // 칠해진 색과 같은 색 점을 가진 버튼을 누른다
  await page.evaluate((pressSrc) => {
    const pressFn = eval(pressSrc);
    const stage = document.getElementById("stage")!;
    new MutationObserver(() => {
      const el = stage.querySelector(".st-word, .st-swatch, svg [fill]:not([fill='#fff'])") as HTMLElement | null;
      if (!el) return;
      const cs = getComputedStyle(el);
      const ink = el.classList.contains("st-word") ? cs.color : el.classList.contains("st-swatch") ? cs.backgroundColor : cs.fill;
      const norm = (v: string) => v.replace(/\s/g, "");
      const btn = [...document.querySelectorAll("#answers button")].find((b) =>
        norm(getComputedStyle(b.querySelector(".st-dot")!).backgroundColor) === norm(ink));
      if (btn) setTimeout(() => pressFn(btn), 5);
    }).observe(stage, { childList: true, subtree: true });
  }, press);
  await page.getByRole("button", { name: "색 이름부터 확인하기" }).click();
  await clickThrough(page, "계속하기", 3);
  await expect(page.getByRole("heading", { name: "끝까지 해냈어요!" })).toBeVisible({ timeout: 40_000 });
  const rows = await csvRows(page);
  expect(rows).toHaveLength(8 + 12 + 48);
  expect(rows.every((r) => r.correct === "1")).toBe(true);
  await expect(page.locator("#pro-table tbody tr")).toHaveCount(6);
  await expect(page.locator("#pro-meta")).toContainText("간섭효과");
  await expect(page.locator("#color-warn")).toBeHidden();
  expect(errors).toEqual([]);
});

test("Corsi: perfect forward recall climbs to span 9 and records every trial", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/apps/ef/corsi.html?timing=fast");
  // 켜진 순서를 기록했다가, 보드가 열리면 같은 순서로 누른다
  await page.evaluate((pressSrc) => {
    const pressFn = eval(pressSrc);
    const board = document.getElementById("board")!;
    let seq: number[] = [];
    new MutationObserver((muts) => {
      for (const m of muts) {
        const el = m.target as HTMLElement;
        if (m.attributeName === "data-lit" && el.dataset.lit === "true") seq.push(Number(el.dataset.i));
        if (m.attributeName === "data-locked" && el === board && board.dataset.locked === "false") {
          const order = seq; seq = [];
          order.forEach((i, k) => setTimeout(() => pressFn(board.children[i]), 10 + k * 10));
        }
      }
    }).observe(board, { attributes: true, subtree: true, attributeFilter: ["data-lit", "data-locked"] });
  }, press);
  await page.getByRole("button", { name: "연습 시작" }).click();
  await clickThrough(page, "시작하기", 1);
  await expect(page.getByRole("heading", { name: "끝까지 해냈어요!" })).toBeVisible({ timeout: 60_000 });
  const rows = await csvRows(page);
  // 연습 2 + 길이 2~8은 2시행씩 + 길이 9는 2시행(최대 길이)
  expect(rows).toHaveLength(2 + 8 * 2);
  expect(rows.every((r) => r.correct === "1")).toBe(true);
  await expect(page.locator("#pro-meta")).toContainText("최대 스팬 9");
  expect(errors).toEqual([]);
});

test("Card Sort: passes DCCS and border stages, then finds hidden rules by feedback", async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/apps/ef/cardsort.html?timing=fast");
  await page.evaluate((pressSrc) => {
    const pressFn = eval(pressSrc);
    const parse = (s: string) => {
      const m = s.match(/(빨강|초록|노랑|파랑) (동그라미|세모|네모|별) (\d)개(, 테두리 있음)?/)!;
      return { color: m[1], shape: m[2], count: m[3], border: Boolean(m[4]) };
    };
    const dims = ["color", "shape", "count"] as const;
    let guess = 0;
    const fb = document.getElementById("feedback")!;
    new MutationObserver(() => { if (fb.textContent === "아니에요") guess = (guess + 1) % 3; })
      .observe(fb, { childList: true, characterData: true, subtree: true });
    const test = document.getElementById("test")!;
    new MutationObserver(() => {
      const label = test.getAttribute("aria-label");
      if (!label) return;
      const card = parse(label);
      const ruleText = document.getElementById("rule")!.textContent || "";
      let dim: (typeof dims)[number];
      if (ruleText.startsWith("색이")) dim = "color";
      else if (ruleText.startsWith("모양이")) dim = "shape";
      else if (ruleText.startsWith("테두리")) dim = card.border ? "shape" : "color";
      else dim = dims[guess];
      const refs = [...document.querySelectorAll("#refs button")];
      const btn = refs.find((b) => parse(b.getAttribute("aria-label")!)[dim] === card[dim]) ?? refs[0];
      setTimeout(() => pressFn(btn), 5);
    }).observe(test, { attributes: true, attributeFilter: ["aria-label"] });
  }, press);
  await page.getByRole("button", { name: "시작하기" }).click();
  await clickThrough(page, "시작하기", 4); // 1단계 시작, 모양 놀이, 2단계, 3단계
  await expect(page.getByRole("heading", { name: "끝까지 해냈어요!" })).toBeVisible({ timeout: 90_000 });
  const rows = await csvRows(page);
  const stage = (n: string) => rows.filter((r) => r.stage === n);
  expect(stage("1")).toHaveLength(12);
  expect(stage("2")).toHaveLength(12);
  expect([...stage("1"), ...stage("2")].filter((r) => r.correct !== "1")).toEqual([]);
  const table = page.locator("#pro-table tbody tr");
  await expect(table).toHaveCount(3);
  await expect(table.nth(0)).toContainText("6/6 (통과)");
  await expect(table.nth(1)).toContainText("12/12 (통과)");
  // 규칙을 맞히고 10회 연속 정답이면 범주가 넘어간다 — 반응기는 틀릴 때마다 차원을 바꿔 최소 1범주는 완료한다
  await expect(page.locator("#pro-meta")).toContainText(/완료 범주 [1-6]/);
  expect(errors).toEqual([]);
});

test("Hearts and Flowers: four blocks with practice, switch cost in mixed blocks", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/apps/ef/hearts-flowers.html?timing=fast");
  await page.evaluate((pressSrc) => {
    const pressFn = eval(pressSrc);
    const field = document.getElementById("field")!;
    new MutationObserver(() => {
      for (const side of ["left", "right"]) {
        const svg = document.querySelector(`#box-${side} svg`);
        if (!svg) continue;
        const isHeart = Boolean(svg.querySelector("path[fill='#d1242f']"));
        const answer = isHeart ? side : side === "left" ? "right" : "left";
        setTimeout(() => pressFn(document.getElementById(`key-${answer}`)), 5);
      }
    }).observe(field, { childList: true, subtree: true });
  }, press);
  await page.getByRole("button", { name: "시작하기" }).click();
  await clickThrough(page, "시작하기", 4);
  await expect(page.getByRole("heading", { name: "끝까지 해냈어요!" })).toBeVisible({ timeout: 60_000 });
  const rows = await csvRows(page);
  expect(rows).toHaveLength(4 + 12 + 4 + 12 + 20 + 20);
  expect(rows.every((r) => r.correct === "1")).toBe(true);
  const table = page.locator("#pro-table tbody tr");
  await expect(table).toHaveCount(4);
  await expect(table.nth(2).locator("td").nth(5)).toHaveText(/-?\d+ms|–/);
  expect(errors).toEqual([]);
});

/*
 * 도구 상세 페이지의 실제 틀 크기에서 과제를 쓸 수 있는지:
 * 시작 버튼이 스크롤 없이 보이고, 과제 화면에서 자극·반응 버튼·그만하기가 모두 화면 안에 있어야 한다.
 * (데스크톱 1440 폭에서 틀은 약 610×381, 세로 iPad 768×479, iPhone 348×542)
 */
const FRAMES = [[610, 381], [768, 479], [348, 542]] as const;
const LAYOUTS = [
  { page: "nback", brk: false, keys: ["#stage", "#respond", "#quit"] },
  { page: "stroop", brk: false, keys: ["#stage", "#answers", "#quit"] },
  { page: "corsi", brk: false, keys: ["#board", "#prompt", "#quit"] },
  { page: "cardsort", brk: true, keys: ["#refs", "#test", "#quit"] },
  { page: "hearts-flowers", brk: true, keys: ["#field", ".hf-keys", "#quit"] },
];
for (const [w, h] of FRAMES) {
  test(`all five tasks fit an embedded ${w}x${h} frame without scrolling`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    for (const t of LAYOUTS) {
      await page.goto(`/apps/ef/${t.page}.html`);
      await expect(page.locator("#start")).toBeInViewport({ ratio: 1 });
      await page.locator("#start").click();
      if (t.brk) {
        await expect(page.locator("#next")).toBeInViewport({ ratio: 1 });
        await page.locator("#next").click();
      }
      await expect(page.locator("#task")).toBeVisible();
      for (const k of t.keys) await expect(page.locator(k), `${t.page} ${k}`).toBeInViewport({ ratio: 1 });
    }
  });
}
