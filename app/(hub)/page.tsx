import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import LandingEffects from "@/components/LandingEffects";
import BrandMark from "@/components/BrandMark";
import "./hub/hub.css";
import { COLLECTIONS } from "@/lib/collections";

const barStyle = (h: string) => ({ "--h": h }) as CSSProperties;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://othub.kr/#organization",
      name: "OTHub",
      url: "https://othub.kr",
      logo: "https://othub.kr/brand/othub-mark.png",
      description:
        "작업치료사가 만든 모두를 위한 플랫폼. 훈련 웹앱, 치료 콘텐츠, 임상 평가 도구를 한곳에서.",
    },
    {
      "@type": "WebSite",
      "@id": "https://othub.kr/#website",
      url: "https://othub.kr",
      name: "OTHub",
      inLanguage: "ko",
      publisher: { "@id": "https://othub.kr/#organization" },
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="ot-landing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <LandingEffects />

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-aurora hero-aurora-one" aria-hidden="true"></div>
          <div className="hero-aurora hero-aurora-two" aria-hidden="true"></div>

          <div className="hero-copy">
            <p className="eyebrow">
              <span></span> 평범한 OT의 지식 플랫폼
            </p>
            <h1 id="hero-title">
              아이디어를
              <br />
              만듭니다
              <br />
              <em>누구나 바로</em>
              <br />
              참여할 수 있도록
            </h1>
            <p className="hero-description">
              작업치료사의 작업 플랫폼에 오신 것을 환영합니다
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/hub/apps">
                도구 찾기
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="button button-secondary" href="/about">
                OTHub 알아보기
              </Link>
            </div>
            <div className="trust-stats" aria-label="OTHub 현황">
              <div>
                <strong>14</strong>
                <small>훈련 웹앱</small>
              </div>
              <div>
                <strong>8+</strong>
                <small>평가 도구</small>
              </div>
              <div>
                <strong>0</strong>
                <small>설치 필요</small>
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

            <Link href="/hub/apps" className="glass-card mini-card clinical-card" data-depth="0.55">
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
            </Link>

            <Link href="/hub" className="glass-card mini-card research-card" data-depth="0.32">
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
            </Link>

            <Link href="/about" className="glass-card system-card laptop-card" data-depth="0.82">
              <span className="live-pill laptop-badge">
                <i></i> 함께 만드는 중
              </span>
              <div className="laptop-mock">
                <div className="laptop-screen">
                  <video
                    className="laptop-video"
                    autoPlay
                    muted
                    playsInline
                    aria-label="OTHub 로고 인트로 영상"
                  >
                    <source src="/brand/logo-intro.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
              <div className="laptop-stand" aria-hidden="true"></div>
            </Link>

            <Link href="/assess" className="glass-card mini-card education-card" data-depth="0.45">
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
            </Link>

            <Link href="/hub/apps?cat=hand" className="glass-card mini-card ai-card" data-depth="0.27">
              <div className="card-heading">
                <span className="icon-wrap">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="5" y="5" width="14" height="14" rx="3" />
                    <path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" />
                  </svg>
                </span>
                <span>AI 훈련 게임</span>
              </div>
              <div className="pulse-line">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <small>사람이 중심인 AI</small>
            </Link>
          </div>

          <a className="scroll-cue" href="#quickstart" aria-label="다음 섹션으로 이동">
            <span>SCROLL TO EXPLORE</span>
            <i></i>
          </a>
        </section>

        <section className="quickstart-section section" id="quickstart" aria-labelledby="quickstart-title">
          <div className="quickstart-heading">
            <h2 id="quickstart-title">무엇을 하러 오셨나요?</h2>
          </div>
          <div className="quickstart-grid">
            <Link className="quickstart-card" href="/hub/apps">
              <span className="quickstart-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19V9m5 10V5m5 14v-7m5 7V3" />
                </svg>
              </span>
              <h3>훈련하기</h3>
              <p>생활 속 과제와 기능을 연습합니다.</p>
              <span className="quickstart-cta">
                훈련 도구
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>

            <Link className="quickstart-card" href="/assess">
              <span className="quickstart-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="m3 8 9-5 9 5-9 5-9-5Z" />
                  <path d="M7 11v5c3 3 7 3 10 0v-5" />
                </svg>
              </span>
              <h3>평가하기</h3>
              <p>평가를 기록하고 결과를 확인합니다.</p>
              <span className="quickstart-cta">
                OTHub Assess
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>

            <Link className="quickstart-card" href="/hub">
              <span className="quickstart-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m16 16 4 4M8 11h6M11 8v6" />
                </svg>
              </span>
              <h3>자료 찾기</h3>
              <p>임상에 필요한 근거와 자료를 찾습니다.</p>
              <span className="quickstart-cta">
                콘텐츠 탐색
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </section>

        <section className="section" id="tools" aria-labelledby="tools-title">
          <div className="section-heading">
            <div>
              <div className="section-label">01 — FEATURED TOOLS</div>
              <h2 id="tools-title">
                지금 바로
                <br />
                <em>써볼 수 있어요</em>
              </h2>
            </div>
            <p>
              14개 훈련 웹앱과 8종 평가 도구 중<br />
              추천 도구 몇 가지를 먼저 소개합니다.
            </p>
          </div>

          <div className="hub-grid">
            <Link className="hub-card" href="/hub/apps/cu-kiosk-trainer">
              <span className="hub-card-badge">클릭만으로 가능</span>
              <h3>CU 편의점 셀프계산대 훈련</h3>
              <p>편의점 셀프계산대에서 바코드 스캔부터 결제까지 단계별로 연습합니다.</p>
              <div className="hub-card-tags">
                <span>키오스크</span>
                <span>I-ADL</span>
              </div>
            </Link>

            <Link className="hub-card" href="/hub/apps/korail-kiosk-trainer">
              <span className="hub-card-badge">클릭만으로 가능</span>
              <h3>코레일 승차권 키오스크 훈련</h3>
              <p>기차역 발권기에서 노선·시간·좌석을 선택해 승차권을 예매하는 과정을 연습합니다.</p>
              <div className="hub-card-tags">
                <span>키오스크</span>
                <span>이동</span>
              </div>
            </Link>

            <Link className="hub-card" href="/hub/apps/airdrawing">
              <span className="hub-card-badge">카메라 필요</span>
              <h3>에어 드로잉</h3>
              <p>웹캠 손 인식으로 허공에 그림을 그리며 상지 조절과 시지각 협응을 훈련합니다.</p>
              <div className="hub-card-tags">
                <span>손 인식 AI</span>
                <span>상지기능</span>
              </div>
            </Link>

            <Link className="hub-card" href="/hub/apps/gazeplay-stars">
              <span className="hub-card-badge">카메라 필요</span>
              <h3>GazePlay 별자리 그리기</h3>
              <p>시선 이동으로 별을 이어 별자리를 완성하며 안구 운동 조절을 훈련합니다.</p>
              <div className="hub-card-tags">
                <span>시선 추적</span>
                <span>집중</span>
              </div>
            </Link>

            <Link className="hub-card" href="/assess">
              <span className="hub-card-badge">OTHub ASSESS · 치료사 전용</span>
              <h3>OTHub Assess</h3>
              <p>K-MBI, JTHFT, MACS, K-IADL 등 8종 평가를 세션으로 진행하고 결과보고서를 생성합니다.</p>
              <div className="hub-card-tags">
                <span>평가 세션</span>
                <span>결과보고서</span>
              </div>
            </Link>
          </div>

          <div className="hero-actions" style={{ marginTop: "28px" }}>
            <Link className="button button-secondary" href="/hub/apps">
              전체 웹앱 보기
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </section>

        <section className="section" id="collections" aria-labelledby="collections-title">
          <div className="section-label">02 — COLLECTIONS</div>
          <h2 id="collections-title" style={{ margin: "0 0 32px" }}>
            하나의 문제를
            <br />
            <em>여러 도구</em>로 해결하세요.
          </h2>

          {COLLECTIONS.map((collection) => (
            <div key={collection.slug} className="collection-card">
              <div>
                <p className="eyebrow light">
                  <span></span> {collection.eyebrow}
                </p>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <div className="collection-stats">
                  <span>{collection.appSlugs.length} Tools</span>
                  {collection.assessNote && <span>K-IADL 평가 포함</span>}
                </div>
                <Link className="button button-light" href={`/collections/${collection.slug}`}>
                  {collection.title} 자세히 보기
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="about section" id="about" aria-labelledby="about-title">
          <div className="section-label">03 — ABOUT</div>
          <div className="about-layout">
            <div>
              <p className="eyebrow">
                <span></span> 작업치료사가 만들고, 작업치료사가 씁니다
              </p>
              <h2 id="about-title">
                편하게 나누고
                <br />
                <em>같이 써보는</em> 공간
              </h2>
            </div>
            <div className="about-copy">
              <p className="lead">
                OTHub는 작업치료사들이 현장에서 아이디어를 서로 나누고, 함께
                다듬어가는 공간입니다.
              </p>
              <p>
                키오스크 훈련과 손 인식 게임은 로그인 없이 누구나 바로 써볼 수
                있어요. 치료사 회원이 되면 평가 세션과 결과보고서를 관리하는
                평가 도구(OTHub Assess)도 편하게 이용할 수 있습니다.
              </p>
              <div className="principles">
                <span>다 함께 참여해요</span>
                <span>현장에서 검증했어요</span>
                <span>누구에게나 열려있어요</span>
                <span>사람이 중심인 AI</span>
              </div>
            </div>
          </div>
        </section>

        <section className="contact section" id="contact" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true"></div>
          <div className="contact-inner">
            <p className="eyebrow light">
              <span></span> 지금 바로 시작하세요 — 회원제 오픈
            </p>
            <h2 id="contact-title">
              함께 나누는
              <br />
              기능을 만나보세요.
            </h2>
            <p>
              좋아요·댓글·북마크로 서로의 노하우를 나누고, 치료사 인증을
              받으면 OTHub Assess까지 이용할 수 있어요.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link className="button button-light" href="/login">
                Google로 시작하기
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className="button button-outline-light" href="/hub/apps">
                훈련 웹앱 먼저 둘러보기
              </Link>
            </div>
            <small className="contact-note">
              문의: <a href="mailto:h2g0614@gmail.com">h2g0614@gmail.com</a>
            </small>
          </div>
        </section>
      </main>

      <footer>
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark">
            <BrandMark />
          </span>
          <span>
            <strong>OTHub</strong>
            <small>작업치료사가 만들고, 함께 쓰는</small>
          </span>
        </Link>
        <p>함께 만들고 나누는 훈련 웹앱 · 콘텐츠 허브 · 평가 도구</p>
        <p>
          © {new Date().getFullYear()} OTHub · <Link href="/portfolio">만든 사람</Link>
        </p>
      </footer>
    </div>
  );
}
