"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle(next?: string) {
  const headerList = await headers();
  const origin =
    headerList.get("origin") ??
    `https://${headerList.get("host")}`;

  // 오픈 리다이렉트 방지: 같은 오리진의 절대 경로만 허용한다.
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  const callbackUrl = safeNext
    ? `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`
    : `${origin}/auth/callback`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=구글 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestTherapistRole(formData: FormData) {
  const licenseNo = String(formData.get("license_no") ?? "").trim();
  const org = String(formData.get("org") ?? "").trim();

  if (!licenseNo) {
    return { error: "면허번호를 입력해 주세요." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("othub_profiles")
    .update({
      license_no: licenseNo,
      org: org || null,
      therapist_requested_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: "요청 중 오류가 발생했습니다." };

  revalidatePath("/me");
  return { error: null };
}

export async function updateDisplayName(formData: FormData) {
  const displayName = String(formData.get("display_name") ?? "").trim();
  if (!displayName) return { error: "이름을 입력해 주세요." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("othub_profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (error) return { error: "저장 중 오류가 발생했습니다." };

  revalidatePath("/me");
  return { error: null };
}
