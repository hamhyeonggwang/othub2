import { expect, test, type Page } from "@playwright/test";

/*
 * 실행기능 과제의 '훈련 단계'가 설계서 4장대로 진행되는지 — 완벽한 수행만이 아니라
 * 실패·고집(보속)·시간 초과 같은 실제 수행 양상에서 단계가 오르고, 내려가고, 멈추는지 확인한다.
 * 모두 도구 페이지의 실제 틀 크기(610×381)에서 ?timing=fast로 돌린다.
 */

test.use({ viewport: { width: 610, height: 381 } });

const PRESS = `(el) => el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerType: "touch" }))`;

/** 쉬는 화면이 뜰 때마다 계속 버튼을 누르고, 결과 화면이 나올 때까지 기다린다 */
async function runToSummary(page: Page, timeout = 90_000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await page.locator("#summary").isVisible()) return;
    if (await page.locator("#break").isVisible()) await page.locator("#next").click().catch(() => {});
    await page.waitForTimeout(50);
  }
  throw new Error("결과 화면에 도달하지 못함");
}

async function proRows(page: Page) {
  await page.locator("#pro-toggle").click();
  return page.$$eval("#pro-table tbody tr", (trs) => trs.map((t) => [...t.querySelectorAll("td")].map((td) => td.textContent?.trim() ?? "")));
}

test.describe("N-back 단계 조정 (블록 정확도 80% 이상 +1, 50% 미만 −1, 0~3)", () => {
  test("완벽하게 수행하면 1 → 2 → 3단계로 오른다", async ({ page }) => {
    await page.goto("/apps/ef/nback.html?timing=fast");
    await page.getByRole("button", { name: /1단계/ }).click();
    // 지금 블록의 단계(n)를 제목에서 읽고, n개 전 글자와 같을 때만 누른다
    await page.evaluate((src) => {
      const press = eval(src);
      const stage = document.getElementById("stage")!;
      let hist: string[] = [];
      let title = "";
      new MutationObserver(() => {
        const t = document.getElementById("task-title")!.textContent || "";
        if (t !== title) { title = t; hist = []; }
        const cur = stage.textContent?.trim();
        if (!cur) return;
        const n = Number(t.match(/(\d)단계/)?.[1] ?? 0);
        hist.push(cur);
        const target = n === 0 ? cur === "가" : hist.length > n && hist[hist.length - 1 - n] === cur;
        if (target) press(document.getElementById("respond"));
      }).observe(stage, { childList: true, subtree: true, characterData: true });
    }, PRESS);
    await page.locator("#start").click();
    await runToSummary(page);
    const rows = await proRows(page);
    expect(rows.map((r) => r[1])).toEqual(["1", "1", "2", "3"]); // 연습, 1·2·3번째 블록의 단계
    expect(rows.slice(1).every((r) => r[6] === "100%")).toBe(true);
  });

  test("계속 누르기만 하면(오경보) 2 → 1 → 0단계로 내려간다", async ({ page }) => {
    await page.goto("/apps/ef/nback.html?timing=fast");
    await page.getByRole("button", { name: /2단계/ }).click();
    await page.evaluate((src) => {
      const press = eval(src);
      const stage = document.getElementById("stage")!;
      new MutationObserver(() => { if (stage.textContent?.trim()) press(document.getElementById("respond")); })
        .observe(stage, { childList: true, subtree: true, characterData: true });
    }, PRESS);
    await page.locator("#start").click();
    await runToSummary(page);
    const rows = await proRows(page);
    expect(rows.map((r) => r[1])).toEqual(["2", "2", "1", "0"]);
    expect(Number(rows[1][4])).toBeGreaterThan(0); // 잘못 누름(오경보)이 기록됨
  });
});

