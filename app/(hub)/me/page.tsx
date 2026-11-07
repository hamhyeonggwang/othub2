import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import "../../auth/auth.css";
import "../hub/hub.css";
import "../hub/catalog.css";
import "../workspace-detail.css";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { getMyBookmarks, TYPE_LABEL } from "@/lib/supabase/content";
import { getMySessions } from "@/lib/supabase/assess";
import { externalContentUrl } from "@/lib/catalog";
import WorkspaceIcon from "@/components/WorkspaceIcon";
import TherapistRequestForm from "./TherapistRequestForm";
import SignOutButton from "./SignOutButton";
import WithdrawForm from "./WithdrawForm";

export const metadata: Metadata = {
  title: "My Hub",
  robots: { index: false, follow: false },
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
  const displayName = profile?.display_name || user.email || "회원";
  const initial = displayName.charAt(0).toUpperCase();
  const role = profile?.role ?? "member";
  const isTherapistPending =
    !!profile?.therapist_requested_at &&
    !profile?.approved_at &&
    role === "member";
  const canUseAssess = role === "therapist" || role === "admin";
  const [bookmarks, sessions] = await Promise.all([
    getMyBookmarks(),
    canUseAssess ? getMySessions() : Promise.resolve([]),
  ]);

  return (
    <main className="hub-shell personal-workspace" id="main">
      <header className="workspace-heading">
        <p className="workspace-eyebrow">YOUR WORKSPACE</p>
        <h1>My Hub</h1>
        <p className="hub-desc">
          저장한 자료를 다시 찾고, 나의 활동을 이어가세요.
        </p>
        <div className="workspace-links">
          <Link href="/hub/apps">훈련 도구 둘러보기 →</Link>
          <Link href="/hub">콘텐츠 찾아보기 →</Link>
        </div>
      </header>
      {params.assess === "locked" && role === "member" && (
        <div className="workspace-callout access-notice" role="status">
          <strong>평가 도구는 치료사 인증 후 이용할 수 있습니다.</strong>
          <p>
            아래 계정 영역에서 인증을 요청하면 관리자 승인 후 OTHub Assess를
            이용할 수 있습니다.
          </p>
          <a className="workspace-text-link" href="#therapist-access">
            치료사 인증 안내로 이동 →
          </a>
        </div>
      )}
      <div className="personal-layout">
        <div className="personal-main">
          <dl className="personal-summary" aria-label="나의 이용 현황">
            <div>
              <dt>저장한 자료</dt>
              <dd>
                {bookmarks.length}
                <span>개</span>
              </dd>
            </div>
            {canUseAssess ? (
              <div>
                <dt>평가 세션</dt>
                <dd>
                  {sessions.length}
                  <span>개</span>
                </dd>
              </div>
            ) : (
              <div>
                <dt>치료사 인증</dt>
                <dd className="summary-label">
                  {isTherapistPending ? "승인 대기" : "신청 가능"}
                </dd>
              </div>
            )}
          </dl>
          <section
            className="workspace-panel saved-resources"
            aria-labelledby="saved-title"
          >
            <div className="workspace-section-heading">
              <h2 id="saved-title">
                저장한 자료 <span>{bookmarks.length}</span>
              </h2>
              <Link className="workspace-text-link" href="/hub">
                자료 더 찾기 →
              </Link>
            </div>
            {bookmarks.length === 0 ? (
              <div className="workspace-empty">
                <span className="tool-symbol">
                  <WorkspaceIcon kind="content" />
                </span>
                <h3>다시 볼 자료를 모아보세요</h3>
                <p>
                  자료나 훈련 도구의 ‘북마크’를 누르면 이곳에 모입니다. 좋아요와
                  북마크는 별도로 관리됩니다.
                </p>
                <Link className="workspace-button" href="/hub/apps">
                  훈련 도구 찾아보기
                </Link>
              </div>
            ) : (
              <div className="saved-grid">
                {bookmarks.map((item) => {
                  const href =
                    item.type === "app"
                      ? `/hub/apps/${item.slug}`
                      : externalContentUrl(item.external_url);
                  const contents = (
                    <>
                      <span className="saved-kind">
                        {TYPE_LABEL[item.type]}
                      </span>
                      <h3>{item.title}</h3>
                      {item.description && <p>{item.description}</p>}
                      <span className="saved-destination">
                        {!href
                          ? "링크 준비 중"
                          : item.type === "app"
                            ? "도구 열기 →"
                            : "외부 자료 · 새 창 ↗"}
                      </span>
                    </>
                  );
                  if (!href)
                    return (
                      <article
                        key={item.id}
                        className="saved-card"
                        data-unavailable="true"
                      >
                        {contents}
                      </article>
                    );
                  return item.type === "app" ? (
                    <Link key={item.id} className="saved-card" href={href}>
                      {contents}
                    </Link>
                  ) : (
                    <a
                      key={item.id}
                      className="saved-card"
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {contents}
                    </a>
                  );
                })}
              </div>
            )}
          </section>
          {canUseAssess && (
            <section
              className="workspace-panel"
              aria-labelledby="recent-assess-title"
            >
              <div className="workspace-section-heading">
                <h2 id="recent-assess-title">최근 평가 세션</h2>
                <Link className="workspace-text-link" href="/assess">
                  Assess 열기 →
                </Link>
              </div>
              {sessions.length === 0 ? (
                <div className="workspace-empty">
                  <span className="tool-symbol">
                    <WorkspaceIcon kind="assess" />
                  </span>
                  <h3>아직 저장된 평가 세션이 없습니다</h3>
                  <p>
                    OTHub Assess에서 평가를 시작하면 저장한 세션을 이곳에서 다시
                    열 수 있습니다.
                  </p>
                  <Link className="workspace-button" href="/assess">
                    평가 도구 열기
                  </Link>
                </div>
              ) : (
                <>
                  <p className="workspace-caption">
                    전체 {sessions.length}개 중 최근{" "}
                    {Math.min(3, sessions.length)}개
                  </p>
                  <ul className="personal-sessions">
                    {sessions.slice(0, 3).map((session) => (
                      <li key={session.id}>
                        <Link href={`/assess/${session.id}`}>
                          <div>
                            <strong>{session.client_code}</strong>
                            <time dateTime={session.created_at}>
                              {new Date(session.created_at).toLocaleString(
                                "ko-KR",
                                { timeZone: "Asia/Seoul" },
                              )}
                            </time>
                          </div>
                          <span
                            className="session-state"
                            data-done={session.status === "done"}
                          >
                            {session.status === "done" ? "완료" : "진행 중"}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}
        </div>
        <aside className="personal-account" aria-label="계정 및 이용 권한">
          <section className="workspace-panel">
            <p className="workspace-eyebrow">ACCOUNT</p>
            <div className="personal-identity">
              <span className="profile-avatar" aria-hidden="true">
                {initial}
              </span>
              <div>
                <h2>{displayName}</h2>
                <span className="profile-role-badge" data-role={role}>
                  {ROLE_LABEL[role] ?? "회원"}
                </span>
              </div>
            </div>
            <p className="account-email">{user.email}</p>
            <SignOutButton />
            <WithdrawForm />
          </section>
          {role === "admin" && (
            <section className="workspace-panel">
              <h2>서비스 관리</h2>
              <p>
                이용 통계, 콘텐츠와 회원 관리, 치료사 인증 요청을 확인하세요.
              </p>
              <Link className="workspace-button" href="/admin">
                관리자 대시보드 열기
              </Link>
            </section>
          )}
          {role === "member" ? (
            <section className="workspace-panel" id="therapist-access">
              <h2>치료사 인증</h2>
              {isTherapistPending ? (
                <div className="workspace-callout">
                  <strong>인증 요청을 검토 중입니다</strong>
                  <p>
                    요청이 접수되었습니다. 관리자 승인 후 평가 도구를 이용할 수
                    있습니다.
                  </p>
                </div>
              ) : (
                <>
                  <p>
                    면허번호로 인증을 요청하세요. 관리자 승인 후 임상 평가
                    도구인 OTHub Assess를 이용할 수 있습니다.
                  </p>
                  <TherapistRequestForm />
                </>
              )}
            </section>
          ) : (
            canUseAssess && (
              <section className="workspace-panel">
                <h2>평가 도구 이용 가능</h2>
                <p>
                  현재 계정은 OTHub Assess를 이용할 수 있습니다. 평가 기록은
                  세션 목록에서 확인하세요.
                </p>
                <Link className="workspace-text-link" href="/assess">
                  OTHub Assess로 이동 →
                </Link>
              </section>
            )
          )}
        </aside>
      </div>
    </main>
  );
}
