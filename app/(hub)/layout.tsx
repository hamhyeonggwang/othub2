import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";

/**
 * 사이드바 내비게이션(SiteHeader)이 붙는 모든 "홈페이지" 라우트가 공유하는 레이아웃.
 * (landing) 그룹은 이 레이아웃을 거치지 않으므로 chrome이 붙지 않는다 — 개별
 * 페이지가 SiteHeader를 실수로 넣거나 빠뜨릴 수 없다.
 */
export default function HubLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
