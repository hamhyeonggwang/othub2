import type { CSSProperties } from "react";
import Link from "next/link";
import LandingEffects from "@/components/LandingEffects";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";

const barStyle = (h: string) => ({ "--h": h }) as CSSProperties;
const dotStyle = (x: string, y: string) => ({ "--x": x, "--y": y }) as CSSProperties;

export default async function LandingPage() {
  const { user, profile } = await getCurrentUserAndProfile();

  return (
    <>
      <LandingEffects />
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>

      <header className="site-header" id="top">
        <a className="brand" href="#top" aria-label="OTHub 홈">
          <span className="brand-mark" aria-hidden="true">
            OT
          </span>
          <span>
            <strong>OTHub</strong>
            <small>By OTs, For Everyone</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="주요 메뉴">
          <a href="#about">소개</a>
          <a href="#work">무엇을 할 수 있나요</a>
          <a href="#approach">만드는 방식</a>
        </nav>

        <div className="header-auth">
          <Link className="button button-secondary" href={user ? "/me" : "/login"}>
            {user ? profile?.display_name || "내 정보" : "로그인"}
          </Link>
          <Link className="nav-cta" href="/hub/apps">
            훈련 웹앱 바로가기
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-aurora hero-aurora-one" aria-hidden="true"></div>
          <div className="hero-aurora hero-aurora-two" aria-hidden="true"></div>

          <div className="hero-copy">
            <p className="eyebrow">
              <span></span> BY OTs · FOR EVERYONE
            </p>
            <h1 id="hero-title">
              치료실의 도구를
              <br />
              <em>모두의 플랫폼</em>으로.
            </h1>
            <p className="hero-description">
              작업치료사가 만든 훈련 웹앱과 치료 콘텐츠, 임상 평가 도구를
              <br className="desktop-only" />
              누구나 쓸 수 있는 한곳에 모았습니다.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/hub/apps">
                훈련 웹앱 보기
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <a className="button button-secondary" href="#about">
                OTHub 소개
              </a>
            </div>
            <div className="hero-meta" aria-label="핵심 영역">
              <div>
                <strong>01</strong>
                <span>
                  훈련
                  <br />
                  웹앱
                </span>
              </div>
              <div>
                <strong>02</strong>
                <span>
                  콘텐츠
                  <br />
                  허브
                </span>
              </div>
              <div>
                <strong>03</strong>
                <span>
                  OTHub
                  <br />
                  Assess
                </span>
              </div>
              <div>
                <strong>04</strong>
                <span>
                  Human-led
                  <br />
                  AI
                </span>
              </div>
            </div>
          </div>

          <div
            className="data-space"
            aria-label="OTHub 핵심 영역을 시각화한 대시보드"
            data-parallax-root
          >
            <div className="orbit orbit-one" aria-hidden="true"></div>
            <div className="orbit orbit-two" aria-hidden="true"></div>

            <article className="glass-card mini-card clinical-card" data-depth="0.55">
              <div className="card-heading">
                <span className="icon-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 19V9m5 10V5m5 14v-7m5 7V3" />
                  </svg>
                </span>
                <span>훈련 웹앱</span>
              </div>
              <div className="mini-bars" aria-hidden="true">
                <i style={barStyle("42%")}></i>
                <i style={barStyle("68%")}></i>
                <i style={barStyle("53%")}></i>
                <i style={barStyle("82%")}></i>
                <i style={barStyle("72%")}></i>
              </div>
              <small>키오스크 · 손 인식 · 시선 추적</small>
            </article>

            <article className="glass-card mini-card research-card" data-depth="0.32">
              <div className="card-heading">
                <span className="icon-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6" />
                    <path d="m16 16 4 4M8 11h6M11 8v6" />
                  </svg>
                </span>
                <span>콘텐츠 허브</span>
              </div>
              <div className="donut-row">
                <div className="donut" aria-hidden="true">
                  <span>OT</span>
                </div>
                <p>
                  <strong>Evidence</strong>
                  <br />
                  into practice
                </p>
              </div>
            </article>

            <article className="glass-card system-card" data-depth="0.82">
              <div className="system-topline">
                <div>
                  <p>OTHub SYSTEM MAP</p>
                  <strong>From clinic to everyone</strong>
                </div>
                <span className="live-pill">
                  <i></i> SYSTEM ONLINE
                </span>
              </div>

              <div className="system-chart" aria-label="임상 도구가 플랫폼으로 연결되는 과정">
                <svg viewBox="0 0 520 190" role="img" aria-hidden="true">
                  <defs>
                    <linearGradient id="lineGradient" x1="0" x2="1">
                      <stop offset="0" stopColor="#1747a6" />
                      <stop offset=".55" stopColor="#00a6e9" />
                      <stop offset="1" stopColor="#64d7ff" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#2cbdf2" stopOpacity=".3" />
                      <stop offset="1" stopColor="#2cbdf2" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g className="grid-lines">
                    <path d="M20 35H500M20 80H500M20 125H500M20 170H500" />
                  </g>
                  <path
                    className="area"
                    d="M20 151C55 143 70 108 108 116s43 31 81 17 45-74 92-71 48 63 91 52 48-74 85-71 30 49 43 48V170H20Z"
                  />
                  <path
                    className="chart-line"
                    d="M20 151C55 143 70 108 108 116s43 31 81 17 45-74 92-71 48 63 91 52 48-74 85-71 30 49 43 48"
                  />
                  <circle cx="457" cy="43" r="5" />
                </svg>
                <span className="chart-label">
                  Designed for
                  <br />
                  <strong>real-world use</strong>
                </span>
              </div>

              <div className="system-stats">
                <div>
                  <span>01</span>
                  <strong>Practice</strong>
                  <small>임상에서 도구가 태어납니다</small>
                </div>
                <div>
                  <span>02</span>
                  <strong>Build</strong>
                  <small>웹앱으로 구현합니다</small>
                </div>
                <div>
                  <span>03</span>
                  <strong>Share</strong>
                  <small>모두에게 공개합니다</small>
                </div>
                <div>
                  <span>04</span>
                  <strong>Grow</strong>
                  <small>사용 경험으로 발전합니다</small>
                </div>
              </div>
            </article>

            <article className="glass-card mini-card education-card" data-depth="0.45">
              <div className="card-heading">
                <span className="icon-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m3 8 9-5 9 5-9 5-9-5Z" />
                    <path d="M7 11v5c3 3 7 3 10 0v-5" />
                  </svg>
                </span>
                <span>OTHub Assess</span>
              </div>
              <strong className="big-number">
                8<span>+</span>도구
              </strong>
              <small>치료사 회원 전용 평가 시스템</small>
            </article>

            <article className="glass-card mini-card ai-card" data-depth="0.27">
              <div className="card-heading">
                <span className="icon-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="5" y="5" width="14" height="14" rx="3" />
                    <path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" />
                  </svg>
                </span>
                <span>AI Systems</span>
              </div>
              <div className="pulse-line">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <small>Human-led workflow</small>
            </article>
          </div>

          <a className="scroll-cue" href="#about" aria-label="다음 섹션으로 이동">
            <span>SCROLL TO EXPLORE</span>
            <i></i>
          </a>
        </section>

        <section className="about section" id="about" aria-labelledby="about-title">
          <div className="section-label">01 — ABOUT</div>
          <div className="about-layout">
            <div>
              <p className="eyebrow">
                <span></span> BY OTs, FOR EVERYONE
              </p>
              <h2 id="about-title">
                작업치료사가 만든
                <br />
                <em>모두를 위한</em> 플랫폼
              </h2>
            </div>
            <div className="about-copy">
              <p className="lead">
                OTHub는 작업치료사가 임상 현장에서 직접 만들고 검증한 도구를 한곳에
                모은 플랫폼입니다.
              </p>
              <p>
                키오스크 훈련과 손 인식 게임은 로그인 없이 누구나 바로 사용할 수
                있습니다. 치료사 회원에게는 평가 세션과 결과보고서를 관리하는 임상
                평가 도구(OTHub Assess)를 제공합니다.
              </p>
              <div className="principles">
                <span>Participation-centered</span>
                <span>Evidence-informed</span>
                <span>Open for everyone</span>
                <span>Human-led AI</span>
              </div>
            </div>
          </div>
        </section>

        <section className="work section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <div className="section-label">02 — WHAT YOU CAN DO</div>
              <h2 id="work-title">
                오늘 바로 쓸 수 있는
                <br />
                <em>도구와 콘텐츠</em>
              </h2>
            </div>
            <p>
              치료실, 학교, 가정 어디에서든
              <br />
              필요한 훈련을 바로 시작하세요.
            </p>
          </div>

          <div className="project-grid">
            <article className="project-card project-featured">
              <div className="project-visual linkit-visual" aria-hidden="true">
                <div className="phone-mock">
                  <div className="phone-top"></div>
                  <small>TODAY&apos;S TRAINING</small>
                  <strong>
                    생활 속 과제를
                    <br />
                    연습해요
                  </strong>
                  <div className="mission-row">
                    <i>01</i>
                    <span>메뉴 고르기</span>
                    <b>✓</b>
                  </div>
                  <div className="mission-row">
                    <i>02</i>
                    <span>옵션 선택</span>
                    <b>→</b>
                  </div>
                  <div className="mission-row">
                    <i>03</i>
                    <span>결제하기</span>
                    <b>·</b>
                  </div>
                </div>
              </div>
              <div className="project-body">
                <div className="project-meta">
                  <span>TRAINING WEB APPS · 무료 공개</span>
                  <small>01</small>
                </div>
                <h3>훈련 웹앱 12종</h3>
                <p>
                  편의점·카페·기차역 키오스크 훈련 7종과 손 인식·시선 추적 AI 게임
                  5종. 설치 없이 브라우저에서 바로 실행됩니다.
                </p>
                <div className="project-tags">
                  <span>키오스크</span>
                  <span>손 인식 AI</span>
                  <span>시선 추적</span>
                </div>
                <div className="hero-actions" style={{ marginTop: "18px" }}>
                  <Link className="button button-primary" href="/hub/apps">
                    전체 웹앱 보기
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>

            <article className="project-card">
              <div className="project-visual occupation-visual" aria-hidden="true">
                <div className="flow-panel flow-panel-a">
                  <small>VIDEO</small>
                  <strong>
                    치료 근거
                    <br />
                    콘텐츠
                  </strong>
                  <i></i>
                </div>
                <div className="flow-panel flow-panel-b">
                  <small>INFO</small>
                  <strong>
                    학회·도서
                    <br />
                    큐레이션
                  </strong>
                  <i></i>
                </div>
                <svg viewBox="0 0 500 250">
                  <path d="M65 144C175 40 321 218 438 89" />
                  <circle cx="65" cy="144" r="7" />
                  <circle cx="438" cy="89" r="7" />
                </svg>
              </div>
              <div className="project-body">
                <div className="project-meta">
                  <span>CONTENT HUB</span>
                  <small>02</small>
                </div>
                <h3>콘텐츠 허브</h3>
                <p>
                  감각통합·상지재활·ICF 등 임상 주제 영상과 학회 정보를
                  큐레이션합니다. 회원은 좋아요·댓글·북마크로 참여할 수 있습니다.
                </p>
                <div className="project-tags">
                  <span>영상</span>
                  <span>학회 정보</span>
                  <span>PEO 필터</span>
                </div>
                <div className="hero-actions" style={{ marginTop: "18px" }}>
                  <Link className="button button-primary" href="/hub">
                    콘텐츠 허브 보기
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>

            <article className="project-card">
              <div className="project-visual icf-visual" aria-hidden="true">
                <div className="icf-core">ASSESS</div>
                <span className="node node-one">평가</span>
                <span className="node node-two">기록</span>
                <span className="node node-three">보고서</span>
                <svg viewBox="0 0 400 250">
                  <circle cx="200" cy="125" r="82" />
                  <path d="M200 43 87 180M200 43l113 137M87 180h226" />
                </svg>
              </div>
              <div className="project-body">
                <div className="project-meta">
                  <span>OTHub ASSESS · 치료사 회원 전용</span>
                  <small>03</small>
                </div>
                <h3>임상 평가 도구</h3>
                <p>
                  K-MBI, JTHFT, MACS, K-IADL 등 8종 평가를 세션으로 묶어 진행하고
                  종합 결과보고서를 생성합니다. 치료사 인증 회원에게 제공됩니다.
                </p>
                <div className="project-tags">
                  <span>평가 세션</span>
                  <span>결과보고서</span>
                </div>
                <div className="hero-actions" style={{ marginTop: "18px" }}>
                  <Link className="button button-secondary" href="/assess">
                    OTHub Assess 열기
                  </Link>
                </div>
              </div>
            </article>

            <article className="project-card project-wide">
              <div className="project-visual adl-visual" aria-hidden="true">
                <div className="hand-map">
                  <i style={dotStyle("19%", "48%")}></i>
                  <i style={dotStyle("31%", "32%")}></i>
                  <i style={dotStyle("45%", "26%")}></i>
                  <i style={dotStyle("56%", "35%")}></i>
                  <i style={dotStyle("62%", "53%")}></i>
                  <i style={dotStyle("47%", "65%")}></i>
                  <svg viewBox="0 0 600 260">
                    <path d="M98 150c55-7 77-86 129-76 33 7 22 61 53 66 35 6 46-87 87-79 39 8 13 87 54 93 25 4 40-23 76-2" />
                  </svg>
                </div>
                <div className="tracking-panel">
                  <small>MOTION TRACKING</small>
                  <strong>Hand &amp; Gaze AI</strong>
                  <span>웹캠 기반 손 인식 · 시선 추적 · 수행 데이터</span>
                </div>
              </div>
              <div className="project-body">
                <div className="project-meta">
                  <span>AI TRAINING GAMES · R&amp;D</span>
                  <small>04</small>
                </div>
                <h3>AI 훈련 게임</h3>
                <p>
                  웹캠 기반 손·시선 인식으로 일상생활 과제를 놀이처럼 연습합니다.
                  별도 장비 없이 브라우저와 카메라만으로 시작할 수 있습니다.
                </p>
                <div className="project-tags">
                  <span>MediaPipe</span>
                  <span>Web Game</span>
                  <span>Performance Data</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="approach section" id="approach" aria-labelledby="approach-title">
          <div className="section-label">03 — APPROACH</div>
          <div className="approach-layout">
            <div className="approach-intro">
              <p className="eyebrow">
                <span></span> FROM CLINIC TO EVERYONE
              </p>
              <h2 id="approach-title">
                임상에서 시작해
                <br />
                <em>모두에게 닿는</em> 설계
              </h2>
              <p>
                모든 도구는 치료실의 실제 필요에서 출발합니다. 임상에서 검증한
                뒤에야 플랫폼에 올라옵니다.
              </p>
            </div>

            <ol className="process-list">
              <li>
                <span>01</span>
                <div>
                  <strong>Observe</strong>
                  <p>임상과 일상의 실제 문제를 관찰합니다.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Frame</strong>
                  <p>목적, 사용자, 성공 기준을 명확히 합니다.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Design</strong>
                  <p>사용자 흐름과 데이터, 판단 구조를 설계합니다.</p>
                </div>
              </li>
              <li>
                <span>04</span>
                <div>
                  <strong>Build</strong>
                  <p>작게 구현하고 실제 사용 환경에 연결합니다.</p>
                </div>
              </li>
              <li>
                <span>05</span>
                <div>
                  <strong>Validate</strong>
                  <p>근거와 사용 경험으로 효과를 검증합니다.</p>
                </div>
              </li>
              <li>
                <span>06</span>
                <div>
                  <strong>Share</strong>
                  <p>검증된 도구를 모두에게 공개합니다.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="contact section" id="contact" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true"></div>
          <div className="contact-inner">
            <p className="eyebrow light">
              <span></span> COMING SOON — 회원제 오픈
            </p>
            <h2 id="contact-title">
              곧 회원 기능이
              <br />
              추가됩니다.
            </h2>
            <p>
              좋아요·댓글·북마크, 그리고 치료사 전용 평가 도구까지. 지금은 훈련
              웹앱을 자유롭게 사용해 보세요.
            </p>
            <Link className="button button-light" href="/hub/apps">
              훈련 웹앱 시작하기
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <small className="contact-note">
              문의: <a href="mailto:h2g0614@gmail.com">h2g0614@gmail.com</a>
            </small>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            OT
          </span>
          <span>
            <strong>OTHub</strong>
            <small>By OTs, For Everyone</small>
          </span>
        </a>
        <p>훈련 웹앱 · 콘텐츠 허브 · 임상 평가 도구</p>
        <p>© {new Date().getFullYear()} OTHub</p>
      </footer>
    </>
  );
}
