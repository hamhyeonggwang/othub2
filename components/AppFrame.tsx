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

  const toggleFullscreen = () => {
    const el = wrapRef.current as FullscreenElement | null;
    const doc = document as FullscreenDocument;
    if (!el) return;

    const active = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
    if (!active) {
      if (el.requestFullscreen) el.requestFullscreen().catch((err) => console.error("[fullscreen]", err));
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    }
  };

  return (
    <div className="app-frame-wrap" ref={wrapRef}>
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
        aria-label={isFullscreen ? "전체화면 종료" : "전체화면으로 보기"}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 4v3a2 2 0 0 1-2 2H4M20 9h-3a2 2 0 0 1-2-2V4M15 20v-3a2 2 0 0 1 2-2h3M4 15h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9V6a2 2 0 0 1 2-2h3M20 9V6a2 2 0 0 1-2-2h-3M4 15v3a2 2 0 0 0 2 2h3M20 15v3a2 2 0 0 1-2 2h-3" />
          </svg>
        )}
        {isFullscreen ? "전체화면 종료" : "전체화면"}
      </button>
    </div>
  );
}
