import { describe, expect, it } from "vitest";
// @ts-expect-error 브라우저용 ES module(타입 선언 없음)을 그대로 검증한다
import * as engine from "../../public/apps/ef/engine.js";

const { createRng, nbackSequence, inverseNormal, signalDetection, nextLevel, mean, toCSV } = engine;

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
