export interface LandingCta {
  label: string;
  href: string;
}

export interface LandingPageDef {
  slug: string;
  eyebrow: string;
  headline: string;
  subcopy?: string;
  primaryCta: LandingCta;
  secondaryCta?: LandingCta;
  /** hub_content_items.slug 목록 — 실제 콘텐츠는 렌더링 시점에 조인해서 가져온다 */
  toolGridTitle?: string;
  toolGridAppSlugs?: string[];
  trailingCta?: LandingCta & { note?: string };
  metaTitle: string;
  metaDescription: string;
}

/**
 * 랜딩 페이지는 근거 없이 늘리지 않는다. 다음을 모두 만족할 때만 추가한다:
 * 1. 실제로 배포될 외부 유입 경로가 이미 정해져 있다 (QR/전단지, SNS 광고,
 *    협회 세미나 링크 등 — "있으면 좋을 것 같아서"는 불충분).
 * 2. 전환 목표가 정확히 하나다. 목표가 여럿이면 홈페이지 섹션이 맞는 자리다.
 * 3. 홈페이지의 일반 메시지로는 그 채널/대상에게 충분하지 않다는 근거(가설이라도)가
 *    있다.
 * 4. 수명이 있다 — 캠페인이 끝나면 내리거나 리다이렉트한다는 전제로 만든다.
 *
 * 조건 미충족 시: 홈페이지 앵커 섹션(/#section-id)이나 기존 허브 페이지 문구
 * 조정으로 대체한다.
 */
export const LANDING_PAGES: LandingPageDef[] = [
  {
    slug: "icandoadl",
    eyebrow: "동료 작업치료사님께 — SNS 광고",
    headline: "웹캠 하나로, 아이의 손이 게임 컨트롤러가 됩니다",
    subcopy:
      "I Can Do ADL은 웹캠 손·몸 인식으로 마을 하루 속 일상생활(ADL) 과제를 연습하는 아동 작업치료 게임입니다. 로그인 없이, 지금 바로 체험해보세요.",
    primaryCta: { label: "지금 체험하기", href: "/hub/apps/icandoadl" },
    secondaryCta: { label: "OTHub 둘러보기", href: "/" },
    toolGridTitle: "이런 도구예요",
    toolGridAppSlugs: ["icandoadl"],
    trailingCta: {
      label: "OTHub 회원가입하고 더 보기",
      href: "/login",
      note: "치료사 회원이 되면 평가 도구와 다른 훈련 웹앱도 무료로 이용할 수 있어요.",
    },
    metaTitle: "I Can Do ADL — 웹캠 아동 ADL 훈련 게임",
    metaDescription:
      "웹캠 손 인식으로 아이의 일상생활(ADL) 수행을 훈련하는 게임. 로그인 없이 지금 바로 체험해보세요.",
  },
];

export function getLandingPage(slug: string): LandingPageDef | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}
