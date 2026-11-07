/*
 * OTHub 실행기능 과제 공통 엔진 (ES module)
 *
 * 과제 5종(N-back, Stroop, Card Sort, Corsi, Hearts and Flowers)이 같이 쓰는 부분만 담는다.
 *  - 시드 난수, 신호탐지(d′), 레벨 조정, CSV 만들기: 화면과 무관한 순수 함수 (단위 테스트 대상)
 *  - 자극 제시 시각 기록, 터치 입력, 음성 안내, 기기 정보: 브라우저 전용
 *
 * 원칙
 *  - 결과는 기기 메모리에만 둔다. 서버로 보내지 않는다 (11월 1단계 범위).
 *  - 자극 onset은 requestAnimationFrame 콜백의 타임스탬프(performance.now 기준)로 기록한다.
 *  - 입력은 pointerdown으로 받아 click 지연을 피한다.
 *  - 규준이 없으므로 '정상/저하' 같은 판정 문구를 만들지 않는다.
 */

/* ---------- 순수 함수 ---------- */

/** 시드 고정 난수 (mulberry32). 같은 시드면 같은 자극 순서가 나와 재현할 수 있다. */
export function createRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 0 이상 max 미만 정수 */
export function randInt(rng, max) {
  return Math.floor(rng() * max);
}

/** 배열에서 k개를 겹치지 않게 고른다 */
export function sample(rng, items, k) {
  const pool = items.slice();
  const out = [];
  while (out.length < k && pool.length) out.push(pool.splice(randInt(rng, pool.length), 1)[0]);
  return out;
}

/**
 * N-back 자극 순서.
 * n=0: 지정 표적(targetSymbol)이 나오면 표적.
 * n≥1: 현재 자극이 n개 전과 같으면 표적. 처음 n개 시행은 비교할 대상이 없어 채점하지 않는다.
 * 표적 수는 채점 시행 수 × targetRate를 반올림한 개수로 정확히 맞춘다.
 * 표적이 아닌 시행은 n개 전 자극과 다르게 고른다(우연한 표적 방지).
 */
export function nbackSequence({ n, length, targetRate, symbols, targetSymbol = 0, rng }) {
  const scorable = length - n;
  const targetCount = Math.round(scorable * targetRate);
  const firstScorable = n;
  const positions = new Set(
    sample(rng, Array.from({ length: scorable }, (_, i) => i + firstScorable), targetCount),
  );
  const seq = [];
  for (let i = 0; i < length; i++) {
    const isTarget = positions.has(i);
    let stim;
    if (n === 0) {
      if (isTarget) stim = targetSymbol;
      else {
        do stim = randInt(rng, symbols);
        while (stim === targetSymbol);
      }
    } else if (i < n) {
      stim = randInt(rng, symbols);
    } else if (isTarget) {
      stim = seq[i - n].stim;
    } else {
      do stim = randInt(rng, symbols);
      while (stim === seq[i - n].stim);
    }
    seq.push({ stim, isTarget, scored: i >= n });
  }
  return seq;
}

/**
 * 표준정규분포의 역함수 (Acklam 근사, 상대오차 약 1e-9).
 */
export function inverseNormal(p) {
  if (p <= 0 || p >= 1) throw new RangeError("p must be in (0,1)");
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  if (p < lo) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - lo) return -inverseNormal(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/**
 * 신호탐지 지표. 적중률·오경보율이 0이나 1이 되지 않도록 log-linear 보정(각 칸 +0.5)을 쓴다.
 */
export function signalDetection({ hits, misses, falseAlarms, correctRejections }) {
  const hitRate = (hits + 0.5) / (hits + misses + 1);
  const faRate = (falseAlarms + 0.5) / (falseAlarms + correctRejections + 1);
  return { hitRate, faRate, dprime: inverseNormal(hitRate) - inverseNormal(faRate) };
}

/** 블록 정확도로 다음 레벨을 정한다. 기본: 80% 이상이면 한 단계 위, 50% 미만이면 한 단계 아래. */
export function nextLevel(level, accuracy, { min = 0, max = 3, up = 0.8, down = 0.5 } = {}) {
  if (accuracy >= up) return Math.min(max, level + 1);
  if (accuracy < down) return Math.max(min, level - 1);
  return level;
}

/** 평균 (빈 배열이면 null) */
export function mean(values) {
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : null;
}

/** 행 배열을 CSV 문자열로. 엑셀에서 한글이 깨지지 않도록 BOM을 붙이는 것은 내려받기 쪽에서 한다. */
export function toCSV(rows) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const cell = (v) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
}

