"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function toggleLike(contentId: string, path: string) {
  const { supabase, user } = await requireUser();

  const { data: existing } = await supabase
    .from("othub_likes")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("content_id", contentId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("othub_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("content_id", contentId);
  } else {
    await supabase.from("othub_likes").insert({ user_id: user.id, content_id: contentId });
  }

  revalidatePath(path);
}

export async function toggleBookmark(contentId: string, path: string) {
  const { supabase, user } = await requireUser();

  const { data: existing } = await supabase
    .from("othub_bookmarks")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("content_id", contentId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("othub_bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("content_id", contentId);
  } else {
    await supabase
      .from("othub_bookmarks")
      .insert({ user_id: user.id, content_id: contentId });
  }

  revalidatePath(path);
}

export async function addComment(
  contentId: string,
  path: string,
  formData: FormData
) {
  const { supabase, user } = await requireUser();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "댓글 내용을 입력해 주세요." };
  if (body.length > 1000) return { error: "댓글은 1000자 이내로 작성해 주세요." };

  const { error } = await supabase
    .from("othub_comments")
    .insert({ content_id: contentId, user_id: user.id, body });

  if (error) return { error: "댓글 등록 중 오류가 발생했습니다." };

  revalidatePath(path);
  return { error: null };
}

export async function deleteComment(commentId: string, path: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("othub_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);
  revalidatePath(path);
}
