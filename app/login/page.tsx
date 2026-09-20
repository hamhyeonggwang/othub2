import type { Metadata } from "next";
import Link from "next/link";
import "../auth/auth.css";
import "./login.css";
import LoginForm from "./LoginForm";
import BrandMark from "@/components/BrandMark";
import { safeReturnPath } from "@/lib/auth-navigation";

export const metadata: Metadata = {
  title: "로그인",
  description: "구글 계정으로 OTHub에 로그인하세요.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const returnPath = safeReturnPath(next);
  const pathname = returnPath.split(/[?#]/)[0];
  const isAssessGated =
    pathname === "/assess" || pathname.startsWith("/assess/");
  const isAdminGated = pathname === "/admin" || pathname.startsWith("/admin/");
  return (
    <main className="login-workspace" id="main">
      <div className="login-layout">
        <section className="login-intro" aria-labelledby="login-intro-title">
          <Link className="auth-brand" href="/" aria-label="OTHub 홈으로">
            <span className="auth-brand-mark">
              <BrandMark />
            </span>
            <strong>OTHub</strong>
          </Link>
          <p className="login-eyebrow">YOUR NEXT STEP</p>
          <h2 id="login-intro-title">
            찾아둔 자료를 모으고,
            <br />
            다음 활동을 이어가세요.
          </h2>
          <p className="login-intro-desc">
            작업치료사가 만든 훈련 도구와 콘텐츠를
            <br />
            나만의 공간에서 다시 만나보세요.
          </p>
          <ul className="login-benefits">
            <li>
              <span aria-hidden="true">01</span>
              <div>
                <strong>나의 자료 모음</strong>
                <p>북마크한 도구와 콘텐츠를 My Hub에서 다시 열 수 있습니다.</p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">02</span>
              <div>
                <strong>함께 나누는 의견</strong>
                <p>좋아요와 댓글로 자료에 대한 반응을 남길 수 있습니다.</p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">03</span>
              <div>
                <strong>치료사를 위한 평가 도구</strong>
                <p>
                  별도 치료사 인증을 거치면 OTHub Assess를 이용할 수 있습니다.
                </p>
              </div>
            </li>
          </ul>
          <Link className="login-browse" href="/hub/apps">
            로그인 없이 훈련 도구 둘러보기 →
          </Link>
        </section>
        <section className="auth-card login-card" aria-labelledby="login-title">
          <p className="login-eyebrow">WELCOME TO OTHUB</p>
          <h1 id="login-title">로그인 / 회원가입</h1>
          <p className="auth-desc">
            구글 계정으로 간편하게 시작하세요.
            <br />
            처음 로그인하면 회원 계정이 만들어집니다.
          </p>
          {isAssessGated && (
            <div className="login-access-note">
              <strong>치료사 인증이 필요한 기능입니다</strong>
              <p>
                로그인 후 My Hub에서 면허번호로 인증을 요청하세요. 관리자 승인
                후 평가 도구를 이용할 수 있습니다.
              </p>
            </div>
          )}
          {isAdminGated && (
            <div className="login-access-note">
              <strong>관리자 계정으로 로그인해 주세요</strong>
              <p>관리자 대시보드는 권한이 부여된 계정만 접근할 수 있습니다.</p>
            </div>
          )}
          <LoginForm error={error} next={returnPath} />
          <div className="login-help">
            <h2>아직 둘러보는 중인가요?</h2>
            <p>공개 훈련 도구와 콘텐츠는 로그인 없이도 이용할 수 있습니다.</p>
            <Link href="/hub">콘텐츠 둘러보기 →</Link>
          </div>
          <p className="login-support">
            로그인에 문제가 있나요?
            <br />
            <a href="mailto:h2g0614@gmail.com">h2g0614@gmail.com</a>
          </p>
        </section>
      </div>
    </main>
  );
}
