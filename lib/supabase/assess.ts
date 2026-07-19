import { createClient } from "@/lib/supabase/server";

export interface AssessmentSession {
  id: string;
  client_code: string;
  client_meta: { gender?: string; birth?: string; diagnosis?: string; therapist?: string; date?: string };
  tools: string[];
  status: "in_progress" | "done";
  created_at: string;
  updated_at: string;
}

export interface AssessmentResult {
  id: string;
  session_id: string;
  tool_id: string;
  raw: { title?: string; html?: string };
  created_at: string;
}

export async function getMySessions(): Promise<AssessmentSession[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("othub_assessment_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as AssessmentSession[];
}

export async function getSessionWithResults(
  sessionId: string
): Promise<{ session: AssessmentSession; results: AssessmentResult[] } | null> {
  const supabase = await createClient();
  const { data: session } = await supabase
    .from("othub_assessment_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session) return null;

  const { data: results } = await supabase
    .from("othub_assessment_results")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  return { session: session as AssessmentSession, results: (results ?? []) as AssessmentResult[] };
}