test("Stroop: 시간 초과와 오답이 조건별로 기록되고 판정 문구가 없다", async ({ page }) => {
  await page.goto("/apps/ef/stroop.html?timing=fast");
  // 색 이름 확인은 정답, 본 과제에서는 짝수 번째 시행은 첫 버튼(대체로 오답), 홀수 번째는 누르지 않음(시간 초과)
  await page.evaluate((src) => {
    const press = eval(src);
    const stage = document.getElementById("stage")!;
    let k = 0;
    new MutationObserver(() => {
      const sw = stage.querySelector(".st-swatch") as HTMLElement | null;
      const word = stage.querySelector(".st-word");
      const buttons = [...document.querySelectorAll("#answers button")];
      if (sw) {
        const ink = getComputedStyle(sw).backgroundColor;
        const b = buttons.find((x) => getComputedStyle(x.querySelector(".st-dot")!).backgroundColor === ink);
        setTimeout(() => press(b), 5);
      } else if (word && k++ % 2 === 0) setTimeout(() => press(buttons[0]), 5);
    }).observe(stage, { childList: true, subtree: true });
  }, PRESS);
  await page.locator("#start").click();
  await runToSummary(page);
  const rows = await proRows(page);
  const test3 = rows.filter((r) => r[0] === "본 과제");
  expect(test3.map((r) => r[1])).toEqual(["일치", "불일치", "중립"]);
  expect(test3.reduce((s, r) => s + Number(r[5]), 0)).toBe(24); // 48시행 중 절반 시간 초과
  await expect(page.locator("#pro")).not.toContainText(/정상입니다|저하/);
});

test.describe("Corsi 길이 진행 (같은 길이 2시행 중 1번 이상 맞으면 +1, 2번 다 틀리면 종료)", () => {
  async function plant(page: Page, failFrom: number, backward: boolean) {
    await page.evaluate(({ src, failFrom, backward }) => {
      const press = eval(src);
      const board = document.getElementById("board")!;
      let seq: number[] = [];
      new MutationObserver((muts) => {
        for (const m of muts) {
          const el = m.target as HTMLElement;
          if (m.attributeName === "data-lit" && el.dataset.lit === "true") seq.push(Number(el.dataset.i));
          if (m.attributeName === "data-locked" && el === board && board.dataset.locked === "false") {
            let order = backward ? seq.slice().reverse() : seq.slice();
            // 이 길이부터는 첫 두 개 순서를 바꿔 틀린다
            if (order.length >= failFrom) [order[0], order[1]] = [order[1], order[0]];
            seq = [];
            order.forEach((i, k) => setTimeout(() => press(board.children[i]), 10 + k * 10));
          }
        }
      }).observe(board, { attributes: true, subtree: true, attributeFilter: ["data-lit", "data-locked"] });
    }, { src: PRESS, failFrom, backward });
  }

  test("정순: 4개에서 두 번 다 틀리면 멈추고 최대 스팬은 3", async ({ page }) => {
    await page.goto("/apps/ef/corsi.html?timing=fast");
    await plant(page, 4, false);
    await page.locator("#start").click();
    await runToSummary(page);
    const rows = await proRows(page);
    expect(rows.map((r) => r[0])).toEqual(["2", "3", "4"]);
    expect(rows[2][2]).toBe("0");
    await expect(page.locator("#pro-meta")).toContainText("최대 스팬 3");
    await expect(page.locator("#pro-meta")).toContainText("총점(스팬×정답 시행) 12"); // 3 × 정답 4시행
    await expect(page.locator("#pro-table")).toContainText("×(1번째)");
  });

  test("역순: 거꾸로 누르면 정답으로 채점된다", async ({ page }) => {
    await page.goto("/apps/ef/corsi.html?timing=fast");
    await page.getByRole("button", { name: /거꾸로/ }).click();
    await plant(page, 5, true);
    await page.locator("#start").click();
    await runToSummary(page);
    await expect(page.locator("#pro-meta")).toContainText("최대 스팬 4");
    await expect(page.locator("#pro-meta")).toContainText("방향 역순");
  });
});

