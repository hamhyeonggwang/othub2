/**
 * 실행기능 과제 결과 저장 요청 검증.
 * 저장은 인증 치료사만 하고(라우트·RLS에서 확인), 여기서는 형식과 크기만 본다.
 * 대상자 코드는 이름·생년월일이 들어가지 않도록 영문·숫자·-·_ 20자로 제한한다.
 */

export const EF_TASKS = ["nback", "stroop", "corsi", "cardsort", "hearts_flowers"] as const;
export type EfTask = (typeof EF_TASKS)[number];

export const EF_TASK_LABEL: Record<EfTask, string> = {
  nback: "같은 것 찾기 (N-back)",
  stroop: "색깔 맞히기 (Stroop)",
  corsi: "불빛 순서 기억하기 (Corsi)",
  cardsort: "카드 나누기 (Card Sort)",
  hearts_flowers: "하트와 꽃",
};

export const SUBJECT_CODE_PATTERN = /^[A-Za-z0-9_-]{1,20}$/;
export const MAX_TRIALS = 500;
const MAX_SUMMARY_BYTES = 20_000;
const MAX_TRIALS_BYTES = 400_000;
/** 시행 기록에서 빼는 열: 기기 정보는 세션에 한 번만 저장한다 */
const DEVICE_KEYS = new Set(["user_agent", "screen", "refresh_hz", "touch"]);

export interface EfSaveInput {
  subjectCode: string;
  task: EfTask;
  summary: Record<string, unknown>;
  device: { screen?: string; refresh_hz?: number | null; touch?: boolean; user_agent?: string };
  trials: Record<string, string | number | boolean | null>[];
  startedAt: string;
}

type Result = { ok: true; value: EfSaveInput } | { ok: false; error: string };

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isPrimitive = (v: unknown) => v === null || ["string", "number", "boolean"].includes(typeof v);

export function validateEfSave(body: unknown, now = Date.now()): Result {
  if (!isPlainObject(body)) return { ok: false, error: "요청 형식이 올바르지 않습니다." };
  const subjectCode = typeof body.subjectCode === "string" ? body.subjectCode.trim() : "";
  if (!SUBJECT_CODE_PATTERN.test(subjectCode)) {
    return { ok: false, error: "대상자 코드는 영문·숫자·-·_ 1~20자로 입력해 주세요. 이름은 넣지 마세요." };
  }
  const task = body.task;
  if (typeof task !== "string" || !(EF_TASKS as readonly string[]).includes(task)) {
    return { ok: false, error: "알 수 없는 과제입니다." };
  }
  if (!isPlainObject(body.summary) || JSON.stringify(body.summary).length > MAX_SUMMARY_BYTES) {
    return { ok: false, error: "결과 요약 형식이 올바르지 않습니다." };
  }
  if (!Array.isArray(body.trials) || body.trials.length === 0 || body.trials.length > MAX_TRIALS) {
    return { ok: false, error: `시행 기록은 1~${MAX_TRIALS}개여야 합니다.` };
  }
  const trials: EfSaveInput["trials"] = [];
  for (const row of body.trials) {
    if (!isPlainObject(row)) return { ok: false, error: "시행 기록 형식이 올바르지 않습니다." };
    const clean: Record<string, string | number | boolean | null> = {};
    for (const [k, v] of Object.entries(row)) {
      if (DEVICE_KEYS.has(k)) continue;
      if (!isPrimitive(v) || k.length > 40) return { ok: false, error: "시행 기록 형식이 올바르지 않습니다." };
      clean[k] = typeof v === "string" ? v.slice(0, 200) : (v as number | boolean | null);
    }
    trials.push(clean);
  }
  if (JSON.stringify(trials).length > MAX_TRIALS_BYTES) return { ok: false, error: "시행 기록이 너무 큽니다." };
  const started = typeof body.startedAt === "string" ? Date.parse(body.startedAt) : NaN;
  // 미래 시각이나 1년 넘은 시각은 받지 않는다 (기기 시계 오차 10분 허용)
  if (!Number.isFinite(started) || started > now + 10 * 60_000 || started < now - 365 * 86_400_000) {
    return { ok: false, error: "과제 시작 시각이 올바르지 않습니다." };
  }
  const d = isPlainObject(body.device) ? body.device : {};
  const device: EfSaveInput["device"] = {
    screen: typeof d.screen === "string" ? d.screen.slice(0, 40) : undefined,
    refresh_hz: typeof d.refresh_hz === "number" ? d.refresh_hz : null,
    touch: typeof d.touch === "boolean" ? d.touch : undefined,
    user_agent: typeof d.user_agent === "string" ? d.user_agent.slice(0, 300) : undefined,
  };
  return {
    ok: true,
    value: { subjectCode, task: task as EfTask, summary: body.summary, device, trials, startedAt: new Date(started).toISOString() },
  };
}

/** 추이 그래프에 쓰는 과제별 대표 지표 (요약에서 꺼냄, 없으면 null) */
export const EF_TREND_METRIC: Record<EfTask, { label: string; unit: string; pick: (s: Record<string, unknown>) => number | null }> = {
  nback: { label: "본 과제 최고 단계(n)", unit: "", pick: (s) => num(s.highestLevel) },
  stroop: { label: "간섭효과 (불일치 − 일치 RT)", unit: "ms", pick: (s) => num(s.interferenceMs) },
  corsi: { label: "최대 스팬", unit: "", pick: (s) => num(s.span) },
  cardsort: { label: "규칙 찾기 완료 범주", unit: "", pick: (s) => num(s.categories) },
  hearts_flowers: { label: "섞어서 판 정확도", unit: "%", pick: (s) => (num(s.mixedAccuracy) === null ? null : Math.round((s.mixedAccuracy as number) * 100)) },
};

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
