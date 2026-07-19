/**
 * 세션 평가: 왼쪽 사이드바 — 선택 도구 목록, 진행률, 이전 평가 이동, 다음/완료
 * 각 페이지에서 window._TOOL_ID, goNextTool, persistToolReport(선택) 제공
 */
(function () {
  'use strict';

  var ROUTE_MAP = {
    profiling: 'assess-profiling.html',
    otipm: 'assess-otipm.html',
    jthft: 'assess-jthft.html',
    macs: 'assess-macs.html',
    clinical: 'assess-clinical.html',
    sensory: 'assess-sensory.html',
    mbi: 'assess-mbi.html',
    fim: 'assess-fim.html',
    'k-iadl': 'assess-k-iadl.html',
  };

  var LABELS = {
    profiling: '작업수행 프로파일링',
    otipm: '수행분석 (OTIPM)',
    jthft: 'JTHFT',
    macs: 'MACS',
    clinical: 'HFT 임상관찰',
    sensory: '감각운동협응',
    mbi: 'K-MBI',
    fim: 'FIM',
    'k-iadl': 'K-IADL',
  };

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem('ot_session') || '{}');
    } catch (e) {
      return {};
    }
  }

  function hint(msg) {
    if (typeof window.showToast === 'function') window.showToast(msg);
    else window.alert(msg);
  }

  function injectStyles() {
    if (document.getElementById('ot-session-sidebar-styles')) return;
    var s = document.createElement('style');
    s.id = 'ot-session-sidebar-styles';
    s.textContent =
      '.ot-session-sidebar{position:fixed;left:0;top:60px;bottom:0;width:244px;z-index:96;' +
      'background:#fff;border-right:1px solid #E4E7F4;display:flex;flex-direction:column;' +
      'font-family:Pretendard,-apple-system,sans-serif;box-shadow:2px 0 16px rgba(30,27,58,.04);' +
      'transform:translateX(0);transition:transform .22s ease;}' +
      '.ot-session-sidebar.open{transform:translateX(0);}' +
      '@media(max-width:900px){' +
      '.ot-session-sidebar{transform:translateX(-105%);box-shadow:none;}' +
      '.ot-session-sidebar.open{transform:translateX(0);box-shadow:8px 0 32px rgba(0,0,0,.12);}' +
      '}' +
      '.ot-sb-head{flex-shrink:0;padding:14px 14px 10px;border-bottom:1px solid #E4E7F4;background:#F7F8FD;}' +
      '.ot-sb-head-title{font-size:11px;font-weight:800;color:#9896B8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;}' +
      '.ot-sb-progress-meta{display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#4A4770;margin-bottom:6px;}' +
      '.ot-sb-bar{height:5px;background:#E4E7F4;border-radius:3px;overflow:hidden;}' +
      '.ot-sb-bar-fill{height:100%;background:#6C5CE7;border-radius:3px;transition:width .35s ease;}' +
      '.ot-sb-list{flex:1;overflow-y:auto;padding:10px 10px 12px;-webkit-overflow-scrolling:touch;}' +
      '.ot-sb-item{display:flex;align-items:flex-start;gap:10px;width:100%;text-align:left;padding:11px 10px;margin-bottom:6px;' +
      'border-radius:12px;border:1px solid transparent;background:#fff;cursor:pointer;font-size:13px;font-weight:600;color:#1E1B3A;' +
      'transition:background .15s,border-color .15s;}' +
      '.ot-sb-item:hover{background:#F7F8FD;}' +
      '.ot-sb-item:focus{outline:2px solid rgba(108,92,231,.35);outline-offset:1px;}' +
      '.ot-sb-item .ot-sb-idx{font-size:11px;font-weight:800;color:#9896B8;min-width:22px;padding-top:1px;}' +
      '.ot-sb-item .ot-sb-name{flex:1;line-height:1.35;}' +
      '.ot-sb-item.done{border-color:#00B89433;background:#E0F8F3;}' +
      '.ot-sb-item.done .ot-sb-badge{color:#007A5E;font-size:11px;font-weight:800;margin-top:2px;}' +
      '.ot-sb-item.current{border-color:#6C5CE7;background:#EDEAFD;box-shadow:0 0 0 1px rgba(108,92,231,.12);}' +
      '.ot-sb-item.current .ot-sb-badge{color:#6C5CE7;font-size:11px;font-weight:800;margin-top:2px;}' +
      '.ot-sb-item.upcoming{opacity:.52;cursor:not-allowed;background:#FAFAFC;}' +
      '.ot-sb-item.upcoming:hover{background:#FAFAFC;}' +
      '.ot-sb-footer{flex-shrink:0;padding:12px;border-top:1px solid #E4E7F4;background:#fff;}' +
      '.ot-sb-next{width:100%;height:46px;border:none;border-radius:12px;background:#6C5CE7;color:#fff;' +
      'font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;}' +
      '.ot-sb-next:active{transform:scale(.98);}' +
      'body.has-session-sidebar main.page{margin-left:244px;margin-right:auto;max-width:860px;}' +
      '@media(max-width:900px){body.has-session-sidebar main.page{margin-left:0;max-width:100%;}}' +
      'body.has-session-sidebar .nav-bar{left:244px;}' +
      '@media(max-width:900px){body.has-session-sidebar .nav-bar{left:0;}}' +
      '.ot-session-sidebar-toggle{display:none;width:40px;height:40px;border-radius:10px;border:1px solid #E4E7F4;' +
      'background:#fff;align-items:center;justify-content:center;cursor:pointer;margin-right:4px;flex-shrink:0;font-size:18px;color:#4A4770;}' +
      '@media(max-width:900px){.ot-session-sidebar-toggle{display:flex!important;}}' +
      '.ot-session-backdrop{display:none;position:fixed;inset:0;background:rgba(30,27,58,.35);z-index:95;}' +
      '.ot-session-backdrop.show{display:block;}' +
      '@media print{.ot-session-sidebar,.ot-session-sidebar-toggle,.ot-session-backdrop{display:none!important;}' +
      'body.has-session-sidebar main.page{margin-left:0!important;}body.has-session-sidebar .nav-bar{left:0!important;}}';
    document.head.appendChild(s);
  }

  function removeLegacyBar() {
    var old = document.getElementById('session-nav-bar');
    if (old) old.remove();
  }

  function closeMobile() {
    var sb = document.getElementById('ot-session-sidebar');
    var bd = document.getElementById('ot-session-backdrop');
    if (sb) sb.classList.remove('open');
    if (bd) bd.classList.remove('show');
    var tg = document.getElementById('ot-session-sidebar-toggle');
    if (tg) tg.setAttribute('aria-expanded', 'false');
  }

  function openMobile() {
    var sb = document.getElementById('ot-session-sidebar');
    var bd = document.getElementById('ot-session-backdrop');
    if (sb) sb.classList.add('open');
    if (bd) bd.classList.add('show');
  }

  function ensureBackdrop() {
    var bd = document.getElementById('ot-session-backdrop');
    if (!bd) {
      bd = document.createElement('div');
      bd.id = 'ot-session-backdrop';
      bd.className = 'ot-session-backdrop';
      bd.addEventListener('click', closeMobile);
      document.body.appendChild(bd);
    }
    return bd;
  }

  function ensureToggle() {
    if (document.getElementById('ot-session-sidebar-toggle')) return;
    var top = document.querySelector('.topbar');
    if (!top) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'ot-session-sidebar-toggle';
    btn.className = 'ot-session-sidebar-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', '세션 평가 목록');
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    btn.addEventListener('click', function () {
      var sb = document.getElementById('ot-session-sidebar');
      if (!sb) return;
      var open = sb.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var bd = ensureBackdrop();
      if (open) bd.classList.add('show');
      else bd.classList.remove('show');
    });
    var back = top.querySelector('.topbar-back');
    if (back && back.nextSibling) top.insertBefore(btn, back.nextSibling);
    else top.insertBefore(btn, top.firstChild);
  }

  function navigateToIndex(idx) {
    var toolId = window._TOOL_ID;
    if (!toolId) return;
    var sess = getSession();
    var ready = sess.ready || [];
    var cur = ready.indexOf(toolId);
    if (idx === cur) {
      closeMobile();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (idx > cur) {
      hint('아직 진행 전인 평가예요. 순서대로 완료해 주세요.');
      return;
    }
    if (typeof window.persistToolReport === 'function') window.persistToolReport();
    var id = ready[idx];
    var route = ROUTE_MAP[id];
    if (route) window.location.href = route;
  }

  function render() {
    var toolId = window._TOOL_ID;
    if (!toolId) return;

    var sess = getSession();
    var ready = sess.ready || [];
    var cur = ready.indexOf(toolId);

    if (ready.length === 0 || cur < 0) {
      document.body.classList.remove('has-session-sidebar');
      removeLegacyBar();
      var ex = document.getElementById('ot-session-sidebar');
      if (ex) ex.remove();
      var tg = document.getElementById('ot-session-sidebar-toggle');
      if (tg) tg.remove();
      var bd = document.getElementById('ot-session-backdrop');
      if (bd) bd.remove();
      return;
    }

    injectStyles();
    removeLegacyBar();
    document.body.classList.add('has-session-sidebar');

    var isLast = cur === ready.length - 1;
    var pct = Math.round(((cur + 1) / ready.length) * 100);

    var itemsHtml = ready
      .map(function (id, idx) {
        var lab = LABELS[id] || id;
        var state = idx < cur ? 'done' : idx === cur ? 'current' : 'upcoming';
        var badge =
          state === 'done'
            ? '<span class="ot-sb-badge">완료</span>'
            : state === 'current'
              ? '<span class="ot-sb-badge">진행 중</span>'
              : '<span class="ot-sb-badge">대기</span>';
        return (
          '<button type="button" class="ot-sb-item ' +
          state +
          '" data-idx="' +
          idx +
          '">' +
          '<span class="ot-sb-idx">' +
          (idx + 1) +
          '</span>' +
          '<span class="ot-sb-name"><span style="display:block;font-weight:700;color:#1E1B3A;line-height:1.25">' +
          lab +
          '</span>' +
          badge +
          '</span></button>'
        );
      })
      .join('');

    var nextLabel = isLast ? '평가 완료 →' : '다음 평가 →';

    var aside = document.getElementById('ot-session-sidebar');
    if (!aside) {
      aside = document.createElement('aside');
      aside.id = 'ot-session-sidebar';
      aside.className = 'ot-session-sidebar';
      aside.setAttribute('aria-label', '이번 세션 평가 목록');
      document.body.appendChild(aside);
    }

    aside.innerHTML =
      '<div class="ot-sb-head">' +
      '<div class="ot-sb-head-title">이번 세션</div>' +
      '<div class="ot-sb-progress-meta"><span>' +
      (cur + 1) +
      ' / ' +
      ready.length +
      '</span><span>' +
      pct +
      '%</span></div>' +
      '<div class="ot-sb-bar"><div class="ot-sb-bar-fill" style="width:' +
      pct +
      '%"></div></div></div>' +
      '<div class="ot-sb-list">' +
      itemsHtml +
      '</div>' +
      '<div class="ot-sb-footer"><button type="button" class="ot-sb-next" id="ot-sb-next-btn">' +
      nextLabel +
      '</button></div>';

    aside.querySelectorAll('.ot-sb-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (btn.classList.contains('upcoming')) {
          hint('아직 진행 전인 평가예요. 순서대로 완료해 주세요.');
          return;
        }
        navigateToIndex(idx);
        closeMobile();
      });
    });

    var nextBtn = aside.querySelector('#ot-sb-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (typeof window.goNextTool === 'function') window.goNextTool();
        else hint('다음 단계를 찾을 수 없습니다.');
        closeMobile();
      });
    }

    ensureToggle();
    ensureBackdrop();
  }

  window.OtSessionChrome = {
    init: render,
    navigateToIndex: navigateToIndex,
    closeMobile: closeMobile,
  };

  document.addEventListener('DOMContentLoaded', function () {
    render();
  });

  window.addEventListener(
    'resize',
    function () {
      if (window.innerWidth > 900) closeMobile();
    },
    { passive: true }
  );

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobile();
  });
})();

