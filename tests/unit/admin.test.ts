import { beforeEach, expect, it, vi } from "vitest";
const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ rpc }) }));
vi.mock("@/lib/supabase/profile", () => ({ getCurrentUserAndProfile: vi.fn() }));
import { getPageViewStats, getTopPages } from "@/lib/supabase/admin";

beforeEach(() => rpc.mockReset());
it("does not misrepresent a query error as zero visitors", async () => {
  rpc.mockResolvedValue({ error: { code: "42501" }, data: null });
  await expect(getPageViewStats()).rejects.toThrow();
  await expect(getTopPages()).rejects.toThrow();
});
it("accepts a genuinely empty period", async () => {
  rpc.mockResolvedValue({ error: null, data: [] });
  expect(await getTopPages(30, 10)).toEqual([]);
  expect(rpc).toHaveBeenCalledWith("othub_admin_top_pages", { days: 30, page_limit: 10 });
});
it("preserves the existing statistics contract", async () => {
  rpc.mockResolvedValue({ error: null, data: [{ total_views: 50, views_7d: 7, views_30d: 30, visitors_7d: 3, visitors_30d: 10 }] });
  expect(await getPageViewStats()).toEqual({ total: 50, views7d: 7, views30d: 30, visitors7d: 3, visitors30d: 10 });
});
