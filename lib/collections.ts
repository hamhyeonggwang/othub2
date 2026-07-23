export interface Collection {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  /** 이 컬렉션에 포함되는 훈련 웹앱의 content_items.slug 목록 */
  appSlugs: string[];
  assessNote?: string;
}

/**
 * 코드로 정의하는 Collection. 근거 없이 늘리지 않는다 — 실제로 여러 Tool이
 * 하나의 임상 문제를 뒷받침할 때만 추가한다.
 */
export const COLLECTIONS: Collection[] = [
  {
    slug: "community-iadl",
    eyebrow: "COMMUNITY I-ADL",
    title: "지역사회 I-ADL",
    description:
      "편의점, 카페, 기차역, 푸드코트 같은 지역사회 환경에서 반복되는 주문·결제·예매 과제를 키오스크 훈련으로 미리 연습하고, K-IADL 평가로 수행 수준을 확인하세요.",
    appSlugs: [
      "cu-kiosk-trainer",
      "paik-kiosk-trainer",
      "maratang-kiosk-trainer",
      "munggu-kiosk-trainer",
      "korail-kiosk-trainer",
      "photobooth-kiosk-trainer",
      "homeplus-kiosk-trainer",
    ],
    assessNote: "K-IADL 평가는 OTHub Assess(치료사 회원 전용)에서 진행합니다.",
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