test.describe("Card Sort 단계 (1단계 5/6 · 2단계 9/12 통과해야 다음 단계)", () => {
  test("1단계에서 규칙이 바뀌어도 색으로만 고르면 미통과로 끝난다", async ({ page }) => {
    await page.goto("/apps/ef/cardsort.html?timing=fast");
    await page.evaluate((src) => {
      const press = eval(src);
      const test = document.getElementById("test")!;
      new MutationObserver(() => {
        const label = test.getAttribute("aria-label") || "";
        const color = label.match(/(빨강|파랑)/)?.[1];
        const btn = [...document.querySelectorAll("#refs button")].find((b) => b.getAttribute("aria-label")!.includes(color!));
        setTimeout(() => press(btn), 5);
      }).observe(test, { attributes: true, attributeFilter: ["aria-label"] });
    }, PRESS);
    await page.locator("#start").click();
    await runToSummary(page);
    const rows = await proRows(page);
    expect(rows).toHaveLength(1);
    expect(rows[0][1]).toBe("0/6 (미통과)");
  });

  test("3단계: 틀리면 차원을 바꾸는 수행으로 여러 범주를 완료하고, 규칙 전환 직후 보속 오류가 기록된다", async ({ page }) => {
    await page.goto("/apps/ef/cardsort.html?timing=fast");
    await page.getByRole("button", { name: /규칙 찾기만/ }).click();
    await page.evaluate((src) => {
      const press = eval(src);
      const parse = (s: string) => {
        const m = s.match(/(빨강|초록|노랑|파랑) (동그라미|세모|네모|별) (\d)개/)!;
        return { color: m[1], shape: m[2], count: m[3] } as Record<string, string>;
      };
      const dims = ["color", "shape", "count"];
      let guess = 0;
      const fb = document.getElementById("feedback")!;
      new MutationObserver(() => { if (fb.textContent === "아니에요") guess = (guess + 1) % 3; })
        .observe(fb, { childList: true, characterData: true, subtree: true });
      const test = document.getElementById("test")!;
      new MutationObserver(() => {
        const label = test.getAttribute("aria-label");
        if (!label) return;
        const card = parse(label);
        const refs = [...document.querySelectorAll("#refs button")];
        const btn = refs.find((b) => parse(b.getAttribute("aria-label")!)[dims[guess]] === card[dims[guess]]) ?? refs[0];
        setTimeout(() => press(btn), 5);
      }).observe(test, { attributes: true, attributeFilter: ["aria-label"] });
    }, PRESS);
    await page.locator("#start").click();
    await runToSummary(page);
    const meta = await page.locator("#pro-meta").innerText();
    const cats = Number(meta.match(/완료 범주 (\d)/)![1]);
    const persev = Number(meta.match(/보속 오류 (\d+)/)![1]);
    const toFirst = Number(meta.match(/첫 범주까지 (\d+)시행/)![1]);
    expect(cats).toBeGreaterThanOrEqual(3);
    expect(persev).toBeGreaterThanOrEqual(cats - 1); // 규칙이 바뀔 때마다 옛 규칙으로 한 번은 고른다
    expect(toFirst).toBeGreaterThanOrEqual(10);
  });
});

test("하트와 꽃: 꽃에서 같은 쪽을 누르면 꽃 판 정확도가 0%이고, 혼합 판에는 전환 비용이 계산된다", async ({ page }) => {
  await page.goto("/apps/ef/hearts-flowers.html?timing=fast");
  // '꽃만' 판에서는 같은 쪽(오답), 나머지는 규칙대로
  await page.evaluate((src) => {
    const press = eval(src);
    const field = document.getElementById("field")!;
    new MutationObserver(() => {
      const title = document.getElementById("task-title")!.textContent || "";
      for (const side of ["left", "right"]) {
        const svg = document.querySelector(`#box-${side} svg`);
        if (!svg) continue;
        const heart = Boolean(svg.querySelector("path[fill='#d1242f']"));
        const wrongOnFlowers = title.startsWith("꽃만") && !title.includes("연습");
        const ans = heart || wrongOnFlowers ? side : side === "left" ? "right" : "left";
        setTimeout(() => press(document.getElementById(`key-${ans}`)), 5);
      }
    }).observe(field, { childList: true, subtree: true });
  }, PRESS);
  await page.locator("#start").click();
  await runToSummary(page);
  const rows = await proRows(page);
  expect(rows.map((r) => r[0])).toEqual(["하트만", "꽃만", "섞어서 1", "섞어서 2 (빠르게)"]);
  expect(rows[0][2]).toBe("100%");
  expect(rows[1][2]).toBe("0%");
  expect(rows[2][5]).toMatch(/^-?\d+ms$/);
  expect(rows[3][5]).toMatch(/^-?\d+ms$/);
});
