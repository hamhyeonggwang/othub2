import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { isReadOnlyPreview, assertWritableDeployment } from "@/lib/deployment";
import { NextRequest } from "next/server";

const { db } = vi.hoisted(() => ({ db: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: db }));
vi.mock("@supabase/supabase-js", () => ({ createClient: db }));
vi.mock("@/lib/supabase/admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import * as admin from "@/app/actions/admin";
import * as engagement from "@/app/actions/engagement";
import { requestTherapistRole, updateDisplayName } from "@/app/actions/auth";
import { POST as saveAssessment } from "@/app/api/assess/save-session/route";
import { POST as pageView } from "@/app/api/page-view/route";

beforeEach(() => { vi.stubEnv("VERCEL_ENV", "preview"); vi.stubEnv("OTHUB_PREVIEW_ALLOW_WRITES", ""); db.mockReset(); });
afterEach(() => vi.unstubAllEnvs());

it("fails closed in Preview without changing production behavior", () => {
  expect(isReadOnlyPreview()).toBe(true);
  expect(assertWritableDeployment).toThrow();
  vi.stubEnv("VERCEL_ENV", "production");
  expect(isReadOnlyPreview()).toBe(false);
  expect(assertWritableDeployment).not.toThrow();
});
it("requires an exact explicit opt-in for a verified staging database", () => {
  vi.stubEnv("OTHUB_PREVIEW_ALLOW_WRITES", "1");
  expect(isReadOnlyPreview()).toBe(true);
  vi.stubEnv("OTHUB_PREVIEW_ALLOW_WRITES", "true");
  expect(isReadOnlyPreview()).toBe(false);
});
it("blocks all admin mutations before a DB connection", async () => {
  const calls = [
    () => admin.approveTherapist("id"), () => admin.rejectTherapist("id"),
    () => admin.adminDeleteComment("id"), () => admin.toggleContentStatus("id", true),
    () => admin.deleteContent("id"), () => admin.saveContent(new FormData()),
  ];
  for (const call of calls) await expect(call()).rejects.toThrow();
  expect(db).not.toHaveBeenCalled();
});
it("blocks engagement writes even when actions are posted through another page", async () => {
  const calls = [
    () => engagement.toggleLike("id", "/login"), () => engagement.toggleBookmark("id", "/login"),
    () => engagement.addComment("id", "/login", new FormData()), () => engagement.deleteComment("id", "/login"),
  ];
  for (const call of calls) await expect(call()).rejects.toThrow();
  expect(db).not.toHaveBeenCalled();
});
it("blocks profile edits with a readable error", async () => {
  expect((await requestTherapistRole(new FormData())).error).toContain("Preview");
  expect((await updateDisplayName(new FormData())).error).toContain("Preview");
  expect(db).not.toHaveBeenCalled();
});
it("blocks assessment saves and silently disables visit collection", async () => {
  expect((await saveAssessment(new Request("https://test.vercel.app/api/assess/save-session", { method: "POST" }))).status).toBe(403);
  expect((await pageView(new NextRequest("https://test.vercel.app/api/page-view", {
    method: "POST", headers: { origin: "https://test.vercel.app" },
  }))).status).toBe(204);
  expect(db).not.toHaveBeenCalled();
});
