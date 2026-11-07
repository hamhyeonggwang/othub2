"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isReadOnlyPreview, PREVIEW_READ_ONLY_MESSAGE } from "@/lib/deployment";

const WITHDRAW_CONFIRM_WORD = "탈퇴";

/**
 * OTHub 회원 탈퇴. 본인의 OTHub 데이터(프로필·댓글·좋아요·북마크·평가 기록)를 지우고 로그아웃한다.
 * 로그인 계정(auth.users)은 같은 Supabase 프로젝트의 다른 앱과 함께 쓰므로 지우지 않는다.
 * 삭제는 DB 함수 othub_delete_my_data()가 auth.uid() 기준으로만 수행한다.
 */
export async function withdrawAccount(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  if (isReadOnlyPreview()) return { error: PREVIEW_READ_ONLY_MESSAGE };
  if (String(formData.get("confirm") ?? "").trim() !== WITHDRAW_CONFIRM_WORD) {
    return { error: `확인을 위해 ‘${WITHDRAW_CONFIRM_WORD}’를 정확히 입력해 주세요.` };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/me");

  const { error } = await supabase.rpc("othub_delete_my_data");
  if (error) {
    if (error.message.includes("last admin")) {
      return { error: "마지막 관리자 계정은 탈퇴할 수 없습니다. 다른 관리자를 먼저 지정해 주세요." };
    }
    return { error: "탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 문의해 주세요." };
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login?withdrawn=1");
}
