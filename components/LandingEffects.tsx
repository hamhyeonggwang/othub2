"use client";

import { useEffect } from "react";

/** index.html의 script.js 이식: 패럴랙스, 스크롤 등장 효과 */
export default function LandingEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const parallaxRoot = document.querySelector<HTMLElement>(
      "[data-parallax-root]"
    );

    const cleanups: (() => void)[] = [];

    if (parallaxRoot && finePointer && !reduceMotion) {
      const cards = [
        ...parallaxRoot.querySelectorAll<HTMLElement>("[data-depth]"),
      ];

      const onMove = (event: PointerEvent) => {
        const rect = parallaxRoot.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        cards.forEach((card) => {
          const depth = Number(card.dataset.depth || 0.5);
          card.style.translate = `${x * depth * 24}px ${y * depth * 18}px`;
        });
      };
      const onLeave = () => {
        cards.forEach((card) => {
          card.style.translate = "0 0";
        });
      };

      parallaxRoot.addEventListener("pointermove", onMove);
      parallaxRoot.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        parallaxRoot.removeEventListener("pointermove", onMove);
        parallaxRoot.removeEventListener("pointerleave", onLeave);
      });
    }

    const revealTargets = document.querySelectorAll(
      ".project-card, .process-list li, .about-copy, .section-heading"
    );

    if (!reduceMotion && "IntersectionObserver" in window) {
      revealTargets.forEach((target) => target.classList.add("reveal-ready"));

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      revealTargets.forEach((target) => observer.observe(target));
      cleanups.push(() => observer.disconnect());
    }

    const style = document.createElement("style");
    style.textContent = `
      .reveal-ready {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1);
      }
      .reveal-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
    cleanups.push(() => style.remove());

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
