import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** 과제 결과 화면이 '저장' 상자를 보여 줄지 정한다: 인증 치료사·관리자만 true */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ canSave: false }, { headers: { "cache-control": "no-store" } });
  const { data: profile } = await supabase.from("othub_profiles").select("role").eq("id", user.id).single();
  const canSave = profile?.role === "therapist" || profile?.role === "admin";
  return NextResponse.json({ canSave }, { headers: { "cache-control": "no-store" } });
}
