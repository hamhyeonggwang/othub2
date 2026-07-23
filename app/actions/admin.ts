"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin";

export async function approveTherapist(profileId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("othub_profiles")
    .update({ role: "therapist", approved_at: new Date().toISOString() })
    .eq("id", profileId)
    .eq("role", "member");
  revalidatePath("/admin");
}

export async function rejectTherapist(profileId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("othub_profiles")
    .update({ therapist_requested_at: null, license_no: null, org: null })
    .eq("id", profileId)
    .eq("role", "member");
  revalidatePath("/admin");
}

export async function adminDeleteComment(commentId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("othub_comments").delete().eq("id", commentId);
  revalidatePath("/admin");
}

export async function toggleContentStatus(contentId: string, publish: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("othub_content_items")
    .update({ status: publish ? "published" : "draft", updated_at: new Date().toISOString() })
    .eq("id", contentId);
  revalidatePath("/admin");
  revalidatePath("/hub");
}

export async function deleteContent(contentId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("othub_content_items").delete().eq("id", contentId);
  revalidatePath("/admin");
  revalidatePath("/hub");
}

const CONTENT_TYPES = ["app", "video", "book", "tool", "info", "project"] as const;

function parseTagList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function saveContent(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const title = String(formData.get("title") ?? "").trim();

  if (!slug || !title) return { error: "slug와 제목은 필수입니다." };
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: "slug는 영소문자·숫자·하이픈만 가능합니다." };
  if (!CONTENT_TYPES.includes(type as (typeof CONTENT_TYPES)[number]))
    return { error: "콘텐츠 타입이 올바르지 않습니다." };

  const row = {
    slug,
    type,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    external_url: String(formData.get("external_url") ?? "").trim() || null,
    app_path: String(formData.get("app_path") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    requires_camera: formData.get("requires_camera") === "on",
    tags: parseTagList(formData.get("tags")),
    peo_tags: parseTagList(formData.get("peo_tags")),
    status: formData.get("publish") === "on" ? "published" : "draft",
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("othub_content_items").update(row).eq("id", id)
    : await supabase.from("othub_content_items").insert(row);

  if (error) {
    return {
      error: error.code === "23505" ? "이미 사용 중인 slug입니다." : "저장 중 오류가 발생했습니다.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/hub");
  return { error: null };
}
