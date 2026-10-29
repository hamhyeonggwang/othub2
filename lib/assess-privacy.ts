const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * 평가 도구 보고서 HTML에 들어간 진단명·생년월일 값을 지우는 함수를 만든다.
 * 이 값들은 인쇄·PDF용 화면에만 쓰고 서버에는 저장하지 않는다.
 * 한 글자 값은 다른 글자까지 지울 수 있어 두 글자 이상만 다룬다.
 */
export function scrubber(values: (string | null | undefined)[]) {
  const targets = values
    .map((v) => (v ?? "").trim())
    .filter((v) => v.length >= 2)
    .flatMap((v) => [v, escapeHtml(v)]);
  return (html: string) => targets.reduce((h, t) => h.split(t).join("—"), html);
}
