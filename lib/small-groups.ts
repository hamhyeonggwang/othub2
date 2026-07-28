export interface SmallGroup {
  slug: string;
  category: string;
  name: string;
  mode: string;
  focus: string;
  since: string;
  description: string;
  activities?: string;
}

/** OTHub 회원 소모임. 새 소모임이 생기면 여기에 추가한다. */
export const SMALL_GROUPS: SmallGroup[] = [
  {
    slug: "rtl",
    category: "독서모임",
    name: "RTL (Reader to Leader)",
    mode: "온/오프라인",
    focus: "독서토론 및 봉사활동",
    since: "2018년 시작",
    description:
      "작업치료, 인문학, 사회과학 등 다양한 분야의 독서나눔 및 기부세미나를 진행합니다.",
  },
  {
    slug: "ctrl-ai",
    category: "AI스터디",
    name: "Ctrl+AI (컨트롤AI)",
    mode: "온/오프라인",
    focus: "AI 활용 아이디어 나눔",
    since: "2024년 시작",
    description:
      "생성형 AI, 바이브코딩, AX, 자동화 워크플로우 등 AI 활용 방안에 대한 정보를 교류합니다.",
    activities:
      "소그룹 모임 운영 및 작업치료사 대상 외부 강의 진행(작업공방, 연세대학교, 동남보건대).",
  },
  {
    slug: "the-deulseok",
    category: "건강증진프로그램",
    name: "The들썩",
    mode: "오프라인",
    focus: "장애인 건강증진 프로그램",
    since: "2019년 시작",
    description:
      "여의도 해오름장애인자립생활센터에서 진행하는 장애인 대상 건강증진 프로그램입니다.",
    activities:
      "장소: 여의도 해오름장애인자립생활센터 (https://heorum.org/)",
  },
];

export function getSmallGroup(slug: string): SmallGroup | undefined {
  return SMALL_GROUPS.find((g) => g.slug === slug);
}
