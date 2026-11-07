import { describe, expect, it } from "vitest";
// @ts-expect-error 브라우저용 ES module(타입 선언 없음)을 그대로 검증한다
import * as engine from "../../public/apps/ef/engine.js";

const {
  createRng, nbackSequence, inverseNormal, signalDetection, nextLevel, mean, toCSV,
  shuffle, stroopTrials, corsiSequence, corsiCheck, corsiNext, matchDims, scoreSort,
  heartsFlowersAnswer, heartsFlowersTrials,
} = engine;

describe("실행기능 엔진: 시드 난수", () => {
  it("같은 시드는 같은 순서를 만든다", () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it("0 이상 1 미만 값만 낸다", () => {
    const r = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("실행기능 엔진: N-back 자극 순서", () => {
  for (const n of [0, 1, 2, 3]) {
    it(`${n}-back: 표적 수가 채점 시행의 30%이고, 표적 정의를 지킨다`, () => {
      for (let seed = 1; seed <= 50; seed++) {
        const length = 20 + n;
        const seq = nbackSequence({ n, length, targetRate: 0.3, symbols: 8, targetSymbol: 0, rng: createRng(seed) });
        expect(seq).toHaveLength(length);
        expect(seq.filter((t: { isTarget: boolean }) => t.isTarget)).toHaveLength(Math.round(20 * 0.3));
        seq.forEach((t: { stim: number; isTarget: boolean; scored: boolean }, i: number) => {
          expect(t.scored).toBe(i >= n);
          if (i < n) expect(t.isTarget).toBe(false);
          // 표적 정의가 실제 자극과 맞는지(우연한 표적이 없는지) 확인
          const actual = n === 0 ? t.stim === 0 : i >= n && t.stim === seq[i - n].stim;
          if (t.scored) expect(t.isTarget).toBe(actual);
        });
      }
    });
  }
});

describe("실행기능 엔진: 신호탐지", () => {
  it("역정규함수가 알려진 값과 맞다", () => {
    expect(inverseNormal(0.5)).toBeCloseTo(0, 9);
    expect(inverseNormal(0.975)).toBeCloseTo(1.959964, 5);
    expect(inverseNormal(0.01)).toBeCloseTo(-2.326348, 5);
  });
  it("완벽한 수행도 무한대가 아닌 d′를 낸다 (log-linear 보정)", () => {
    const { hitRate, faRate, dprime } = signalDetection({ hits: 6, misses: 0, falseAlarms: 0, correctRejections: 14 });
    expect(hitRate).toBeCloseTo(6.5 / 7, 10);
    expect(faRate).toBeCloseTo(0.5 / 15, 10);
    expect(Number.isFinite(dprime)).toBe(true);
    expect(dprime).toBeGreaterThan(2);
  });
  it("무작위로 누르면 d′는 0 근처다", () => {
    expect(signalDetection({ hits: 3, misses: 3, falseAlarms: 7, correctRejections: 7 }).dprime).toBeCloseTo(0, 6);
  });
});

describe("실행기능 엔진: 레벨 조정과 집계", () => {
  it("80% 이상 오르고, 50% 미만 내려가고, 범위를 벗어나지 않는다", () => {
    expect(nextLevel(1, 0.8)).toBe(2);
    expect(nextLevel(1, 0.79)).toBe(1);
    expect(nextLevel(1, 0.5)).toBe(1);
    expect(nextLevel(1, 0.49)).toBe(0);
    expect(nextLevel(3, 1)).toBe(3);
    expect(nextLevel(0, 0)).toBe(0);
  });
  it("평균은 빈 배열에서 null", () => {
    expect(mean([])).toBeNull();
    expect(mean([100, 200])).toBe(150);
  });
  it("CSV는 쉼표·따옴표·줄바꿈을 감싼다", () => {
    const csv = toCSV([{ a: 1, b: 'x,"y"', c: null }, { a: 2, b: "줄\n바꿈", c: "" }]);
    expect(csv).toBe('a,b,c\r\n1,"x,""y""",\r\n2,"줄\n바꿈",');
  });
});

describe("실행기능 엔진: Stroop", () => {
  it("조건별 개수를 정확히 맞추고, 일치·불일치·중립 정의를 지킨다", () => {
    for (let seed = 1; seed <= 30; seed++) {
      const list = stroopTrials({ counts: { congruent: 8, incongruent: 8, neutral: 8 }, colors: 4, rng: createRng(seed) });
      expect(list).toHaveLength(24);
      for (const t of list) {
        if (t.condition === "congruent") expect(t.meaning).toBe(t.ink);
        if (t.condition === "incongruent") { expect(t.meaning).not.toBe(t.ink); expect(t.meaning).toBeGreaterThanOrEqual(0); expect(t.meaning).toBeLessThan(4); }
        if (t.condition === "neutral") expect(t.meaning).toBeNull();
      }
      expect(list.filter((t: { condition: string }) => t.condition === "incongruent")).toHaveLength(8);
    }
  });
  it("같은 잉크색이 4번 연속 나오지 않는다", () => {
    for (let seed = 1; seed <= 30; seed++) {
      const list = stroopTrials({ counts: { congruent: 8, incongruent: 8, neutral: 8 }, colors: 4, rng: createRng(seed) });
      for (let i = 3; i < list.length; i++) {
        expect(list[i].ink === list[i - 1].ink && list[i].ink === list[i - 2].ink && list[i].ink === list[i - 3].ink).toBe(false);
      }
    }
  });
  it("섞기는 원소를 잃지 않는다", () => {
    expect(shuffle(createRng(3), [1, 2, 3, 4, 5]).sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("실행기능 엔진: Corsi", () => {
  it("점등 순서는 서로 다른 블록이다", () => {
    for (let len = 2; len <= 9; len++) {
      const seq = corsiSequence(createRng(len), len);
      expect(new Set(seq).size).toBe(len);
      seq.forEach((b: number) => { expect(b).toBeGreaterThanOrEqual(0); expect(b).toBeLessThan(9); });
    }
  });
  it("정순·역순 채점과 처음 틀린 위치", () => {
    expect(corsiCheck([3, 1, 7], [3, 1, 7])).toEqual({ correct: true, firstError: -1 });
    expect(corsiCheck([3, 1, 7], [7, 1, 3], true)).toEqual({ correct: true, firstError: -1 });
    expect(corsiCheck([3, 1, 7], [3, 7, 1])).toEqual({ correct: false, firstError: 1 });
    expect(corsiCheck([3, 1, 7], [3, 1, 7], true).correct).toBe(false);
  });
  it("길이 진행: 2번 중 1번 맞으면 +1, 2번 다 틀리면 끝, 최대 길이에서 끝", () => {
    expect(corsiNext(2, [false])).toEqual({ length: 2, done: false });
    expect(corsiNext(2, [false, true])).toEqual({ length: 3, done: false });
    expect(corsiNext(2, [true, false])).toEqual({ length: 3, done: false });
    expect(corsiNext(4, [false, false])).toEqual({ length: 4, done: true });
    expect(corsiNext(9, [true, true])).toEqual({ length: 9, done: true });
  });
});

describe("실행기능 엔진: 카드 분류", () => {
  const card = { color: "blue", shape: "star", count: 2 };
  it("같은 차원을 찾는다", () => {
    expect(matchDims(card, { color: "blue", shape: "circle", count: 2 })).toEqual(["color", "count"]);
    expect(matchDims(card, { color: "red", shape: "circle", count: 1 })).toEqual([]);
  });
  it("정답과 보속 오류(직전 규칙으로는 맞는 오류)", () => {
    const byShape = { color: "red", shape: "star", count: 1 };
    expect(scoreSort(card, byShape, "shape", "color")).toMatchObject({ correct: true, perseverative: false });
    // 규칙이 모양으로 바뀌었는데 여전히 색으로 고름 → 보속 오류
    expect(scoreSort(card, { color: "blue", shape: "circle", count: 1 }, "shape", "color")).toMatchObject({ correct: false, perseverative: true });
    // 직전 규칙과도 무관한 오류 → 보속 아님
    expect(scoreSort(card, { color: "red", shape: "circle", count: 2 }, "shape", "color")).toMatchObject({ correct: false, perseverative: false });
    // 첫 범주에는 직전 규칙이 없다
    expect(scoreSort(card, { color: "red", shape: "circle", count: 1 }, "color", null).perseverative).toBe(false);
  });
});

describe("실행기능 엔진: 하트와 꽃", () => {
  it("하트는 같은 쪽, 꽃은 반대쪽", () => {
    expect(heartsFlowersAnswer("heart", "left")).toBe("left");
    expect(heartsFlowersAnswer("heart", "right")).toBe("right");
    expect(heartsFlowersAnswer("flower", "left")).toBe("right");
    expect(heartsFlowersAnswer("flower", "right")).toBe("left");
  });
  it("단독 블록은 한 종류만, 혼합 블록은 전환/반복을 표시한다", () => {
    const hearts = heartsFlowersTrials("heart", 12, createRng(1));
    expect(hearts.every((t: { type: string; transition: null }) => t.type === "heart" && t.transition === null)).toBe(true);
    const mixed = heartsFlowersTrials("mixed", 20, createRng(2));
    expect(mixed[0].transition).toBeNull();
    mixed.slice(1).forEach((t: { type: string; transition: string }, i: number) => {
      expect(t.transition).toBe(t.type === mixed[i].type ? "repeat" : "switch");
    });
    mixed.forEach((t: { type: string; side: string; answer: string }) => expect(t.answer).toBe(heartsFlowersAnswer(t.type, t.side)));
  });
});
