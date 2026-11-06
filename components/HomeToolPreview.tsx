"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * 홈 첫 화면의 실제 도구 미리보기.
 * 6초마다 다음 도구로 넘어가며, 멈춤 버튼·탭으로 직접 고를 수 있다.
 * 움직임 줄이기 설정이면 자동으로 넘기지 않고, 마우스를 올리거나 포커스가 들어오면 멈춘다.
 */
const TOOLS = [
  {
    key: "kiosk",
    tab: "키오스크",
    title: "편의점 셀프계산대 훈련, 터치로 조작",
    src: "/home/cu-kiosk.webp",
    alt: "편의점 셀프계산대 훈련 첫 화면",
    href: "/hub/apps/cu-kiosk-trainer",
  },
  {
    key: "cognitive",
    tab: "인지활동",
    title: "일상 인지활동, 내 이야기로 하는 활동",
    src: "/home/everyday-cognition.webp",
    alt: "일상 인지활동의 재료 나눠 담기 화면",
    href: "/hub/apps/everyday-cognition",
  },
  {
    key: "hand",
    tab: "손 동작",
    title: "에어 드로잉, 카메라로 손 동작 인식",
    src: "/home/airdrawing.webp",
    alt: "에어 드로잉 시작 화면",
    href: "/hub/apps/airdrawing",
  },
] as const;

const INTERVAL_MS = 6000;

export default function HomeToolPreview() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const running = !paused && !held && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % TOOLS.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [running]);

  const tool = TOOLS[index];
  return (
    <div
      className="home2-live"
      aria-label="실제 도구 미리보기"
      role="region"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div className="home2-live-bar">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <p aria-live="polite">{tool.title}</p>
      </div>
      <Link className="home2-live-screen" href={tool.href} aria-label={`${tool.tab} 도구 열기: ${tool.title}`}>
        {TOOLS.map((t, i) => (
          <Image
            key={t.key}
            src={t.src}
            alt={i === index ? t.alt : ""}
            width={960}
            height={720}
            priority={i === 0}
            sizes="(max-width: 760px) 100vw, 560px"
            data-active={i === index}
          />
        ))}
      </Link>
      <div className="home2-live-controls" role="group" aria-label="미리볼 도구 고르기">
        {TOOLS.map((t, i) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={i === index}
            className="home2-live-tab"
            onClick={() => setIndex(i)}
          >
            {t.tab}
          </button>
        ))}
        {!reduced && (
          <button
            type="button"
            className="home2-live-pause"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {paused ? <path d="M8 6l10 6-10 6z" /> : <path d="M9 6v12M15 6v12" />}
            </svg>
            {paused ? "다시 넘기기" : "멈춤"}
          </button>
        )}
      </div>
    </div>
  );
}
