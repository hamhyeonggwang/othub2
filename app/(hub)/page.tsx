import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import WorkspaceIcon from "@/components/WorkspaceIcon";
import { COLLECTIONS } from "@/lib/collections";
import "./hub/hub.css";
import "./hub/catalog.css";
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

const starters = [
  {
    href: "/hub/apps/cu-kiosk-trainer",
    kind: "kiosk" as const,
    name: "편의점 셀프계산대",
    text: "상품 스캔부터 결제까지, 일상 속 과정을 차근차근 연습해요.",
    label: "CU 키오스크 훈련",
    environment: "카메라 없이",
  },
  {
    href: "/hub/apps/korail-kiosk-trainer",
    kind: "kiosk" as const,
    name: "기차표 예매하기",
    text: "노선과 시간, 좌석을 선택하며 이동에 필요한 과정을 연습해요.",
    label: "코레일 키오스크 훈련",
    environment: "카메라 없이",
  },
  {
    href: "/hub/apps/airdrawing",
    kind: "hand" as const,
    name: "손으로 그리는 그림",
    text: "웹캠 앞에서 손을 움직이며 허공에 그림을 그려보세요.",
    label: "에어 드로잉",
    environment: "카메라 필요",
  },
];

export default function LandingPage() {
  return (
    <div className="product-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <main id="main" className="hub-shell home-main">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-intro">
            <p className="home-kicker">
              <span /> BY OTs, FOR EVERYONE
            </p>
            <h1 id="home-title">
              현장의 아이디어를,
              <br />
              <em>오늘의 도구로.</em>
            </h1>
            <p className="home-lead">
              훈련 도구부터 임상 자료, 평가 기록까지.
              <br />
              작업치료사가 만들고 함께 사용하는 OTHub에서
              <br className="home-wide-break" /> 오늘 필요한 도구를 찾아보세요.
            </p>
            <div className="home-actions">
              <Link className="button home-primary" href="/hub/apps">
                훈련 도구 둘러보기 <WorkspaceIcon kind="arrow" />
              </Link>
              <Link className="home-text-link" href="/about">
                OTHub 소개 <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <p className="home-access-note">
              훈련 웹앱은 로그인 없이 시작할 수 있어요.
            </p>
          </div>
          <div className="home-launchpad">
            <div className="home-launchpad-heading">
              <span className="home-mark">
                <BrandMark />
              </span>
              <div>
                <strong>오늘은 무엇을 해볼까요?</strong>
                <small>필요한 곳으로 바로 이동하세요</small>
              </div>
            </div>
            <Link href="/hub/apps" className="home-launch-row">
              <span className="home-launch-icon">
                <WorkspaceIcon kind="kiosk" />
              </span>
              <span>
                <strong>일상 속 활동 연습하기</strong>
                <small>키오스크 · 손 동작 · 시선 추적</small>
              </span>
              <WorkspaceIcon kind="arrow" />
            </Link>
            <Link href="/assess" className="home-launch-row">
              <span className="home-launch-icon">
                <WorkspaceIcon kind="assess" />
              </span>
              <span>
                <strong>평가 기록 이어가기</strong>
                <small>치료사 인증 회원 전용</small>
              </span>
              <WorkspaceIcon kind="arrow" />
            </Link>
            <Link href="/hub" className="home-launch-row">
              <span className="home-launch-icon">
                <WorkspaceIcon kind="content" />
              </span>
              <span>
                <strong>필요한 자료 찾아보기</strong>
                <small>영상 · 임상 정보 · 참고 자료</small>
              </span>
              <WorkspaceIcon kind="arrow" />
            </Link>
            <div className="home-launchpad-foot">
              <span className="home-status-dot" /> 각자의 현장에서, 함께 만드는
              도구
            </div>
          </div>
        </section>

        <section className="home-section" aria-labelledby="start-title">
          <div className="home-section-heading">
            <div>
              <p className="workspace-eyebrow">START HERE</p>
              <h2 id="start-title">익숙한 일상부터, 하나씩</h2>
            </div>
            <Link className="home-text-link" href="/hub/apps">
              전체 도구 <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="home-starters">
            {starters.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="home-starter"
                data-category={item.kind}
              >
                <div className="home-starter-visual" aria-hidden="true">
                  <WorkspaceIcon kind={item.kind} />
                  <span>{item.label}</span>
                </div>
                <div className="home-starter-copy">
                  <span className="home-tool-environment">
                    {item.environment}
                  </span>
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                  <span className="home-start-action">
                    도구 살펴보기 <WorkspaceIcon kind="arrow" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {COLLECTIONS.map((collection) => (
          <section
            className="home-collection"
            key={collection.slug}
            aria-labelledby={`collection-${collection.slug}`}
          >
            <div>
              <p className="workspace-eyebrow">함께 쓰면 좋은 도구 모음</p>
              <h2 id={`collection-${collection.slug}`}>
                지역사회 활동을
                <br />
                미리 연습해 보세요.
              </h2>
              <p>
                편의점에서 계산하고, 카페에서 주문하고, 기차표를 예매하는 일.
                <br />
                하나의 주제에 연결된 도구를 모았습니다.
              </p>
              <Link
                className="button button-secondary"
                href={`/collections/${collection.slug}`}
              >
                {collection.title} 모음 보기 <WorkspaceIcon kind="arrow" />
              </Link>
            </div>
            <div className="home-collection-route" aria-hidden="true">
              <span>
                <i>01</i> 편의점에서 장보기
              </span>
              <span>
                <i>02</i> 카페에서 주문하기
              </span>
              <span>
                <i>03</i> 기차표 예매하기
              </span>
            </div>
          </section>
        ))}

        <section
          className="home-section home-access"
          aria-labelledby="access-title"
        >
          <div className="home-section-heading">
            <div>
              <p className="workspace-eyebrow">YOUR WORKSPACE</p>
              <h2 id="access-title">필요한 만큼, 편하게 시작하세요</h2>
            </div>
          </div>
          <div className="home-access-grid">
            <div>
              <span className="home-access-label">누구나</span>
              <h3>먼저 도구를 경험해 보세요</h3>
              <p>
                훈련 웹앱과 공개 콘텐츠는 로그인 없이 둘러볼 수 있습니다.
                카메라가 필요한 도구는 시작 전에 안내해요.
              </p>
              <Link href="/hub/apps" className="home-text-link">
                도구 탐색하기 →
              </Link>
            </div>
            <div>
              <span className="home-access-label">회원 · 치료사</span>
              <h3>내 작업을 이어가세요</h3>
              <p>
                로그인하면 자료를 저장하고 의견을 나눌 수 있어요. 평가 세션과
                결과 관리는 치료사 인증 후 이용합니다.
              </p>
              <Link href="/me" className="home-text-link">
                My Hub로 이동 →
              </Link>
            </div>
          </div>
        </section>

        <div className="home-support">
          <div>
            <strong>함께 다듬어가는 OTHub</strong>
            <p>사용 중 불편한 점이나 필요한 도구가 있다면 알려주세요.</p>
          </div>
          <a href="mailto:h2g0614@gmail.com">
            의견 보내기 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </main>
      <footer className="home-footer">
        <div>
          <strong>OTHub</strong>
          <span>작업치료사가 만들고, 함께 쓰는</span>
        </div>
        <nav aria-label="하단 메뉴">
          <Link href="/about">소개</Link>
          <Link href="/portfolio">만든 사람</Link>
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy" className="home-footer-privacy">개인정보처리방침</Link>
          <a href="mailto:h2g0614@gmail.com">문의</a>
        </nav>
        <small>© {new Date().getFullYear()} OTHub</small>
      </footer>
    </div>
  );
}
