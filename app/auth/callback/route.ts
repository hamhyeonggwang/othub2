import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeReturnPath } from "@/lib/auth-navigation";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeReturnPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // 탈퇴 후 다시 로그인한 계정은 OTHub 프로필이 없으므로 일반 회원으로 새로 만든다
      await Promise.resolve(supabase.rpc("othub_ensure_my_profile")).catch(() => {});
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=인증에 실패했습니다`);
}
