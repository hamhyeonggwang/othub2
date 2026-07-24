import type { Metadata } from "next";
import Link from "next/link";
import "../hub/hub.css";
import SiteHeader from "@/components/SiteHeader";
import { getPublishedContent } from "@/lib/supabase/content";
import { PROJECT_STATUS, PROJECT_STATUS_LABEL } from "@/lib/supabase/content-types";

export const metadata: Metadata = {
  title: "Project",
  description: "치료실의 문제를 새로운 기술로 실험하는 진행 중인 프로젝트들.",
};

const STATUS_EXPLAIN: { status: keyof typeof PROJECT_STATUS_LABEL; desc: string }[] = [
  { status: "concept", desc: "아이디어 단계, 아직 구현 전입니다." },
  { status: "research", desc: "방법을 검증하는 중입니다." },
  { status: "beta", desc: "일부 치료사와 함께 테스트하고 있습니다." },
  { status: "available", desc: "검증을 마치고 도구로 공개됐습니다." },
];

export default async function LabPage() {
  const projects = (await getPublishedContent()).filter((item) => item.type === "project");

  return (
    <>
      <SiteHeader />
      <div className="hub-shell" id="main">
        <Link className="hub-back" href="/">
          ← OTHub 홈으로
        </Link>

        <div className="hub-header">
          <p className="eyebrow">
            <span></span> OTHUB PROJECT
          </p>
          <h1 className="hub-title">
            치료실의 문제를
            <br />
            새로운 기술로 실험합니다.
          </h1>
          <p className="hub-desc">
            아직 다듬는 중인 것들이에요. 검증을 마치면 도구로 공개해서{" "}
            <Link href="/hub/apps">Tool</Link>이나 OTHub Assess 같은
            정식 도구가 됩니다.
          </p>
        </div>

        <div className="lab-status-legend">
          {STATUS_EXPLAIN.map((s) => (
            <div key={s.status}>
              <span className="lab-status" data-status={s.status}>
                {PROJECT_STATUS_LABEL[s.status]}
              </span>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="hub-grid">
          {projects.length === 0 && (
            <p className="hub-empty">진행 중인 프로젝트가 아직 없습니다.</p>
          )}
          {projects.map((project) => {
            const status = PROJECT_STATUS[project.slug] ?? "concept";
            return (
              <div key={project.id} className="hub-card hub-card-locked">
                <span className="lab-status" data-status={status}>
                  {PROJECT_STATUS_LABEL[status]}
                </span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="hub-card-tags">
                  {[...project.tags, ...project.peo_tags].map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
