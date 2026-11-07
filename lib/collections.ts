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
  {
    slug: "executive-function",
    eyebrow: "EXECUTIVE FUNCTION",
    title: "실행기능 훈련",
    description:
      "작업기억, 억제, 인지유연성을 한 회기 3~5분 과제로 연습합니다. 다섯 과제가 같은 방식(연습 → 본 과제 → 결과)으로 진행되고, 치료사는 결과 화면에서 시행 기록을 CSV로 받을 수 있습니다. 표준화 검사가 아닌 훈련·관찰 도구이며, 결과는 기기 화면에만 남습니다.",
    appSlugs: [
      "ef-nback",
      "ef-corsi",
      "ef-stroop",
      "ef-hearts-flowers",
      "ef-cardsort",
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
