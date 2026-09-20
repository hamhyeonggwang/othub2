import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  // Public telemetry validates its own request and does not use authentication.
  if (request.nextUrl.pathname === "/api/page-view") return supabaseResponse;

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

  // Record committed navigations in the browser, never prefetch/RSC requests.
  const redirectWithCookies = (path: string) => {
    const response = NextResponse.redirect(new URL(path, request.url));
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    return response;
  };

  // 역할 가드: /assess(정적 평가 도구 포함)는 치료사·관리자, /admin은 관리자만
  const needsRole = pathname.startsWith("/assess") || pathname.startsWith("/admin");

  if (needsRole) {
    if (!user) {
      const next = pathname.startsWith("/admin") ? "/admin" : "/assess";
      return redirectWithCookies(`/login?next=${next}`);
    }
    const { data: profile } = await supabase
      .from("othub_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role;

    if (pathname.startsWith("/admin") && role !== "admin") {
      return redirectWithCookies("/me");
    }
    if (pathname.startsWith("/assess") && role !== "therapist" && role !== "admin") {
      return redirectWithCookies("/me?assess=locked");
    }
  }

  return supabaseResponse;
}
