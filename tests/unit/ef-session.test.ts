import { describe, expect, it } from "vitest";
import { EF_TREND_METRIC, validateEfSave } from "@/lib/ef-session";

const NOW = Date.parse("2026-11-07T03:00:00Z");
const base = {
  subjectCode: "C-012",
  task: "nback",
  summary: { highestLevel: 2 },
  device: { screen: "1280x720@2", refresh_hz: 60, touch: true, user_agent: "UA" },
  trials: [{ trial: 1, correct: 1, rt_ms: 420, stimulus: "가", user_agent: "UA", screen: "x" }],
  startedAt: "2026-11-07T02:50:00Z",
};

describe("실행기능 과제 저장 요청 검증", () => {
  it("올바른 요청을 받고, 시행 기록에서 기기 정보 열은 뺀다", () => {
    const r = validateEfSave(base, NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.trials[0]).toEqual({ trial: 1, correct: 1, rt_ms: 420, stimulus: "가" });
    expect(r.value.device).toEqual({ screen: "1280x720@2", refresh_hz: 60, touch: true, user_agent: "UA" });
  });

  it.each(["홍길동", "C 012", "", "A".repeat(21), "c@1"])("이름·공백·특수문자가 든 대상자 코드 %j 는 거절한다", (code) => {
    const r = validateEfSave({ ...base, subjectCode: code }, NOW);
    expect(r.ok).toBe(false);
  });

  it("모르는 과제, 빈 시행, 500개 넘는 시행, 중첩 값은 거절한다", () => {
    expect(validateEfSave({ ...base, task: "wcst64" }, NOW).ok).toBe(false);
    expect(validateEfSave({ ...base, trials: [] }, NOW).ok).toBe(false);
    expect(validateEfSave({ ...base, trials: Array.from({ length: 501 }, () => ({ a: 1 })) }, NOW).ok).toBe(false);
    expect(validateEfSave({ ...base, trials: [{ nested: { x: 1 } }] }, NOW).ok).toBe(false);
    expect(validateEfSave({ ...base, summary: [] }, NOW).ok).toBe(false);
  });

  it("미래 시각과 1년 넘은 시각은 거절하고, 10분 이내 시계 오차는 허용한다", () => {
    expect(validateEfSave({ ...base, startedAt: "2026-11-07T03:09:00Z" }, NOW).ok).toBe(true);
    expect(validateEfSave({ ...base, startedAt: "2026-11-07T03:20:00Z" }, NOW).ok).toBe(false);
    expect(validateEfSave({ ...base, startedAt: "2025-10-01T00:00:00Z" }, NOW).ok).toBe(false);
    expect(validateEfSave({ ...base, startedAt: "어제" }, NOW).ok).toBe(false);
  });

  it("추이 지표는 요약에서 숫자만 꺼낸다", () => {
    expect(EF_TREND_METRIC.nback.pick({ highestLevel: 3 })).toBe(3);
    expect(EF_TREND_METRIC.nback.pick({ highestLevel: null })).toBeNull();
    expect(EF_TREND_METRIC.hearts_flowers.pick({ mixedAccuracy: 0.876 })).toBe(88);
    expect(EF_TREND_METRIC.stroop.pick({})).toBeNull();
  });
});
