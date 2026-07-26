import type { ReactNode } from "react";
import "./landing-page.css";

/**
 * chrome 없는 목적별 랜딩페이지 그룹. SiteHeader를 렌더링하지 않고 사이드바
 * 오프셋도 상속하지 않는다 — QR/SNS 광고 등 외부에서 맥락 없이 들어온 방문자를
 * 위한 단일 목표 페이지 전용.
 */
export default function LandingGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
