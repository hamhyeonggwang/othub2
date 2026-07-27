import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PAGE_VIEW_SKIP_PREFIXES = ["/api", "/auth"];
const VISITOR_COOKIE = "othub_vid";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser()는 매 요청 세션을 검증·갱신한다 — getSession()만 쓰면 만료된 세션도 통과한다
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 익명 방문자 식별용 쿠키 — 통계 집계 전용, 개인정보 아님(무작위 UUID)
  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    supabaseResponse.cookies.set(VISITOR_COOKIE, visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });
  }

  if (!PAGE_VIEW_SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
    try {
      await supabase
        .from("othub_page_views")
        .insert({ path: pathname, visitor_id: visitorId });
    } catch {
      // 방문 기록 실패가 페이지 로딩을 막지 않도록 무시
    }
  }

  // 역할 가드: /assess(정적 평가 도구 포함)는 치료사·관리자, /admin은 관리자만
  const needsRole = pathname.startsWith("/assess") || pathname.startsWith("/admin");

  if (needsRole) {
    if (!user) {
      const next = pathname.startsWith("/admin") ? "/admin" : "/assess";
      return NextResponse.redirect(new URL(`/login?next=${next}`, request.url));
    }
    const { data: profile } = await supabase
      .from("othub_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role;

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/me", request.url));
    }
    if (pathname.startsWith("/assess") && role !== "therapist" && role !== "admin") {
      return NextResponse.redirect(new URL("/me?assess=locked", request.url));
    }
  }

  return supabaseResponse;
}
