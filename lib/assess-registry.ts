export interface AssessTool {
  id: string;
  label: string;
}

/** OTHub Assess 평가 도구 8종. 평가 세션의 tool_id가 여기 id를 참조한다. */
export const ASSESS_TOOLS: AssessTool[] = [
  { id: "profiling", label: "작업수행 프로파일링" },
  { id: "otipm", label: "수행분석 (OTIPM)" },
  { id: "jthft", label: "JTHFT" },
  { id: "macs", label: "MACS" },
  { id: "clinical", label: "HFT 임상관찰" },
  { id: "sensory", label: "감각운동협응" },
  { id: "mbi", label: "K-MBI" },
  { id: "k-iadl", label: "K-IADL" },
];

export const TOOL_LABEL: Record<string, string> = Object.fromEntries(
  ASSESS_TOOLS.map((t) => [t.id, t.label])
);
