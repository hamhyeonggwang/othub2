import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  // OTHub Assess(정적 평가 도구 포함)는 치료사·관리자 회원만 접근 가능
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/assess")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login?next=/assess", request.url));
    }
    const { data: profile } = await supabase
      .from("othub_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "therapist" && profile.role !== "admin")) {
      return NextResponse.redirect(new URL("/me?assess=locked", request.url));
    }
  }

  return supabaseResponse;
}
