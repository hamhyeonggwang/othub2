import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import type { OTHubProfile } from "@/lib/supabase/types";
import type { ContentItem } from "@/lib/supabase/content-types";

/** admin이 아니면 리다이렉트. 미들웨어와 별개로 페이지·액션에서 이중 방어한다. */
export async function requireAdmin() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login?next=/admin");
  if (!profile || profile.role !== "admin") redirect("/me");
  return { user, profile };
}

export async function getTherapistRequests(): Promise<OTHubProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("othub_profiles")
    .select("*")
    .eq("role", "member")
    .not("therapist_requested_at", "is", null)
    .order("therapist_requested_at", { ascending: false });
  return (data ?? []) as OTHubProfile[];
}

export async function getMembers(): Promise<{
  members: OTHubProfile[];
  countsByRole: Record<string, number>;
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("othub_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const members = (data ?? []) as OTHubProfile[];
  const countsByRole: Record<string, number> = {};
  members.forEach((m) => {
    countsByRole[m.role] = (countsByRole[m.role] ?? 0) + 1;
  });
  return { members, countsByRole };
}

export async function getAllContent(): Promise<ContentItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("othub_content_items")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as ContentItem[];
}

export interface AdminComment {
  id: string;
  body: string;
  created_at: string;
  authorName: string;
  contentTitle: string;
}

export async function getRecentComments(limit = 30): Promise<AdminComment[]> {
  const supabase = await createClient();
  const { data: comments } = await supabase
    .from("othub_comments")
    .select("id, body, created_at, user_id, content_id")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!comments || comments.length === 0) return [];

  const authorIds = [...new Set(comments.map((c) => c.user_id))];
  const contentIds = [...new Set(comments.map((c) => c.content_id))];

  const [{ data: profiles }, { data: contents }] = await Promise.all([
    supabase.rpc("othub_get_public_profiles", { profile_ids: authorIds }) as unknown as Promise<{
      data: { id: string; display_name: string | null }[] | null;
    }>,
    supabase.from("othub_content_items").select("id, title").in("id", contentIds),
  ]);

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
  const titleById = new Map((contents ?? []).map((c) => [c.id, c.title]));

  return comments.map((c) => ({
    id: c.id,
    body: c.body,
    created_at: c.created_at,
    authorName: nameById.get(c.user_id) || "회원",
    contentTitle: titleById.get(c.content_id) || "(삭제된 콘텐츠)",
  }));
}

export async function getEngagementSummary(): Promise<
  { title: string; likes: number; comments: number }[]
> {
  const supabase = await createClient();
  const [{ data: likes }, { data: comments }, { data: contents }] = await Promise.all([
    supabase.from("othub_likes").select("content_id"),
    supabase.from("othub_comments").select("content_id"),
    supabase.from("othub_content_items").select("id, title"),
  ]);

  const countBy = (rows: { content_id: string }[] | null) => {
    const map = new Map<string, number>();
    (rows ?? []).forEach((r) => map.set(r.content_id, (map.get(r.content_id) ?? 0) + 1));
    return map;
  };
  const likeCounts = countBy(likes);
  const commentCounts = countBy(comments);

  return (contents ?? [])
    .map((c) => ({
      title: c.title,
      likes: likeCounts.get(c.id) ?? 0,
      comments: commentCounts.get(c.id) ?? 0,
    }))
    .filter((row) => row.likes > 0 || row.comments > 0)
    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
    .slice(0, 15);
}

export async function getAssessStats(): Promise<{ total: number; last7d: number }> {
  const supabase = await createClient();
  const { data } = (await supabase.rpc("othub_admin_assess_stats")) as {
    data: { total_sessions: number; sessions_7d: number }[] | null;
  };
  const row = data?.[0];
  return { total: row?.total_sessions ?? 0, last7d: row?.sessions_7d ?? 0 };
}
