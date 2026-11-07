import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isReadOnlyPreview, PREVIEW_READ_ONLY_MESSAGE } from "@/lib/deployment";
import { isSameOrigin } from "@/lib/analytics";
import { validateEfSave } from "@/lib/ef-session";

/** 실행기능 과제 결과 저장 (인증 치료사·관리자만, 본인 기록으로) */
export async function POST(request: Request) {
  if (isReadOnlyPreview()) return NextResponse.json({ error: PREVIEW_READ_ONLY_MESSAGE }, { status: 403 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const { data: profile } = await supabase.from("othub_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "therapist" && profile?.role !== "admin") {
    return NextResponse.json({ error: "치료사 인증 회원만 결과를 저장할 수 있습니다." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }
  const parsed = validateEfSave(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const v = parsed.value;

  const { data: session, error } = await supabase
    .from("othub_ef_sessions")
    .insert({
      therapist_id: user.id, subject_code: v.subjectCode, task: v.task,
      summary: v.summary, device: v.device, started_at: v.startedAt,
    })
    .select("id")
    .single();
  if (error || !session) return NextResponse.json({ error: "저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });

  const { error: trialError } = await supabase.from("othub_ef_trials").insert({ session_id: session.id, trials: v.trials });
  if (trialError) {
    // 시행 기록이 빠진 반쪽 세션을 남기지 않는다
    await supabase.from("othub_ef_sessions").delete().eq("id", session.id);
    return NextResponse.json({ error: "시행 기록을 저장하지 못했습니다. 다시 시도해 주세요." }, { status: 500 });
  }
  return NextResponse.json({ id: session.id, subjectCode: v.subjectCode });
}
