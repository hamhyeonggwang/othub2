import type { Metadata } from "next";
import Link from "next/link";
import "../hub/hub.css";
import "../auth/auth.css";
import "./admin.css";
import {
  requireAdmin,
  getTherapistRequests,
  getMembers,
  getAllContent,
  getRecentComments,
  getEngagementSummary,
  getAssessStats,
} from "@/lib/supabase/admin";
import {
  approveTherapist,
  rejectTherapist,
  adminDeleteComment,
  toggleContentStatus,
  deleteContent,
} from "@/app/actions/admin";
import ContentForm from "./ContentForm";
import { TYPE_LABEL } from "@/lib/supabase/content-types";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "관리자",
};

const TABS = [
  { key: "requests", label: "인증 요청" },
  { key: "content", label: "콘텐츠" },
  { key: "members", label: "회원" },
  { key: "engagement", label: "참여" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const ROLE_LABEL: Record<string, string> = {
  member: "일반",
  therapist: "치료사",
  admin: "관리자",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; edit?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const tab: TabKey = (TABS.find((t) => t.key === params.tab)?.key ?? "requests") as TabKey;

  return (
    <>
      <SiteHeader />
      <div className="hub-shell" id="main">
      <Link className="hub-back" href="/">
        ← OTHub 홈으로
      </Link>
      <h1 className="hub-title">관리자 대시보드</h1>

      <nav className="admin-tabs" aria-label="관리 영역">
        {TABS.map((t) => (
          <Link
            key={t.key}
            className="admin-tab"
            data-active={tab === t.key}
            href={`/admin?tab=${t.key}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === "requests" && <RequestsTab />}
      {tab === "content" && <ContentTab editSlug={params.edit} />}
      {tab === "members" && <MembersTab />}
      {tab === "engagement" && <EngagementTab />}
      </div>
    </>
  );
}

async function RequestsTab() {
  const requests = await getTherapistRequests();

  return (
    <div className="admin-table-wrap">
      {requests.length === 0 ? (
        <p className="admin-empty">대기 중인 치료사 인증 요청이 없습니다.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>면허번호</th>
              <th>소속</th>
              <th>요청일</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.display_name || "(이름 없음)"}</td>
                <td>{r.license_no}</td>
                <td>{r.org || "-"}</td>
                <td>
                  {r.therapist_requested_at
                    ? new Date(r.therapist_requested_at).toLocaleDateString("ko-KR")
                    : "-"}
                </td>
                <td>
                  <form className="admin-inline" action={approveTherapist.bind(null, r.id)}>
                    <button className="admin-btn admin-btn-approve" type="submit">
                      승인
                    </button>
                  </form>
                  <form className="admin-inline" action={rejectTherapist.bind(null, r.id)}>
                    <button className="admin-btn admin-btn-danger" type="submit">
                      반려
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

async function ContentTab({ editSlug }: { editSlug?: string }) {
  const items = await getAllContent();
  const editing = editSlug ? (items.find((i) => i.slug === editSlug) ?? null) : null;

  return (
    <>
      <ContentForm editing={editing} />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>타입</th>
              <th>상태</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.title}
                  <br />
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>{item.slug}</span>
                </td>
                <td>{TYPE_LABEL[item.type]}</td>
                <td>
                  <span className="admin-badge" data-kind={item.status}>
                    {item.status === "published" ? "게시됨" : "임시저장"}
                  </span>
                </td>
                <td>
                  <a className="admin-btn admin-btn-ghost" href={`/admin?tab=content&edit=${item.slug}`}>
                    수정
                  </a>
                  <form
                    className="admin-inline"
                    action={toggleContentStatus.bind(null, item.id, item.status !== "published")}
                  >
                    <button className="admin-btn admin-btn-ghost" type="submit">
                      {item.status === "published" ? "비공개" : "게시"}
                    </button>
                  </form>
                  <form className="admin-inline" action={deleteContent.bind(null, item.id)}>
                    <button className="admin-btn admin-btn-danger" type="submit">
                      삭제
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

async function MembersTab() {
  const [{ members, countsByRole }, assess] = await Promise.all([
    getMembers(),
    getAssessStats(),
  ]);

  return (
    <>
      <div className="admin-stat-row">
        <div className="admin-stat">
          <strong>{members.length}</strong>
          <span>전체 회원</span>
        </div>
        <div className="admin-stat">
          <strong>{countsByRole.therapist ?? 0}</strong>
          <span>치료사 회원</span>
        </div>
        <div className="admin-stat">
          <strong>{countsByRole.member ?? 0}</strong>
          <span>일반 회원</span>
        </div>
        <div className="admin-stat">
          <strong>{assess.total}</strong>
          <span>평가 세션 (7일 {assess.last7d})</span>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>역할</th>
              <th>소속</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.display_name || "(이름 없음)"}</td>
                <td>{ROLE_LABEL[m.role]}</td>
                <td>{m.org || "-"}</td>
                <td>{new Date(m.created_at).toLocaleDateString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

async function EngagementTab() {
  const [summary, comments] = await Promise.all([
    getEngagementSummary(),
    getRecentComments(),
  ]);

  return (
    <>
      <h3 className="feed-section-title">콘텐츠별 참여 상위</h3>
      <div className="admin-table-wrap" style={{ marginBottom: 28 }}>
        {summary.length === 0 ? (
          <p className="admin-empty">아직 좋아요·댓글이 없습니다.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>콘텐츠</th>
                <th>좋아요</th>
                <th>댓글</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={row.title}>
                  <td>{row.title}</td>
                  <td>{row.likes}</td>
                  <td>{row.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h3 className="feed-section-title">최근 댓글</h3>
      <div className="admin-table-wrap">
        {comments.length === 0 ? (
          <p className="admin-empty">댓글이 없습니다.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>작성자</th>
                <th>내용</th>
                <th>콘텐츠</th>
                <th>작성일</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c.id}>
                  <td>{c.authorName}</td>
                  <td style={{ maxWidth: 320, wordBreak: "break-word" }}>{c.body}</td>
                  <td>{c.contentTitle}</td>
                  <td>{new Date(c.created_at).toLocaleDateString("ko-KR")}</td>
                  <td>
                    <form className="admin-inline" action={adminDeleteComment.bind(null, c.id)}>
                      <button className="admin-btn admin-btn-danger" type="submit">
                        삭제
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
