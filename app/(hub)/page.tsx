import type { Metadata } from "next";
import Link from "next/link";
import HomeToolPreview from "@/components/HomeToolPreview";
import { getCollection } from "@/lib/collections";
import "./hub/hub.css";
import "./home.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://othub.kr/#organization",
      name: "OTHub",
      url: "https://othub.kr",
      logo: "https://othub.kr/brand/othub-mark.png",
      description: "작업치료사가 만든 훈련 웹앱, 치료 콘텐츠, 임상 평가 도구.",
    },
    {
      "@type": "WebSite",
      "@id": "https://othub.kr/#website",
      name: "OTHub",
      url: "https://othub.kr",
      inLanguage: "ko",
      publisher: { "@id": "https://othub.kr/#organization" },
    },
  ],
};

/** 도구 타일. 준비물 한 줄 = 치료사가 회기 전에 확인하는 입력 방식과 카메라 필요 여부 */
const tiles = [
  {
    href: "/hub/apps/everyday-cognition",
    src: "/home/everyday-cognition.webp",
    alt: "일상 인지활동의 재료 나눠 담기 화면",
    name: "일상 인지활동",
    needs: "내 이야기로 하는 인지활동. 터치로 조작, 성인과 노인",
    big: true,
  },
  {
    href: "/hub/apps/korail-kiosk-trainer",
    src: "/home/korail-kiosk.webp",
    alt: "기차표 예매 키오스크 훈련 화면",
    name: "기차표 예매하기",
    needs: "터치, 카메라 없이",
  },
  {
    href: "/hub/apps/airdrawing",
    src: "/home/airdrawing.webp",
    alt: "에어 드로잉 시작 화면",
    name: "손으로 그리는 그림",
    needs: "카메라 필요",
  },
  {
    href: "/hub/apps/gazeplay-stars",
    src: "/home/gazeplay.webp",
    alt: "시선으로 별자리를 그리는 화면",
    name: "시선으로 별자리 그리기",
    needs: "카메라 필요",
  },
  {
    href: "/hub/apps/maratang-kiosk-trainer",
    src: "/home/maratang-kiosk.webp",
    alt: "마라탕 주문 키오스크 훈련 화면",
    name: "마라탕 주문하기",
    needs: "터치, 카메라 없이",
  },
];

/** 지역사회 모음의 대표 과제 — 각 줄이 해당 도구로 바로 간다 */
const communitySteps = [
  { href: "/hub/apps/cu-kiosk-trainer", label: "편의점에서 장보기", icon: "M5 8h14l-1.5 10h-11zM9 8V6a3 3 0 0 1 6 0v2" },
  { href: "/hub/apps/paik-kiosk-trainer", label: "카페에서 주문하기", icon: "M5 10h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 4v3M12 4v3" },
  { href: "/hub/apps/korail-kiosk-trainer", label: "기차표 예매하기", icon: "M7 4h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM4 11h16M8 18l-2 3M16 18l2 3" },
];

export default function LandingPage() {
  const community = getCollection("community-iadl");
  return (
    <div className="home2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <main id="main" className="hub-shell home2-main">
        <section className="home2-hero" aria-labelledby="home-title">
          <div>
            <h1 id="home-title" className="home2-title">
              <span className="home2-title-soft">현장의 아이디어가</span>
              <span className="home2-title-strong">모두의 도구가 됩니다</span>
            </h1>
            <p className="home2-lead">
              작업치료사가 현장에서 떠올린 아이디어를 키오스크, 손 동작, 인지활동 도구로 만들어
              나눕니다. 치료실에서도 집에서도, 훈련 도구는 로그인 없이 시작할 수 있어요.
            </p>
            <div className="home2-actions">
              <Link className="home2-btn home2-btn-primary" href="/hub/apps">훈련 도구 둘러보기</Link>
              <Link className="home2-btn" href="/about">OTHub 소개</Link>
            </div>
            <p className="home2-note">카메라가 필요한 도구는 시작 전에 알려 드려요.</p>
          </div>
          <HomeToolPreview />
        </section>

        <section className="home2-paths" aria-label="사용자별 시작하기">
          <div className="home2-path home2-path-pro">
            <div>
              <h2>작업치료사라면</h2>
              <p>도구를 치료에 쓰고 평가 기록을 이어 가세요. 써 본 경험이 다음 도구를 다듬습니다.</p>
            </div>
            <Link className="home2-btn home2-btn-light" href="/assess">평가 이어 가기</Link>
          </div>
          <div className="home2-path home2-path-family">
            <div>
              <h2>보호자와 대상자라면</h2>
              <p>익숙한 일상을 집에서도 연습해요. 로그인 없이, 큰 글자와 큰 버튼으로 만들었어요.</p>
            </div>
            <Link className="home2-btn" href="/hub/apps">바로 해 보기</Link>
          </div>
        </section>

        <section className="home2-tools" aria-labelledby="tools-title">
          <div className="home2-head">
            <h2 id="tools-title">익숙한 일상부터, 하나씩</h2>
            <Link className="home2-link" href="/hub/apps">전체 도구 보기</Link>
          </div>
          <div className="home2-bento">
            {tiles.map((t) => (
              <Link key={t.href} href={t.href} className={t.big ? "home2-tile home2-tile-big" : "home2-tile"}>
                {/* next/image를 서버 컴포넌트에서 쓰면 홈 본문이 스트리밍 블록으로 밀려
                    JavaScript 없이 보이지 않는다. 이미 줄여 둔 webp라 일반 img로 지연 로딩한다. */}
                <img src={t.src} alt={t.alt} width={960} height={720} loading="lazy" decoding="async" />
                <span className="home2-tile-meta">
                  <strong>{t.name}</strong>
                  <span>{t.needs}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {community && (
          <section className="home2-community" aria-labelledby="community-title">
            <div>
              <h2 id="community-title">지역사회 활동을 미리 연습해 보세요</h2>
              <p>편의점에서 계산하고, 카페에서 주문하고, 기차표를 예매하는 일을 하나의 주제로 모았어요.</p>
              <Link className="home2-btn home2-btn-light" href={`/collections/${community.slug}`}>
                지역사회 모음 보기
              </Link>
            </div>
            <ul className="home2-steps">
              {communitySteps.map((s) => (
                <li key={s.href}>
                  <Link href={s.href}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.icon} /></svg>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="home2-feedback" aria-labelledby="feedback-title">
          <h2 id="feedback-title">다음 도구는 당신의 아이디어에서 시작합니다</h2>
          <p>현장에서 필요했던 도구, 써 보며 불편했던 점을 들려주세요. 듣고, 정리하고, 만들어 다시 나눕니다.</p>
          <a className="home2-link" href="mailto:h2g0614@gmail.com">아이디어 보내기</a>
        </section>
      </main>
      <footer className="home2-footer">
        <p className="home2-footer-brand">
          <strong>OTHub</strong>
          <span>작업치료사가 만들고, 함께 쓰는</span>
        </p>
        <nav aria-label="하단 메뉴">
          <Link href="/about">소개</Link>
          <Link href="/portfolio">만든 사람</Link>
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy" className="home2-footer-privacy">개인정보처리방침</Link>
          <a href="mailto:h2g0614@gmail.com">문의</a>
        </nav>
        <small>© {new Date().getFullYear()} OTHub</small>
      </footer>
    </div>
  );
}
