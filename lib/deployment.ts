/** Preview may share production credentials; writes require deliberate opt-in. */
export function isReadOnlyPreview(): boolean {
  return process.env.VERCEL_ENV === "preview" && process.env.OTHUB_PREVIEW_ALLOW_WRITES !== "true";
}

export const PREVIEW_READ_ONLY_MESSAGE = "검토용 Preview에서는 데이터 저장·변경이 비활성화되어 있습니다.";

export function assertWritableDeployment() {
  if (isReadOnlyPreview()) throw new Error(PREVIEW_READ_ONLY_MESSAGE);
}
