export interface AssessTool {
  id: string;
  label: string;
  /** true면 아직 제공은 유지하되(라벨·기존 세션 표시) 신규 선택 목록·홍보 카피에서는 뺀다. */
  hidden?: boolean;
}

/** OTHub Assess 평가 도구. HFT·SMC는 서비스 종료로 완전히 제외했다. */
export const ASSESS_TOOLS: AssessTool[] = [
  { id: "profiling", label: "작업수행 프로파일링" },
  { id: "otipm", label: "수행분석 (OTIPM)", hidden: true },
  { id: "jthft", label: "JTHFT" },
  { id: "macs", label: "MACS" },
  { id: "mbi", label: "K-MBI" },
  { id: "k-iadl", label: "K-IADL" },
];

export const VISIBLE_ASSESS_TOOLS = ASSESS_TOOLS.filter((t) => !t.hidden);

export const TOOL_LABEL: Record<string, string> = Object.fromEntries(
  ASSESS_TOOLS.map((t) => [t.id, t.label])
);
