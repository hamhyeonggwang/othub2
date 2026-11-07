/*
 * 실행기능 과제 공통 화면 도우미 (ES module).
 * 과제마다 같은 모양을 쓰는 부분 — 화면 전환, 선택지, 별 보상, 치료사 표 — 만 모은다.
 */

export const $ = (id) => document.getElementById(id);

/** 화면 묶음 중 하나만 보이고, 그 화면의 제목으로 초점을 옮긴다 */
export function screens(ids) {
  return function show(id) {
    ids.forEach((s) => ($(s).hidden = s !== id));
    const h = $(id).querySelector("h1,h2");
    if (h) {
      h.tabIndex = -1;
      h.focus();
    }
  };
}

/** data-<attr> 선택 버튼 묶음. 누른 버튼만 aria-pressed=true */
export function bindChoices(attr, onChange) {
  const buttons = document.querySelectorAll(`[data-${attr}]`);
  const set = (value) =>
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset[attr] === String(value))));
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      set(b.dataset[attr]);
      onChange(b.dataset[attr]);
    }),
  );
  return set;
}

/** 별 보상 (노력 보상만, 점수 비교 없음) */
export function renderStars(el, on, total) {
  el.innerHTML = Array.from({ length: total }, (_, i) => `<span data-on="${i < on}" aria-hidden="true">★</span>`).join("");
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", `별 ${on}개`);
}

/** 버튼이 눌릴 때까지 기다린다 */
export function waitClick(el) {
  return new Promise((r) => el.addEventListener("click", r, { once: true }));
}

/** 일정 시간 기다린다 */
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** 치료사 보기 표. cols: [{key,label,fmt?}] */
export function renderTable(table, caption, cols, rows) {
  const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const head = cols.map((c) => `<th scope="col">${esc(c.label)}</th>`).join("");
  const body = rows.length
    ? rows.map((r) => `<tr>${cols.map((c) => `<td>${esc(c.fmt ? c.fmt(r[c.key], r) : r[c.key] ?? "–")}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${cols.length}">완료한 기록이 없습니다</td></tr>`;
  table.innerHTML = `<caption class="ef-note" style="text-align:left;caption-side:top">${esc(caption)}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody>`;
}

/** 치료사 보기 열고 닫기 */
export function bindProToggle(button, panel) {
  button.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  });
}

export const pct = (v) => (v === null || v === undefined || Number.isNaN(v) ? "–" : `${Math.round(v * 100)}%`);
export const ms = (v) => (v === null || v === undefined ? "–" : `${Math.round(v)}ms`);

/** 결과 파일 이름 */
export function fileStamp(date, session) {
  return `${date.toISOString().slice(0, 16).replace(/[-:T]/g, "")}-${session}`;
}

/* ---------- 음성 안내 ----------
 * 쉬는 화면·규칙이 바뀔 때 안내 문구를 자동으로 읽는다. 시작 화면의 버튼으로 끄고 켤 수 있고,
 * 설정은 이 기기에만 기억한다(저장이 막힌 브라우저면 매번 켜짐으로 시작).
 */
const VOICE_KEY = "othub-ef-voice";
let voiceOn = true;
try { voiceOn = localStorage.getItem(VOICE_KEY) !== "off"; } catch { /* 저장소를 못 쓰면 기본값 */ }

export function bindVoiceToggle(button) {
  const render = () => {
    button.setAttribute("aria-pressed", String(voiceOn));
    button.textContent = voiceOn ? "음성 안내 켜짐" : "음성 안내 꺼짐";
  };
  button.addEventListener("click", () => {
    voiceOn = !voiceOn;
    try { localStorage.setItem(VOICE_KEY, voiceOn ? "on" : "off"); } catch { /* 무시 */ }
    if (!voiceOn && "speechSynthesis" in window) speechSynthesis.cancel();
    render();
  });
  render();
}

/** 안내 문구를 읽는다 (음성 안내가 켜져 있고 브라우저가 지원할 때만) */
export function announce(text) {
  if (!voiceOn || !("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ko-KR";
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

/** iPhone·iPad Safari는 첫 음성을 사용자 터치 안에서만 허용한다 — 시작 버튼을 누를 때 한 번 깨워 둔다 */
export function primeVoice() {
  if (!voiceOn || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0;
  speechSynthesis.speak(u);
}
