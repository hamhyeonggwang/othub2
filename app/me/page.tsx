import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import "../auth/auth.css";
import "../hub/hub.css";
import "../assess/assess.css";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { getMyBookmarks } from "@/lib/supabase/content";
import { getMySessions } from "@/lib/supabase/assess";
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

  const canUseAssess = role === "therapist" || role === "admin";
  const [bookmarks, sessions] = await Promise.all([
    getMyBookmarks(),
    canUseAssess ? getMySessions() : Promise.resolve([]),
  ]);

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

      <div className="profile-card">
        <h2>저장한 자료 ({bookmarks.length})</h2>
        {bookmarks.length === 0 ? (
          <p className="hint">
            아직 저장한 자료가 없어요. 콘텐츠 허브나 훈련 웹앱에서 하트를
            눌러 저장해 보세요.
          </p>
        ) : (
          <div className="hub-grid">
            {bookmarks.map((item) => {
              const href =
                item.type === "app"
                  ? `/hub/apps/${item.slug}`
                  : (item.external_url ?? null);
              if (!href) {
                return (
                  <div key={item.id} className="hub-card">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                );
              }
              return item.type === "app" ? (
                <Link key={item.id} className="hub-card" href={href}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </Link>
              ) : (
                <a
                  key={item.id}
                  className="hub-card-external"
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </a>
              );
            })}
          </div>
        )}
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

      {canUseAssess && (
        <div className="profile-card">
          <h2>평가 세션 ({sessions.length})</h2>
          {sessions.length === 0 ? (
            <p className="hint">
              아직 저장된 평가 세션이 없습니다. OTHub Assess에서 첫 세션을
              진행해 보세요.
            </p>
          ) : (
            <div className="assess-session-list">
              {sessions.slice(0, 3).map((s) => (
                <Link key={s.id} className="assess-session-card" href={`/assess/${s.id}`}>
                  <div>
                    <strong>{s.client_code}</strong>
                    <span>{new Date(s.created_at).toLocaleString("ko-KR")}</span>
                  </div>
                  <span className="assess-session-status">
                    {s.status === "done" ? "완료" : "진행 중"}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <Link
            className="auth-submit"
            style={{ display: "inline-block", width: "auto", padding: "10px 20px", textDecoration: "none", marginTop: 16 }}
            href="/assess"
          >
            OTHub Assess 열기
          </Link>
        </div>
      )}
      </div>
    </>
  );
}
