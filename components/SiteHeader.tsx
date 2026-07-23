import Link from "next/link";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";

export default async function SiteHeader() {
  const { user, profile } = await getCurrentUserAndProfile();

  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>

      <header className="site-header">
        <input type="checkbox" id="nav-toggle" className="nav-toggle-checkbox" />

        <div className="site-header-top">
          <Link className="brand" href="/" aria-label="OTHub 홈">
            <span className="brand-mark" aria-hidden="true">
              OT
            </span>
            <span>
              <strong>OTHub</strong>
              <small>작업치료사가 만들고, 함께 쓰는</small>
            </span>
          </Link>

          <label htmlFor="nav-toggle" className="nav-toggle-btn" aria-label="메뉴 열기">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </label>
        </div>

        <nav className="desktop-nav" aria-label="주요 메뉴">
          <Link href="/hub/apps">도구</Link>
          <Link href="/hub">콘텐츠</Link>
          <Link href="/lab">Lab</Link>
          <Link href="/about">소개</Link>
        </nav>

        <div className="header-auth">
          <Link className="button button-secondary" href={user ? "/me" : "/login"}>
            {user ? profile?.display_name || "My Hub" : "로그인"}
          </Link>
          <Link className="nav-cta" href="/hub/apps">
            도구 찾기
          </Link>
        </div>
      </header>
    </>
  );
}
