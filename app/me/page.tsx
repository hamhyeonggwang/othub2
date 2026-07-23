import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import "../auth/auth.css";
import "../hub/hub.css";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import TherapistRequestForm from "./TherapistRequestForm";
import SignOutButton from "./SignOutButton";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "내 정보",
};

const ROLE_LABEL: Record<string, string> = {
  member: "일반 회원",
  therapist: "치료사 회원",
  admin: "관리자",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ assess?: string }>;
}) {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login?next=/me");

  const params = await searchParams;
  const initial = (profile?.display_name || user.email || "?").charAt(0).toUpperCase();
  const role = profile?.role ?? "member";
  const isTherapistPending =
    !!profile?.therapist_requested_at && !profile?.approved_at && role === "member";

  return (
    <>
      <SiteHeader />
      <div className="profile-shell" id="main">
      <Link className="hub-back" href="/">
        ← OTHub 홈으로
      </Link>

      <div className="profile-card" style={{ marginTop: 20 }}>
        <div className="profile-header">
          <span className="profile-avatar">{initial}</span>
          <div>
            <strong style={{ display: "block", color: "var(--navy)", fontSize: 17 }}>
              {profile?.display_name || user.email}
            </strong>
            <span className="profile-role-badge" data-role={role}>
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>
        <p className="hint">{user.email}</p>
        <SignOutButton />
      </div>

      {params.assess === "locked" && (
        <div className="profile-card" style={{ background: "rgba(220,38,38,0.05)" }}>
          <p className="hint" style={{ margin: 0 }}>
            OTHub Assess는 치료사 인증 회원만 이용할 수 있습니다. 아래에서 인증을
            요청해 주세요.
          </p>
        </div>
      )}

      {role === "member" && (
        <div className="profile-card">
          <h2>치료사 인증 요청</h2>
          {isTherapistPending ? (
            <p className="hint">
              인증 요청이 접수되었습니다. 관리자 승인 후 OTHub Assess를 이용할
              수 있습니다.
            </p>
          ) : (
            <>
              <p className="hint">
                면허번호를 등록하면 관리자 승인 후 치료사 회원으로 전환되어
                임상 평가 도구(OTHub Assess)를 이용할 수 있습니다.
              </p>
              <TherapistRequestForm />
            </>
          )}
        </div>
      )}

      {role === "admin" && (
        <div className="profile-card">
          <h2>관리자</h2>
          <p className="hint">치료사 인증 승인, 콘텐츠·회원·참여 관리를 할 수 있습니다.</p>
          <Link
            className="auth-submit"
            style={{ display: "inline-block", width: "auto", padding: "10px 20px", textDecoration: "none" }}
            href="/admin"
          >
            관리자 대시보드 열기
          </Link>
        </div>
      )}

      {(role === "therapist" || role === "admin") && (
        <div className="profile-card">
          <h2>OTHub Assess</h2>
          <p className="hint">
            치료사 회원으로 인증되었습니다. 임상 평가 도구 8종을 세션으로 진행하고
            결과보고서를 저장할 수 있습니다.
          </p>
          <Link className="auth-submit" style={{ display: "inline-block", width: "auto", padding: "10px 20px", textDecoration: "none" }} href="/assess">
            OTHub Assess 열기
          </Link>
        </div>
      )}
      </div>
    </>
  );
}
