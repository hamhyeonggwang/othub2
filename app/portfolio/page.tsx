import type { Metadata } from "next";
import Link from "next/link";
import "../hub/hub.css";
import "../auth/auth.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "함형광",
  description: "작업치료사 함형광의 소개, 경력, 학력.",
};

const CAREER = [
  {
    period: "2016.06 ~ 현재",
    title: "푸르메재단 넥슨어린이재활병원",
    desc: "작업치료팀 작업치료사",
  },
  { period: "2015", title: "국민건강보험공단 일산병원", desc: "" },
  {
    period: "2013 ~ 2014",
    title: "연세의료원 재활병원",
    desc: "소아작업치료팀 작업치료사",
  },
];

const ACTIVITIES = [
  { period: "2026.01 ~ 현재", title: "대한작업치료학회", desc: "이사" },
  { period: "2016 ~ 현재", title: "대한아동학교작업치료학회", desc: "이사" },
  {
    period: "2014 ~ 현재",
    title: "대한작업치료사협회 서울특별시회",
    desc: "이사",
  },
];

const EDUCATION = [
  { period: "2019 ~", title: "강원대학교 대학원", desc: "작업치료학과 석사과정" },
  { period: "2007 ~ 2013", title: "작업치료학과", desc: "학사" },
];

const AWARDS = [
  { period: "2020", title: "대한작업치료사협회 서울지회장 표창", desc: "" },
  { period: "2013", title: "대한작업치료사협회 협회장 표창", desc: "" },
];

export default function PortfolioPage() {
  return (
    <>
      <SiteHeader />
      <div className="hub-shell" id="main">
        <Link className="hub-back" href="/about">
          ← OTHub 소개로
        </Link>

        <div className="profile-card" style={{ marginTop: 20, maxWidth: 640 }}>
          <div className="profile-header">
            <span className="profile-avatar">함</span>
            <div>
              <strong style={{ display: "block", color: "var(--navy)", fontSize: 22 }}>
                함형광
              </strong>
              <span className="profile-role-badge" data-role="therapist">
                작업치료사 · 작가
              </span>
            </div>
          </div>
          <p className="hint" style={{ marginTop: 16 }}>
            소아 재활 현장에서 일하며 OTHub를 만들고 운영합니다.
          </p>
        </div>

        <section className="about-section" aria-labelledby="career-title">
          <h2 id="career-title">경력</h2>
          <ol className="timeline">
            {CAREER.map((c) => (
              <li key={c.title}>
                <span>{c.period}</span>
                <div>
                  <strong>{c.title}</strong>
                  {c.desc && <p>{c.desc}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section" aria-labelledby="activity-title">
          <h2 id="activity-title">협회·학회 활동</h2>
          <ol className="timeline">
            {ACTIVITIES.map((a) => (
              <li key={a.title}>
                <span>{a.period}</span>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section" aria-labelledby="edu-title">
          <h2 id="edu-title">학력</h2>
          <ol className="timeline">
            {EDUCATION.map((e) => (
              <li key={e.title}>
                <span>{e.period}</span>
                <div>
                  <strong>{e.title}</strong>
                  <p>{e.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section" aria-labelledby="award-title">
          <h2 id="award-title">수상</h2>
          <ol className="timeline">
            {AWARDS.map((a) => (
              <li key={a.title}>
                <span>{a.period}</span>
                <div>
                  <strong>{a.title}</strong>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section" aria-labelledby="link-title">
          <h2 id="link-title">링크</h2>
          <p className="lead">
            브런치 · 인스타그램 ·{" "}
            <a href="mailto:h2g0614@gmail.com">h2g0614@gmail.com</a>
          </p>
        </section>
      </div>
    </>
  );
}
