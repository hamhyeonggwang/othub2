import { beforeEach, expect, it, vi } from "vitest";

const { rpc, signOut, getUser, redirect } = vi.hoisted(() => ({
  rpc: vi.fn(),
  signOut: vi.fn(),
  getUser: vi.fn(),
  redirect: vi.fn((to: string) => { throw new Error(`REDIRECT ${to}`); }),
}));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ rpc, auth: { getUser, signOut } }) }));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/deployment", () => ({ isReadOnlyPreview: () => false, PREVIEW_READ_ONLY_MESSAGE: "preview" }));
import { withdrawAccount } from "@/app/actions/account";

const form = (confirm: string) => { const f = new FormData(); f.set("confirm", confirm); return f; };

beforeEach(() => {
  rpc.mockReset().mockResolvedValue({ error: null });
  signOut.mockReset().mockResolvedValue({ error: null });
  getUser.mockReset().mockResolvedValue({ data: { user: { id: "u1" } } });
  redirect.mockClear();
});

it("does nothing unless the confirmation word matches", async () => {
  const r = await withdrawAccount({ error: null }, form("탈퇴할래요"));
  expect(r.error).toContain("탈퇴");
  expect(rpc).not.toHaveBeenCalled();
});
it("deletes OTHub data, signs out and redirects", async () => {
  await expect(withdrawAccount({ error: null }, form(" 탈퇴 "))).rejects.toThrow("REDIRECT /login?withdrawn=1");
  expect(rpc).toHaveBeenCalledWith("othub_delete_my_data");
  expect(signOut).toHaveBeenCalled();
});
it("explains when the last admin tries to withdraw", async () => {
  rpc.mockResolvedValue({ error: { message: "last admin cannot withdraw" } });
  const r = await withdrawAccount({ error: null }, form("탈퇴"));
  expect(r.error).toContain("마지막 관리자");
  expect(signOut).not.toHaveBeenCalled();
});
it("keeps the session when deletion fails", async () => {
  rpc.mockResolvedValue({ error: { message: "boom" } });
  const r = await withdrawAccount({ error: null }, form("탈퇴"));
  expect(r.error).toContain("오류");
  expect(signOut).not.toHaveBeenCalled();
});
