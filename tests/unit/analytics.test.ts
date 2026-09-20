import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { analyticsPath, isSameOrigin } from "@/lib/analytics";

const { insert } = vi.hoisted(() => ({ insert: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ from: () => ({ insert }) }),
}));
import { POST } from "@/app/api/page-view/route";

function request(body: unknown = { path: "/hub/apps" }, headers: Record<string, string> = {}) {
  return new NextRequest("https://www.othub.kr/api/page-view", {
    method: "POST", headers: { origin: "https://www.othub.kr", "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => { insert.mockReset().mockResolvedValue({ error: null }); });

describe("privacy-safe paths", () => {
  it.each(["/", "/hub", "/hub/apps/test-tool", "/collections/daily-life", "/l/test-tool"])("allows %s", (path) => {
    expect(analyticsPath(path)).toBe(path);
  });
  it.each(["/admin", "/login", "/auth/callback", "/api/private", "/assess/report.html", "/hub?q=name", "/hub#name", "//evil.com", "/hub/%61", "/hub/../admin", null, {}, "/hub\\apps"])("rejects %s", (path) => {
    expect(analyticsPath(path)).toBeNull();
  });
  it("redacts assessment IDs", () => {
    expect(analyticsPath("/assess/12345678-1234-4234-8234-123456789abc")).toBe("/assess/session");
  });
});

describe("telemetry endpoint", () => {
  it("supports Next's internal hostname without trusting forwarded-host", () => {
    expect(isSameOrigin(new Request("http://localhost:4180/api/page-view", {
      headers: { host: "127.0.0.1:4180", origin: "http://127.0.0.1:4180" },
    }))).toBe(true);
    expect(isSameOrigin(new Request("https://www.othub.kr/api/page-view", {
      headers: { origin: "https://evil.example", "x-forwarded-host": "evil.example" },
    }))).toBe(false);
  });
  it("inserts only safe fields and sets a protected visitor cookie", async () => {
    const response = await POST(request());
    expect(response.status).toBe(204);
    expect(insert).toHaveBeenCalledWith({ path: "/hub/apps", visitor_id: expect.any(String) });
    expect(response.headers.get("set-cookie")).toMatch(/HttpOnly/i);
    expect(response.headers.get("set-cookie")).toMatch(/Secure/i);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("reuses the deployed UUID cookie", async () => {
    const id = "12345678-1234-4234-8234-123456789abc";
    const response = await POST(request(undefined, { cookie: `othub_vid=${id}` }));
    expect(insert).toHaveBeenCalledWith({ path: "/hub/apps", visitor_id: id });
    expect(response.headers.get("set-cookie")).toBeNull();
  });
  it("replaces a tampered visitor cookie", async () => {
    await POST(request(undefined, { cookie: "othub_vid=arbitrary-value" }));
    expect(insert.mock.calls[0][0].visitor_id).not.toBe("arbitrary-value");
  });
  it("rejects cross-origin writes", async () => {
    expect((await POST(request(undefined, { origin: "https://evil.example" }))).status).toBe(403);
    expect(insert).not.toHaveBeenCalled();
  });
  it("respects Do Not Track", async () => {
    expect((await POST(request(undefined, { dnt: "1" }))).status).toBe(204);
    expect(insert).not.toHaveBeenCalled();
  });
  it("rejects unexpected paths", async () => {
    expect((await POST(request({ path: "/admin" }))).status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });
  it("rejects malformed JSON", async () => {
    expect((await POST(request("{"))).status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });
  it("caps the actual body size without Content-Length", async () => {
    expect((await POST(request("x".repeat(513)))).status).toBe(413);
    expect(insert).not.toHaveBeenCalled();
  });
  it("reports a failed insert without setting a cookie", async () => {
    insert.mockResolvedValue({ error: { code: "42501" } });
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
  it("reports network failures as unavailable, not invalid user input", async () => {
    insert.mockRejectedValue(new Error("offline"));
    expect((await POST(request())).status).toBe(503);
  });
});
