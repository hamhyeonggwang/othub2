import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isReadOnlyPreview, PREVIEW_READ_ONLY_MESSAGE } from "@/lib/deployment";
import { isSameOrigin } from "@/lib/analytics";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 시행 기록 CSV 내려받기 (RLS로 본인 기록만 보인다) */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  const supabase = await createClient();
  const { data: session } = await supabase
    .from("othub_ef_sessions")
    .select("task, subject_code, started_at, othub_ef_trials(trials)")
    .eq("id", id)
    .single();
  const trials = (session?.othub_ef_trials as { trials?: Record<string, unknown>[] } | null)?.trials;
  if (!session || !trials) return NextResponse.json({ error: "기록을 찾을 수 없습니다." }, { status: 404 });
  const cols = [...new Set(trials.flatMap((t) => Object.keys(t)))];
  const cell = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "﻿" + [cols.join(","), ...trials.map((t) => cols.map((c) => cell(t[c])).join(","))].join("\r\n");
  const stamp = String(session.started_at).slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="othub-${session.task}-${session.subject_code}-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}

/** 기록 삭제 (본인 기록만) */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (isReadOnlyPreview()) return NextResponse.json({ error: PREVIEW_READ_ONLY_MESSAGE }, { status: 403 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase.from("othub_ef_sessions").delete().eq("id", id).select("id");
  if (error) return NextResponse.json({ error: "삭제하지 못했습니다." }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: "기록을 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
