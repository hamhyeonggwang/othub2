import type { Metadata } from "next";
import Link from "next/link";
import "../hub/hub.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "OTHub 소개",
  description: "OTHub가 만들어진 이유와, 도구를 만들고 다듬는 방식.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <div className="hub-shell" id="main">
        <Link className="hub-back" href="/">
          ← OTHub 홈으로
        </Link>

        <section className="about-hero" aria-labelledby="why-title">
          <p className="eyebrow">
            <span></span> WHY OTHUB
          </p>
          <h1 id="why-title">
            당신의 존재가 <em>작업</em>이 됩니다.
            <br />
            그리고 그 작업이 당신을 만듭니다.
          </h1>
          <p className="lead">그렇게 함께합니다.</p>
          <div className="hero-actions" style={{ justifyContent: "flex-start" }}>
            <Link className="button button-primary" href="/hub/apps">
              도구 둘러보기
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link className="button button-secondary" href="/portfolio">
              만든 사람 보기
            </Link>
          </div>
        </section>

        <section className="approach-layout about-section" aria-labelledby="approach-title">
          <div className="approach-intro">
            <p className="eyebrow">
              <span></span> 치료실에서 시작해서, 함께 나눠요
            </p>
            <h2 id="approach-title">
              치료실에서 시작해
              <br />
              <em>다 같이 다듬는</em> 방식
            </h2>
            <p>
              모든 도구는 치료실에서 진짜 필요했던 것에서 시작해요. 여러
              치료사의 손을 거쳐 다듬어진 뒤에야 플랫폼에 올라옵니다.
            </p>
          </div>

          <ol className="process-list">
            <li>
              <span>01</span>
              <div>
                <strong>듣기</strong>
                <p>현장과 일상에서 부딪히는 진짜 문제를 듣습니다.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>정리하기</strong>
                <p>누구에게, 왜 필요한지 같이 정리합니다.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>그려보기</strong>
                <p>어떻게 쓰일지 흐름을 같이 그려봅니다.</p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>만들기</strong>
                <p>작게 만들어서 실제 현장에 바로 연결합니다.</p>
              </div>
            </li>
            <li>
              <span>05</span>
              <div>
                <strong>다듬기</strong>
                <p>써보고 받은 피드백으로 다듬어갑니다.</p>
              </div>
            </li>
            <li>
              <span>06</span>
              <div>
                <strong>나누기</strong>
                <p>다듬어진 도구를 모두에게 편하게 나눕니다.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="about-section" aria-labelledby="maker-title">
          <p className="eyebrow">
            <span></span> WHO
          </p>
          <h2 id="maker-title">만든 사람</h2>
          <p className="lead">
            작업치료사 함형광이 만들고 운영합니다. 궁금한 점이나 제안은{" "}
            <a href="mailto:h2g0614@gmail.com">h2g0614@gmail.com</a>으로 보내
            주세요.
          </p>
        </section>
      </div>
    </>
  );
}
