import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { analyticsPath, isSameOrigin, UUID_PATTERN, VISITOR_COOKIE } from "@/lib/analytics";
import { isReadOnlyPreview } from "@/lib/deployment";

export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  const respond = (status: number) => new NextResponse(null, { status, headers });
  if (!isSameOrigin(request)) return respond(403);
  if (isReadOnlyPreview()) return respond(204);
  if (request.headers.get("dnt") === "1") return respond(204);
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return respond(415);

  // Stream-limit even requests without a Content-Length header.
  const reader = request.body?.getReader();
  if (!reader) return respond(400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  let path: string | null;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 512) {
        await reader.cancel();
        return respond(413);
      }
      chunks.push(value);
    }
    const body: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const rawPath = body && typeof body === "object" && "path" in body ? body.path : null;
    // Client redacts assessment session IDs before transmission.
    path = rawPath === "/assess/session" ? rawPath : analyticsPath(rawPath);
    if (!path) return respond(400);
  } catch {
    return respond(400);
  } finally {
    reader.releaseLock();
  }

  try {
    const existing = request.cookies.get(VISITOR_COOKIE)?.value;
    const visitorId = existing && UUID_PATTERN.test(existing) ? existing : crypto.randomUUID();
    // Existing public INSERT policy; never use a service-role key or user credentials.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(3000) }) },
      },
    );
    const { error } = await supabase.from("othub_page_views").insert({ path, visitor_id: visitorId });
    if (error) return respond(503);
    const response = respond(204);
    if (visitorId !== existing) response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true, secure: request.nextUrl.protocol === "https:",
      sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch {
    return respond(503);
  }
}
