import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import "../hub/hub.css";
import "./assess.css";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { getMySessions } from "@/lib/supabase/assess";

export const metadata: Metadata = {
  title: "OTHub Assess",
  description: "치료사 회원 전용 임상 평가 도구.",
};

const TOOL_LABEL: Record<string, string> = {
  profiling: "작업수행 프로파일링",
  otipm: "수행분석 (OTIPM)",
  jthft: "JTHFT",
  macs: "MACS",
  clinical: "HFT 임상관찰",
  sensory: "감각운동협응",
  mbi: "K-MBI",
  "k-iadl": "K-IADL",
};

export default async function AssessHomePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login?next=/assess");
  if (!profile || (profile.role !== "therapist" && profile.role !== "admin")) {
    redirect("/me?assess=locked");
  }

  const sessions = await getMySessions();

  return (
    <div className="hub-shell">
      <Link className="hub-back" href="/">
        ← OTHub 홈으로
      </Link>

      <div className="assess-hero">
        <div>
          <h2>OTHub Assess</h2>
          <p>
            작업수행 프로파일링, OTIPM, JTHFT, MACS, HFT 임상관찰, 감각운동협응,
            K-MBI, K-IADL 등 8종 평가를 세션으로 진행하고 결과보고서를 저장합니다.
          </p>
        </div>
        <a className="button button-primary" href="/assess/hub.html">
          새 평가 시작
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      <h3 className="feed-section-title">저장된 세션 ({sessions.length})</h3>
      <div className="assess-session-list">
        {sessions.length === 0 && (
          <p className="hub-empty">
            아직 저장된 평가 세션이 없습니다. &quot;새 평가 시작&quot;으로
            첫 세션을 진행해 보세요.
          </p>
        )}
        {sessions.map((s) => (
          <Link key={s.id} className="assess-session-card" href={`/assess/${s.id}`}>
            <div>
              <strong>{s.client_code}</strong>
              <span>
                {s.tools.map((t) => TOOL_LABEL[t] || t).join(", ")} ·{" "}
                {new Date(s.created_at).toLocaleString("ko-KR")}
              </span>
            </div>
            <span className="assess-session-status">
              {s.status === "done" ? "완료" : "진행 중"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
