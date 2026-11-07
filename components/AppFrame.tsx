"use client";

import { useEffect, useRef, useState } from "react";

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

export default function AppFrame({
  src,
  title,
  requiresCamera,
}: {
  src: string;
  title: string;
  requiresCamera?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // 전체화면 API가 없거나 거절되는 브라우저(iPhone Safari 등)는 화면을 꽉 채우는 대체 모드를 쓴다
  const [pseudo, setPseudo] = useState(false);

  useEffect(() => {
    const doc = document as FullscreenDocument;
    const onChange = () => {
      const active = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setIsFullscreen(active === wrapRef.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // 대체 모드: 뒤 페이지 스크롤을 막고 Esc로 닫는다
  useEffect(() => {
    if (!pseudo) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPseudo(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [pseudo]);

  const toggleFullscreen = () => {
    const el = wrapRef.current as FullscreenElement | null;
    const doc = document as FullscreenDocument;
    if (!el) return;

    if (pseudo) {
      setPseudo(false);
      return;
    }
    const active = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
    if (active) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      return;
    }
    try {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => setPseudo(true));
      } else if (el.webkitRequestFullscreen) {
        const r = el.webkitRequestFullscreen();
        // 옛 WebKit은 Promise를 돌려주지 않는다 — 잠시 뒤에도 전체화면이 아니면 대체 모드
        if (r && typeof r.then === "function") r.then(undefined, () => setPseudo(true));
        else setTimeout(() => { if (!doc.webkitFullscreenElement) setPseudo(true); }, 300);
      } else {
        setPseudo(true);
      }
    } catch {
      setPseudo(true);
    }
  };

  const expanded = isFullscreen || pseudo;

  return (
    <div className={pseudo ? "app-frame-wrap is-pseudo-fullscreen" : "app-frame-wrap"} ref={wrapRef}>
      <iframe
        src={src}
        title={title}
        allow={requiresCamera ? "camera; fullscreen" : "fullscreen"}
        allowFullScreen
      />
      <button
        type="button"
        className="app-fullscreen-btn"
        onClick={toggleFullscreen}
        aria-label={expanded ? "전체화면 종료" : "전체화면으로 보기"}
      >
        {expanded ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 4v3a2 2 0 0 1-2 2H4M20 9h-3a2 2 0 0 1-2-2V4M15 20v-3a2 2 0 0 1 2-2h3M4 15h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9V6a2 2 0 0 1 2-2h3M20 9V6a2 2 0 0 1-2-2h-3M4 15v3a2 2 0 0 0 2 2h3M20 15v3a2 2 0 0 1-2 2h-3" />
          </svg>
        )}
        {expanded ? "전체화면 종료" : "전체화면"}
      </button>
    </div>
  );
}
