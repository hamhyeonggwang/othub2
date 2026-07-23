import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import "../../hub/hub.css";
import "../assess.css";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { getSessionWithResults } from "@/lib/supabase/assess";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "평가 결과보고서",
};

export default async function AssessSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login?next=/assess");
  if (!profile || (profile.role !== "therapist" && profile.role !== "admin")) {
    redirect("/me?assess=locked");
  }

  const { sessionId } = await params;
  const data = await getSessionWithResults(sessionId);
  if (!data) notFound();

  const { session, results } = data;
  const meta = session.client_meta ?? {};

  return (
    <>
      <SiteHeader />
      <div className="hub-shell" id="main">
        <Link className="hub-back" href="/assess">
          ← 세션 목록으로
        </Link>

        <div className="assess-report-meta">
          <strong>{session.client_code}</strong>
          {meta.date && ` · 평가일: ${meta.date}`}
          {meta.diagnosis && ` · 진단: ${meta.diagnosis}`}
          {meta.birth && ` · 생년월일: ${meta.birth}`}
          {meta.gender && ` · 성별: ${meta.gender}`}
          <br />
          담당 치료사: {meta.therapist || "-"} · 저장:{" "}
          {new Date(session.updated_at).toLocaleString("ko-KR")}
        </div>

        {results.length === 0 && (
          <p className="hub-empty">저장된 평가 결과가 없습니다.</p>
        )}

        {results.map((r) => (
          <section key={r.id} className="assess-report-section">
            <h2>{r.raw?.title || r.tool_id}</h2>
            <div
              className="assess-report-body"
              dangerouslySetInnerHTML={{ __html: r.raw?.html || "" }}
            />
          </section>
        ))}
      </div>
    </>
  );
}