/** 배열 섞기 (Fisher–Yates) */
export function shuffle(rng, items) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(rng, i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Stroop 시행 목록. 조건별 개수를 정확히 맞춘다.
 * congruent: 뜻(또는 사물 고유색) = 잉크색 / incongruent: 다름 / neutral: 색과 무관한 자극.
 * 같은 잉크색이 연속 3번 넘게 이어지지 않게 다시 섞는다.
 */
export function stroopTrials({ counts, colors, rng }) {
  const trials = [];
  for (const [condition, k] of Object.entries(counts)) {
    for (let i = 0; i < k; i++) {
      const ink = i % colors;
      let meaning = null;
      if (condition === "congruent") meaning = ink;
      if (condition === "incongruent") meaning = (ink + 1 + randInt(rng, colors - 1)) % colors;
      trials.push({ condition, ink, meaning });
    }
  }
  for (let guard = 0; guard < 200; guard++) {
    const s = shuffle(rng, trials);
    if (s.every((t, i) => i < 3 || !(s[i - 1].ink === t.ink && s[i - 2].ink === t.ink && s[i - 3].ink === t.ink))) return s;
  }
  return shuffle(rng, trials);
}

/** Corsi 점등 순서: 서로 다른 블록 length개 */
export function corsiSequence(rng, length, blocks = 9) {
  return sample(rng, Array.from({ length: blocks }, (_, i) => i), length);
}

/** Corsi 정답 확인. 틀리면 처음 틀린 순서 번호(0부터)를 돌려준다 */
export function corsiCheck(shown, tapped, backward = false) {
  const target = backward ? shown.slice().reverse() : shown;
  const firstError = target.findIndex((b, i) => tapped[i] !== b);
  return { correct: firstError === -1 && tapped.length === target.length, firstError };
}

/**
 * Corsi 길이 진행: 같은 길이 2시행 중 1번 이상 맞으면 +1, 2번 다 틀리면 끝.
 * results: 이번 길이의 정답 여부 목록
 */
export function corsiNext(length, results, maxLength = 9) {
  if (results.length < 2) return { length, done: false };
  if (results.some(Boolean)) return length >= maxLength ? { length, done: true } : { length: length + 1, done: false };
  return { length, done: true };
}

/** 카드 분류: 카드가 기준 카드와 어떤 차원에서 같은지 */
export function matchDims(card, ref) {
  return ["color", "shape", "count"].filter((d) => card[d] === ref[d]);
}

/**
 * 카드 분류 한 번 채점.
 * correct: 지금 규칙 차원으로 같은 카드를 골랐는지
 * perseverative: 틀렸고, 고른 카드가 직전 규칙 차원으로는 같았는지 (단순화한 보속 오류 정의)
 */
export function scoreSort(card, chosenRef, rule, prevRule) {
  const dims = matchDims(card, chosenRef);
  const correct = dims.includes(rule);
  return { correct, perseverative: !correct && prevRule !== null && dims.includes(prevRule), dims };
}

/** Hearts and Flowers 정답 쪽: 하트는 같은 쪽, 꽃은 반대쪽 */
export function heartsFlowersAnswer(type, side) {
  if (type === "heart") return side;
  return side === "left" ? "right" : "left";
}

/** 혼합 블록 시행 목록. 첫 시행 다음부터 전환(switch)/반복(repeat)을 표시한다 */
export function heartsFlowersTrials(kind, n, rng) {
  const trials = [];
  for (let i = 0; i < n; i++) {
    const type = kind === "mixed" ? (rng() < 0.5 ? "heart" : "flower") : kind;
    const side = rng() < 0.5 ? "left" : "right";
    const transition = i === 0 || kind !== "mixed" ? null : type === trials[i - 1].type ? "repeat" : "switch";
    trials.push({ type, side, answer: heartsFlowersAnswer(type, side), transition });
  }
  return trials;
}

/* ---------- 브라우저 전용 ---------- */

/**
 * 다음 화면 갱신 때 render(onset)를 실행하고, 그 프레임의 시각(onset)을 돌려준다.
 * onset을 render 안에서 넘겨 주므로, 같은 프레임에 들어온 반응도 onset 이후로 판단할 수 있다.
 */
export function presentOnNextFrame(render) {
  return new Promise((resolve) => {
    requestAnimationFrame((t) => {
      render(t);
      resolve(t);
    });
  });
}

/** 지정한 시각(performance.now 기준)까지 기다린다 */
export function waitUntil(time) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, time - performance.now())));
}

/** 화면 주사율 추정 (Hz). 기기 간 RT를 직접 비교하지 않기 위한 기록용이다. */
export function measureRefreshRate(frames = 30) {
  return new Promise((resolve) => {
    const stamps = [];
    const tick = (t) => {
      stamps.push(t);
      if (stamps.length > frames) {
        const gaps = stamps.slice(1).map((v, i) => v - stamps[i]).sort((x, y) => x - y);
        const median = gaps[Math.floor(gaps.length / 2)];
        resolve(median > 0 ? Math.round(1000 / median) : null);
      } else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/** 기기 정보 (비식별). 세션 기록과 CSV에 함께 남긴다. */
export async function deviceInfo() {
  return {
    user_agent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}@${window.devicePixelRatio || 1}`,
    touch: navigator.maxTouchPoints > 0,
    refresh_hz: await measureRefreshRate(),
  };
}

/** 한국어 음성 안내. 지원하지 않는 브라우저면 false를 돌려준다. */
export function speak(text) {
  if (!("speechSynthesis" in window)) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ko-KR";
  u.rate = 0.95;
  speechSynthesis.speak(u);
  return true;
}

/**
 * 반응 버튼 연결. pointerdown(터치·마우스)과 Space·Enter(키보드)를 같은 반응으로 받는다.
 * 반환값은 연결 해제 함수.
 */
export function bindResponse(el, onResponse) {
  const down = (e) => {
    if (e.button !== undefined && e.button > 0) return;
    e.preventDefault();
    onResponse(performance.now(), e.pointerType || "pointer");
  };
  const key = (e) => {
    if (e.repeat) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onResponse(performance.now(), "keyboard");
    }
  };
  el.addEventListener("pointerdown", down);
  el.addEventListener("keydown", key);
  return () => {
    el.removeEventListener("pointerdown", down);
    el.removeEventListener("keydown", key);
  };
}

/** CSV 내려받기 (엑셀 한글 호환을 위해 BOM 포함) */
export function downloadCSV(filename, rows) {
  const blob = new Blob(["﻿" + toCSV(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** 세션 식별용 임의 값 (대상자 정보와 무관) */
export function sessionId() {
  return (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).slice(0, 8);
}
