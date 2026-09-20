"use client";

import { useState, type ReactNode } from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/BrandMark";

const links = [
  ["/hub/apps", "Tool"], ["/assess", "Assess"], ["/hub", "Content"],
  ["/links", "Link"], ["/lab", "Project"], ["/groups", "Group"], ["/about", "소개"],
] as const;

function NavigationHint() {
  const { pending } = useLinkStatus();
  return <span className="nav-hint" data-pending={pending} role="status" aria-label={pending ? "페이지 이동 중" : undefined} />;
}

export default function SiteNavigation({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <>
    <a className="skip-link" href="#main">본문으로 바로가기</a>
    <header className="site-header" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
      <input type="checkbox" id="nav-toggle" className="nav-toggle-checkbox" checked={open} readOnly tabIndex={-1} aria-hidden="true" />
      <div className="site-header-top">
        <Link className="brand" href="/" aria-label="OTHub 홈" onNavigate={() => setOpen(false)}>
          <span className="brand-mark"><BrandMark /></span>
          <span><strong>OTHub</strong><small>작업치료사가 만들고, 함께 쓰는</small></span>
        </Link>
        <button type="button" className="nav-toggle-btn" aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
      <nav id="primary-navigation" className="desktop-nav" aria-label="주요 메뉴">
        {links.map(([href, label]) => {
          const active = href === "/hub" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} onNavigate={() => setOpen(false)}>
            {label}<NavigationHint />
          </Link>;
        })}
        <div className="nav-account-inline">{children}</div>
      </nav>
    </header>
  </>;
}
