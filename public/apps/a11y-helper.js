/*
 * 도구 앱 공통 접근성 보조 — 화면 읽기 프로그램이 읽을 이름이 없는 버튼·입력란에 이름을 붙인다.
 * 앱 마크업은 건드리지 않고, 나중에 스크립트로 생긴 요소도 MutationObserver로 다시 살핀다.
 *  - 켜기/끄기 스위치: 앞의 라벨 글자를 이름으로, role="switch" + aria-checked(클래스 on/active와 동기화)
 *  - 색상 버튼: 배경색에 가까운 색 이름
 *  - 라벨 없는 입력란: 바로 앞 요소나 부모 요소의 글자
 */
(function () {
  var COLORS = [
    ["빨강", 255, 0, 60], ["주황", 255, 153, 0], ["노랑", 255, 255, 0], ["초록", 57, 255, 20],
    ["청록", 0, 255, 255], ["하늘색", 0, 190, 255], ["파랑", 0, 80, 255], ["자주", 255, 0, 255],
    ["흰색", 255, 255, 255], ["검정", 0, 0, 0], ["회색", 128, 128, 128]
  ];
  var LABEL_SEL = ".tp-tog-label,.tog-lbl,.tgl,label,[class*='label'],[class*='lbl'],[class*='title']";

  function text(el) { return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : ""; }
  function named(el) {
    return text(el) || el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.getAttribute("title");
  }
  function colorName(el) {
    var m = (getComputedStyle(el).backgroundColor || "").match(/\d+/g);
    if (!m) return "";
    var best = "", dist = Infinity;
    COLORS.forEach(function (c) {
      var d = Math.pow(c[1] - m[0], 2) + Math.pow(c[2] - m[1], 2) + Math.pow(c[3] - m[2], 2);
      if (d < dist) { dist = d; best = c[0]; }
    });
    return best;
  }
  function nearbyText(el) {
    var prev = el.previousElementSibling;
    var own = prev && (prev.matches(LABEL_SEL) ? prev : prev.querySelector(LABEL_SEL));
    if (text(own)) return text(own);
    if (text(prev) && text(prev).length <= 40) return text(prev);
    var parent = el.parentElement;
    var t = parent ? text(parent) : "";
    return t.length <= 40 ? t : "";
  }
  function syncState(el, attr) {
    var on = function () { el.setAttribute(attr, el.classList.contains("on") || el.classList.contains("active") ? "true" : "false"); };
    on();
    new MutationObserver(on).observe(el, { attributes: true, attributeFilter: ["class"] });
  }

  function fix() {
    document.querySelectorAll("button:not([data-a11y])").forEach(function (b) {
      if (named(b)) return;
      b.setAttribute("data-a11y", "1");
      if (/(^|[\s-])(sw|switch|tog-sw|tp-switch)([\s-]|$)/.test(b.className)) {
        var label = nearbyText(b);
        if (label) b.setAttribute("aria-label", label);
        b.setAttribute("role", "switch");
        syncState(b, "aria-checked");
      } else if (/color/.test(b.className)) {
        var c = colorName(b);
        // 비슷한 색이 여럿일 수 있어 순번을 붙인다
        var siblings = b.parentElement ? [].filter.call(b.parentElement.children, function (x) { return x.className === b.className || /color/.test(x.className); }) : [b];
        if (c) b.setAttribute("aria-label", "색상 " + (siblings.indexOf(b) + 1) + ": " + c);
        syncState(b, "aria-pressed");
      } else {
        var t = nearbyText(b);
        if (t) b.setAttribute("aria-label", t);
      }
    });
    document.querySelectorAll("input:not([type=hidden]):not([data-a11y]),select:not([data-a11y])").forEach(function (i) {
      i.setAttribute("data-a11y", "1");
      if (i.labels && i.labels.length) return;
      if (i.getAttribute("aria-label") || i.getAttribute("aria-labelledby")) return;
      // 라벨 옆에 붙은 현재 값(예: 12px, 40%)은 이름에서 뺀다
      var t = nearbyText(i).replace(/\s*[-+]?\d+(\.\d+)?\s*(px|%|초|분|단계)?\s*$/, "").trim();
      if (t) i.setAttribute("aria-label", t);
    });
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(function () { queued = false; fix(); }, 50);
  }
  function start() {
    fix();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
