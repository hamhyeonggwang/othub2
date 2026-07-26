import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "../hub/hub.css";

export const metadata: Metadata = {
  title: "OTHub 소개",
  description: "OTHub가 만들어진 이유와, 도구를 만들고 다듬는 방식.",
};

export default function AboutPage() {
  return (
    <>

      <div className="hub-shell" id="main">
        <Link className="hub-back" href="/">
          ← OTHub 홈으로
        </Link>

        <section className="about-hero" aria-labelledby="why-title">
          <p className="eyebrow">
            <span></span> WHY OTHUB
          </p>
          <h1 id="why-title">
            당신의 존재가 작업이 됩니다.
            <br />
            작업을 통해 연결됩니다
            <br />
            <em>OT hub</em>
          </h1>
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

        <section className="about-section" aria-labelledby="brand-title">
          <p className="eyebrow">
            <span></span> BRAND
          </p>
          <h2 id="brand-title">로고</h2>
          <div className="brand-showcase">
            <Image
              src="/brand/othub-mark.png"
              alt="OTHub 로고"
              width={140}
              height={140}
            />
            <p>
              서로 다른 색의 원들이 겹쳐 하나의 꽃을 이룹니다. 각자의
              현장에서 일하는 작업치료사들이 모여 하나의 커뮤니티가 되는
              과정을 담았습니다. 중심의 &lsquo;OT&rsquo; 모노그램은 작업치료라는
              정체성을, 겹쳐진 원들은 함께 자라나는 성장을 뜻합니다.
            </p>
          </div>

          <div className="vision-mission-grid">
            <div>
              <h3>Vision</h3>
              <p>작업치료사 한 사람의 아이디어가 모두의 도구가 되는 커뮤니티</p>
            </div>
            <div>
              <h3>Mission</h3>
              <p>
                현장에서 태어난 아이디어를 가장 빠르게 도구로 만들고, 인증된
                치료사 커뮤니티를 통해 함께 다듬어 나눕니다.
              </p>
            </div>
          </div>
        </section>

        <section className="approach-layout about-section" aria-labelledby="approach-title">
          <div className="approach-intro">
            <p className="eyebrow">
              <span></span> 아이디어에서 시작해서, 함께 나눠요
            </p>
            <h2 id="approach-title">
              아이디어에서 시작해
              <br />
              <em>다 같이 다듬는</em> 방식
            </h2>
            <p>
              모든 아이디어는 현장의 필요에서 시작합니다. 여러분의 아이디어를
              공유해주세요.
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

        <section className="about-section" aria-labelledby="groups-title">
          <p className="eyebrow">
            <span></span> TOGETHER
          </p>
          <h2 id="groups-title">함께하는 소모임</h2>
          <p className="lead">
            독서모임 RTL, AI스터디 Ctrl+AI 등 OTHub 회원들이 함께 만들어가는
            소모임이 있어요.
          </p>
          <Link className="button button-secondary" href="/groups">
            소모임 보기
          </Link>
        </section>

        <section className="about-section" aria-labelledby="maker-title">
          <p className="eyebrow">
            <span></span> WHO
          </p>
          <h2 id="maker-title">만든 사람</h2>
          <p className="lead">함형광</p>
        </section>
      </div>
    </>
  );
}
