import { createClient } from "@/lib/supabase/server";
import type { ContentItem, ContentItemWithStats, CommentWithAuthor } from "@/lib/supabase/content-types";

export * from "@/lib/supabase/content-types";

async function withStats(
  items: ContentItem[]
): Promise<ContentItemWithStats[]> {
  if (items.length === 0) return [];
  const supabase = await createClient();
  const ids = items.map((i) => i.id);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: likes }, { data: comments }, { data: myLikes }, { data: myBookmarks }] =
    await Promise.all([
      supabase.from("othub_likes").select("content_id").in("content_id", ids),
      supabase.from("othub_comments").select("content_id").in("content_id", ids),
      user
        ? supabase
            .from("othub_likes")
            .select("content_id")
            .eq("user_id", user.id)
            .in("content_id", ids)
        : Promise.resolve({ data: [] as { content_id: string }[] }),
      user
        ? supabase
            .from("othub_bookmarks")
            .select("content_id")
            .eq("user_id", user.id)
            .in("content_id", ids)
        : Promise.resolve({ data: [] as { content_id: string }[] }),
    ]);

  const countBy = (rows: { content_id: string }[] | null) => {
    const map = new Map<string, number>();
    (rows ?? []).forEach((r) => map.set(r.content_id, (map.get(r.content_id) ?? 0) + 1));
    return map;
  };
  const likeCounts = countBy(likes);
  const commentCounts = countBy(comments);
  const myLikedSet = new Set((myLikes ?? []).map((r) => r.content_id));
  const myBookmarkedSet = new Set((myBookmarks ?? []).map((r) => r.content_id));

  return items.map((item) => ({
    ...item,
    likeCount: likeCounts.get(item.id) ?? 0,
    commentCount: commentCounts.get(item.id) ?? 0,
    likedByMe: myLikedSet.has(item.id),
    bookmarkedByMe: myBookmarkedSet.has(item.id),
  }));
}

export async function getPublishedContent(): Promise<ContentItemWithStats[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("othub_content_items")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  return withStats((data ?? []) as ContentItem[]);
}

export async function getMyBookmarks(): Promise<ContentItemWithStats[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: bookmarks } = await supabase
    .from("othub_bookmarks")
    .select("content_id")
    .eq("user_id", user.id);

  const ids = (bookmarks ?? []).map((b) => b.content_id);
  if (ids.length === 0) return [];

  const { data } = await supabase
    .from("othub_content_items")
    .select("*")
    .in("id", ids)
    .eq("status", "published");

  return withStats((data ?? []) as ContentItem[]);
}

export async function getContentBySlug(
  slug: string
): Promise<ContentItemWithStats | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("othub_content_items")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return null;
  const [withStatsResult] = await withStats([data as ContentItem]);
  return withStatsResult ?? null;
}

export async function getComments(contentId: string): Promise<CommentWithAuthor[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: comments } = await supabase
    .from("othub_comments")
    .select("id, body, created_at, user_id")
    .eq("content_id", contentId)
    .order("created_at", { ascending: false });

  if (!comments || comments.length === 0) return [];

  const authorIds = [...new Set(comments.map((c) => c.user_id))];
  const { data: profiles } = (await supabase.rpc("othub_get_public_profiles", {
    profile_ids: authorIds,
  })) as { data: { id: string; display_name: string | null; role: string }[] | null };

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return comments.map((c) => ({
    ...c,
    authorName: nameById.get(c.user_id) || "회원",
    isMine: user?.id === c.user_id,
  }));
}
