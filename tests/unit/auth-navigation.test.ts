import { expect, it, vi, beforeEach } from "vitest";
import { safeReturnPath } from "@/lib/auth-navigation";

const { exchange, rpc } = vi.hoisted(() => ({ exchange: vi.fn(), rpc: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { exchangeCodeForSession: exchange }, rpc }) }));
import { GET } from "@/app/auth/callback/route";

beforeEach(() => {
  exchange.mockReset().mockResolvedValue({ error: null });
  rpc.mockReset().mockResolvedValue({ error: null });
});
it.each(["/me", "/admin?tab=visits", "/assess", "/hub/apps?cat=kiosk"])("keeps internal return path %s", (path) => {
  expect(safeReturnPath(path)).toBe(path);
});
it.each([undefined, null, "", "//evil.example", "@evil.example", "https://evil.example", "/\\evil.example", "/%5cevil.example", "/%2fevil.example", "/\nevil.example", "/%0aevil.example", "/%broken"])("rejects unsafe return path %s", (path) => {
  expect(safeReturnPath(path)).toBe("/me");
});
it("validates the callback even if the login form was bypassed", async () => {
  const response = await GET(new Request("https://www.othub.kr/auth/callback?code=test&next=%40evil.example"));
  expect(response.headers.get("location")).toBe("https://www.othub.kr/me");
});
it("preserves a valid administrator return path", async () => {
  const response = await GET(new Request("https://www.othub.kr/auth/callback?code=test&next=%2Fadmin%3Ftab%3Dvisits"));
  expect(response.headers.get("location")).toBe("https://www.othub.kr/admin?tab=visits");
});
it("does not treat a failed token exchange as login success", async () => {
  exchange.mockResolvedValue({ error: new Error("expired") });
  const response = await GET(new Request("https://www.othub.kr/auth/callback?code=test"));
  expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
});
it("restores the OTHub profile after login (e.g. after withdrawal)", async () => {
  await GET(new Request("https://www.othub.kr/auth/callback?code=test"));
  expect(rpc).toHaveBeenCalledWith("othub_ensure_my_profile");
});
it("still completes login when profile restore fails", async () => {
  rpc.mockRejectedValue(new Error("network"));
  const response = await GET(new Request("https://www.othub.kr/auth/callback?code=test"));
  expect(response.headers.get("location")).toBe("https://www.othub.kr/me");
});
it("does not restore a profile when the token exchange fails", async () => {
  exchange.mockResolvedValue({ error: new Error("expired") });
  await GET(new Request("https://www.othub.kr/auth/callback?code=test"));
  expect(rpc).not.toHaveBeenCalled();
});
