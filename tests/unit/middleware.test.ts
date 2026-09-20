import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), from: vi.fn(), single: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: () => ({
  auth: { getUser: mocks.getUser }, from: mocks.from,
}) }));
import { updateSession } from "@/lib/supabase/middleware";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: null } });
  mocks.single.mockResolvedValue({ data: { role: "member" } });
  mocks.from.mockReturnValue({ select: () => ({ eq: () => ({ single: mocks.single }) }) });
});

describe("session and access boundaries", () => {
  it.each<Record<string, string>>([{}, { "next-router-prefetch": "1" }, { RSC: "1" }])("never writes page views for a document or prefetch", async (headers) => {
    const response = await updateSession(new NextRequest("https://www.othub.kr/hub", { headers }));
    expect(response.status).toBe(200);
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(mocks.from).not.toHaveBeenCalled();
    expect(response.cookies.get("othub_vid")).toBeUndefined();
  });
  it("does not make telemetry wait for auth", async () => {
    await updateSession(new NextRequest("https://www.othub.kr/api/page-view"));
    expect(mocks.getUser).not.toHaveBeenCalled();
  });
  it.each(["/admin", "/assess", "/assess/hub.html"])("guards anonymous access to %s", async (path) => {
    const response = await updateSession(new NextRequest(`https://www.othub.kr${path}`));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
  });
  it.each([
    ["member", "/admin", 307], ["member", "/assess/hub.html", 307],
    ["therapist", "/admin", 307], ["therapist", "/assess", 200], ["admin", "/admin", 200],
  ])("enforces %s access to %s", async (role, path, status) => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "test-user" } } });
    mocks.single.mockResolvedValue({ data: { role } });
    expect((await updateSession(new NextRequest(`https://www.othub.kr${path}`))).status).toBe(status);
  });
});
