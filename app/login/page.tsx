import type { Metadata } from "next";
import Link from "next/link";
import "../auth/auth.css";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "로그인",
  description: "구글 계정으로 OTHub에 로그인하세요.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link className="auth-brand" href="/">
          <span className="auth-brand-mark">OT</span>
          <strong>OTHub</strong>
        </Link>
        <h1>로그인 / 회원가입</h1>
        <p className="auth-desc">
          구글 계정 하나면 됩니다. 처음이면 자동으로 회원가입됩니다.
        </p>
        <LoginForm error={error} />
      </div>
    </div>
  );
}
