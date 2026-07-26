import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "../hub/hub.css";
import "../../auth/auth.css";

export const metadata: Metadata = {
  title: "함형광",
  description: "작업치료사 함형광의 소개, 경력, 학력.",
};

const CLINICAL_CAREER = [
  {
    period: "2016.06 ~ 현재",
    title: "푸르메재단 넥슨어린이재활병원",
    desc: "작업치료팀, 학령기치료팀 팀장",
  },
  {
    period: "2015",
    title: "국민건강보험공단 일산병원",
    desc: "소아작업치료팀",
  },
  {
    period: "2013 ~ 2014",
    title: "연세의료원 재활병원",
    desc: "소아작업치료팀",
  },
];

const OTHER_CAREER = [
  { period: "2018 ~", title: "RTL 작업치료사 독서모임", desc: "대표" },
  { period: "2018 ~", title: "IL 장애인 자립지원센터", desc: "건강증진프로그램" },
  {
    period: "2019 ~ 2021",
    title: "장애인권 및 보건의료 프리랜서 기자",
    desc: "",
  },
  { period: "2025 ~ 2026", title: "동남보건대학교", desc: "외래 강사" },
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
  { period: "2019 ~ 2021", title: "강원대학교 대학원", desc: "작업치료학과 석사수료" },
  { period: "2007 ~ 2013", title: "작업치료학과", desc: "학사" },
];

const AWARDS = [
  { period: "2023", title: "서울시의료기사연합회 연합회장 표창", desc: "" },
  { period: "2020", title: "대한작업치료사협회 서울지회장 표창", desc: "" },
  { period: "2013", title: "대한작업치료사협회 협회장 표창", desc: "" },
];

const BOOKS = [
  {
    title: "나의 작업치료, 당신의 작업",
    desc: "작업치료의 본질과 실무를 다룬 공저 도서. 작업치료사의 경험과 지혜를 담아 작업치료의 가치와 의미를 전달하는 실무 중심의 인문서.",
    url: "https://www.aladin.co.kr/m/mproduct.aspx?itemid=282033239&srsltid=afmboorhdqb5xjp4ufhyn-r05lpvriqrqo1lnlpj_o_9fve9969gm2xj",
  },
  {
    title: "감각통합 - 감각처리장애와 중재",
    desc: "감각처리장애와 중재에 대한 전문 도서. 감각통합 이론과 실제 중재 방법을 체계적으로 정리한 감각통합 치료의 핵심 지침서.",
    url: "https://www.nrbooks.kr/goods/goods_detail.php?code=&part=&pos=1&sort_flag=1&sort_list=30&scale=30&search_key=%EA%B0%90%EA%B0%81%ED%86%B5%ED%95%A9&page=0&idx=1833",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <div className="hub-shell" id="main">
        <Link className="hub-back" href="/about">
          ← OTHub 소개로
        </Link>

        <div className="profile-card" style={{ marginTop: 20, maxWidth: 640 }}>
          <div className="profile-header">
            <span className="profile-avatar profile-avatar-photo">
              <Image
                src="/profile/ham-hyeonggwang.jpg"
                alt="함형광"
                width={56}
                height={56}
                priority
              />
            </span>
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

        <section className="about-section" aria-labelledby="greeting-title">
          <p className="eyebrow">
            <span></span> GREETING
          </p>
          <h2 id="greeting-title">인사말</h2>
          <p className="lead">
            안녕하세요.
            <br />
            삶을 디자인하는 작업치료사, 함형광입니다.
          </p>
          <p>
            작업치료는 기능을 회복하는 일을 넘어,
            <br />
            삶의 의미를 다시 세우는 과정이라 믿습니다.
            <br />
            병원 안에서 시작되는 존재에 대한 생각의 변화가
            <br />
            학교와 지역, 그리고 사회로 이어지길 바랍니다.
            <br />
            사람의 가능성은 데이터가 아닌
            <br />
            함께하는 이야기에서 시작된다고 믿습니다.
          </p>
          <p>
            그 이야기가 &lsquo;실천&rsquo;되고 다시 &lsquo;참여&rsquo;로 이어질 때,
            <br />
            우리는 진짜 변화를 만납니다.
          </p>
          <p>
            언제나 &lsquo;사람&rsquo;의 존재와 가능성을 듣고싶습니다.
            <br />
            편하게 연락 주세요. 함께 나누는 대화가 또 하나의 시작이 되길
            바랍니다.
          </p>
        </section>

        <section className="about-section" aria-labelledby="career-title">
          <h2 id="career-title">임상경력</h2>
          <ol className="timeline">
            {CLINICAL_CAREER.map((c) => (
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

        <section className="about-section" aria-labelledby="other-career-title">
          <h2 id="other-career-title">기타경력</h2>
          <ol className="timeline">
            {OTHER_CAREER.map((c) => (
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

        <section className="about-section" aria-labelledby="books-title">
          <h2 id="books-title">도서</h2>
          <div className="hub-grid">
            {BOOKS.map((book) => (
              <a
                key={book.title}
                className="hub-card"
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3>{book.title}</h3>
                <p>{book.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="about-section" aria-labelledby="link-title">
          <h2 id="link-title">링크</h2>
          <p className="lead">
            <a href="https://brunch.co.kr/@starlight-daddy" target="_blank" rel="noopener noreferrer">
              브런치
            </a>{" "}
            ·{" "}
            <a href="https://www.instagram.com/starlight_daddy/" target="_blank" rel="noopener noreferrer">
              인스타그램
            </a>{" "}
            · <a href="mailto:h2g0614@gmail.com">h2g0614@gmail.com</a>
          </p>
        </section>
      </div>
    </>
  );
}
