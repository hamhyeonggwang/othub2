import type { Metadata } from "next";
import Link from "next/link";
import "../auth/auth.css";
import LoginForm from "./LoginForm";
import BrandMark from "@/components/BrandMark";

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
  const isAssessGated = next === "/assess";

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link className="auth-brand" href="/">
          <span className="auth-brand-mark">
            <BrandMark />
          </span>
          <strong>OTHub</strong>
        </Link>
        <h1>로그인 / 회원가입</h1>
        <p className="auth-desc">
          구글 계정 하나면 됩니다. 처음이면 자동으로 회원가입됩니다.
        </p>
        {isAssessGated && (
          <p className="auth-callout">
            OTHub Assess는 작업치료사 인증이 필요한 기능입니다. 로그인 후
            면허번호를 등록해 인증을 신청하면, 관리자 승인을 거쳐 이용할 수
            있어요.
          </p>
        )}
        <LoginForm error={error} next={next} />
      </div>
    </div>
  );
}
