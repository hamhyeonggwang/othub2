import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import "../../hub/hub.css";
import "../assess.css";
import "./ef-records.css";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { EF_TASKS, EF_TASK_LABEL, EF_TREND_METRIC, SUBJECT_CODE_PATTERN, type EfTask } from "@/lib/ef-session";
import DeleteEfSession from "./DeleteEfSession";

export const metadata: Metadata = {
  title: "실행기능 과제 기록",
  robots: { index: false, follow: false },
};

interface Row {
  id: string;
  subject_code: string;
  task: EfTask;
  summary: Record<string, unknown>;
  started_at: string;
}

/** 회기별 대표 지표를 잇는 작은 꺾은선 (규준 없음 — 같은 대상자의 변화만 본다) */
function Trend({ rows, task }: { rows: Row[]; task: EfTask }) {
  const metric = EF_TREND_METRIC[task];
  const pts = rows
    .map((r) => ({ v: metric.pick(r.summary), d: new Date(r.started_at) }))
    .filter((p): p is { v: number; d: Date } => p.v !== null)
    .sort((a, b) => a.d.getTime() - b.d.getTime());
  if (pts.length === 0) return <p className="ef-rec-empty">그래프로 볼 값이 없습니다.</p>;
  const W = 560, H = 180, P = 32;
  const min = Math.min(...pts.map((p) => p.v)), max = Math.max(...pts.map((p) => p.v));
  const span = max - min || 1;
  const x = (i: number) => (pts.length === 1 ? W / 2 : P + (i * (W - 2 * P)) / (pts.length - 1));
  const y = (v: number) => H - P - ((v - min) / span) * (H - 2 * P);
  const fmt = (v: number) => `${v}${metric.unit}`;
  return (
    <figure className="ef-rec-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${metric.label} 회기별 변화: ${pts.map((p) => fmt(p.v)).join(", ")}`}>
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} className="axis" />
        <polyline points={pts.map((p, i) => `${x(i)},${y(p.v)}`).join(" ")} className="line" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.v)} r={5} className="dot" />
            <text x={x(i)} y={y(p.v) - 10} textAnchor="middle" className="val">{fmt(p.v)}</text>
            <text x={x(i)} y={H - 10} textAnchor="middle" className="date">{p.d.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}</text>
          </g>
        ))}
      </svg>
      <figcaption>{metric.label} · 회기 {pts.length}개</figcaption>
    </figure>
  );
}

export default async function EfRecordsPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login?next=/assess/ef");
  if (!profile || (profile.role !== "therapist" && profile.role !== "admin")) redirect("/me?assess=locked");

  const { code: rawCode } = await searchParams;
  const code = rawCode && SUBJECT_CODE_PATTERN.test(rawCode) ? rawCode : null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("othub_ef_sessions")
    .select("id, subject_code, task, summary, started_at")
    .order("started_at", { ascending: false })
    .limit(1000);
  const rows = (data ?? []) as Row[];

  const subjects = [...new Map(rows.map((r) => [r.subject_code, r])).values()].map((r) => ({
    code: r.subject_code,
    count: rows.filter((x) => x.subject_code === r.subject_code).length,
    last: r.started_at,
  }));
  const mine = code ? rows.filter((r) => r.subject_code === code) : [];

  return (
    <div className="hub-shell" id="main">
      <Link className="hub-back" href={code ? "/assess/ef" : "/assess"}>
        {code ? "← 대상자 목록" : "← OTHub Assess"}
      </Link>
      <div className="assess-hero">
        <div>
          <h2>{code ? `대상자 ${code}` : "실행기능 과제 기록"}</h2>
          <p>
            실행기능 훈련 과제에서 저장한 결과입니다. 규준이 없는 훈련 기록이므로 같은 대상자의
            회기별 변화를 보는 용도로만 쓰고, 정상 여부를 판정하지 마세요.
          </p>
        </div>
        <Link className="button button-secondary" href="/collections/executive-function">과제 열기</Link>
      </div>

      {!code && (
        <>
          <h3 className="feed-section-title">대상자 ({subjects.length})</h3>
          {subjects.length === 0 ? (
            <p className="hub-empty">
              아직 저장한 기록이 없습니다. 과제를 마친 뒤 결과 화면의 &lsquo;치료사 보기&rsquo;에서 대상자 코드로 저장하세요.
            </p>
          ) : (
            <div className="assess-session-list">
              {subjects.map((s) => (
                <Link key={s.code} className="assess-session-card" href={`/assess/ef?code=${encodeURIComponent(s.code)}`}>
                  <div>
                    <strong>{s.code}</strong>
                    <span>기록 {s.count}개 · 마지막 {new Date(s.last).toLocaleString("ko-KR")}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {code && mine.length === 0 && <p className="hub-empty">이 대상자 코드로 저장한 기록이 없습니다.</p>}
      {code &&
        EF_TASKS.filter((t) => mine.some((r) => r.task === t)).map((task) => {
          const list = mine.filter((r) => r.task === task);
          const metric = EF_TREND_METRIC[task];
          return (
            <section key={task} className="ef-rec-task" aria-labelledby={`t-${task}`}>
              <h3 id={`t-${task}`} className="feed-section-title">{EF_TASK_LABEL[task]}</h3>
              <Trend rows={list} task={task} />
              <div className="ef-rec-table-wrap">
                <table className="ef-rec-table">
                  <thead>
                    <tr><th scope="col">일시</th><th scope="col">{metric.label}</th><th scope="col">시행 기록</th><th scope="col"><span className="sr-only">삭제</span></th></tr>
                  </thead>
                  <tbody>
                    {list.map((r) => {
                      const v = metric.pick(r.summary);
                      return (
                        <tr key={r.id}>
                          <td>{new Date(r.started_at).toLocaleString("ko-KR")}{r.summary.aborted ? " (중간 종료)" : ""}</td>
                          <td>{v === null ? "–" : `${v}${metric.unit}`}</td>
                          <td><a href={`/api/ef/sessions/${r.id}`}>CSV</a></td>
                          <td><DeleteEfSession id={r.id} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
    </div>
  );
}
