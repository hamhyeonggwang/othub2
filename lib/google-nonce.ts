/**
 * Google 로그인(GIS)용 nonce. Google에는 SHA-256 해시를, Supabase에는 원본을 넘긴다.
 * Supabase가 원본을 해시해 ID 토큰 안의 nonce와 비교하므로 토큰을 가로채 재사용할 수 없다.
 */
export async function generateGoogleNonce(): Promise<{ raw: string; hashed: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const raw = btoa(String.fromCharCode(...bytes));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { raw, hashed };
}
