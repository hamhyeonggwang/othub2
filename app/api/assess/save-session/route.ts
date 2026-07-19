import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ToolReport {
  title?: string;
  html?: string;
}

interface SaveSessionBody {
  cloudSessionId?: string | null;
  info?: {
    name?: string;
    date?: string;
    gender?: string;
    birth?: string;
    diagnosis?: string;
    therapist?: string;
  };
  ready?: string[];
  reportByTool?: Record<string, ToolReport>;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("othub_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "therapist" && profile.role !== "admin")) {
    return NextResponse.json(
      { error: "치료사 인증 회원만 평가 결과를 저장할 수 있습니다." },
      { status: 403 }
    );
  }

  const body = (await request.json()) as SaveSessionBody;
  const ready = body.ready ?? [];
  const reportByTool = body.reportByTool ?? {};
  const info = body.info ?? {};

  if (ready.length === 0) {
    return NextResponse.json({ error: "저장할 평가 데이터가 없습니다." }, { status: 400 });
  }

  // client_code는 치료사 본인 계정에만 RLS로 노출되는 값이지만,
  // 환경(공용 PC 등)을 고려해 실명 대신 이니셜·코드 사용을 권장한다.
  const clientCode = (info.name || "무기명").trim().slice(0, 100);
  const clientMeta = {
    gender: info.gender ?? null,
    birth: info.birth ?? null,
    diagnosis: info.diagnosis ?? null,
    therapist: info.therapist ?? null,
    date: info.date ?? null,
  };

  let sessionId = body.cloudSessionId ?? null;

  if (sessionId) {
    const { data: existing } = await supabase
      .from("othub_assessment_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("therapist_id", user.id)
      .maybeSingle();
    if (!existing) sessionId = null;
  }

  if (sessionId) {
    await supabase
      .from("othub_assessment_sessions")
      .update({
        client_code: clientCode,
        client_meta: clientMeta,
        tools: ready,
        status: "done",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    await supabase.from("othub_assessment_results").delete().eq("session_id", sessionId);
  } else {
    const { data: created, error } = await supabase
      .from("othub_assessment_sessions")
      .insert({
        therapist_id: user.id,
        client_code: clientCode,
        client_meta: clientMeta,
        tools: ready,
        status: "done",
      })
      .select("id")
      .single();

    if (error || !created) {
      return NextResponse.json({ error: "세션 저장 중 오류가 발생했습니다." }, { status: 500 });
    }
    sessionId = created.id;
  }

  const resultRows = ready
    .filter((toolId) => reportByTool[toolId]?.html)
    .map((toolId) => ({
      session_id: sessionId,
      tool_id: toolId,
      raw: { title: reportByTool[toolId].title ?? toolId, html: reportByTool[toolId].html },
      summary: { title: reportByTool[toolId].title ?? toolId },
    }));

  if (resultRows.length > 0) {
    const { error: resultsError } = await supabase
      .from("othub_assessment_results")
      .insert(resultRows);
    if (resultsError) {
      return NextResponse.json({ error: "평가 결과 저장 중 오류가 발생했습니다." }, { status: 500 });
    }
  }

  return NextResponse.json({ sessionId });
}
