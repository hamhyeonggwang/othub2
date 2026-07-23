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
        <Link className="brand" href="/" aria-label="OTHub 홈">
          <span className="brand-mark" aria-hidden="true">
            OT
          </span>
          <span>
            <strong>OTHub</strong>
            <small>작업치료사가 만들고, 함께 쓰는</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="주요 메뉴">
          <Link href="/hub/apps">도구</Link>
          <Link href="/hub">콘텐츠</Link>
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
