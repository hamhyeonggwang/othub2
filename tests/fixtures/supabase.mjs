// Local-only fake backend. Never forward requests or load production credentials.
import { createServer } from "node:http";
const views = [];
// Representative public-content shapes only; no production or patient records.
const base = {
  description: null,
  thumb_url: null,
  external_url: null,
  app_path: null,
  category: null,
  requires_camera: false,
  tags: [],
  peo_tags: [],
  status: "published",
  view_count: 0,
  created_at: "2026-01-01T00:00:00Z",
};
const content = [
  {
    ...base,
    id: "tool-1",
    type: "app",
    slug: "cu-kiosk-trainer",
    app_path: "/apps/test-tool.html",
    title: "CU 편의점 셀프계산대 훈련",
    description: "편의점 바코드 스캔부터 결제까지 연습합니다.",
    category: "kiosk",
    tags: ["키오스크", "I-ADL"],
    peo_tags: ["지역사회"],
  },
  {
    ...base,
    id: "tool-2",
    type: "app",
    slug: "airdrawing",
    app_path: "/apps/test-tool.html",
    title: "에어 드로잉",
    description: "손을 움직이며 허공에 그림을 그립니다.",
    category: "hand",
    requires_camera: true,
    tags: ["손 동작", "상지기능"],
  },
  {
    ...base,
    id: "tool-3",
    type: "app",
    slug: "gazeplay-stars",
    app_path: "/apps/test-tool.html",
    title: "GazePlay 별자리 그리기",
    description: "시선을 움직여 별을 연결합니다.",
    category: "gaze",
    requires_camera: true,
    tags: ["시선 추적"],
  },
  {
    ...base,
    id: "content-1",
    type: "video",
    slug: "sample-video",
    title: "감각통합 활동 영상",
    description: "활동을 살펴보는 영상 자료입니다.",
    tags: ["감각통합"],
    peo_tags: ["학교"],
    external_url: "https://example.com/video",
  },
  {
    ...base,
    id: "content-2",
    type: "info",
    slug: "sample-guide",
    title: "일상생활 참고 자료",
    description: "일상생활 활동을 위한 참고 자료입니다.",
    tags: ["일상생활"],
    peo_tags: ["지역사회"],
  },
];
const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:4181");
  // Test-only session interpretation. This server binds to localhost and is
  // excluded from deployment; no application auth or RLS bypass is introduced.
  let scenario;
  try {
    const token = request.headers.authorization?.replace(/^Bearer /, "");
    scenario = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    ).fixture;
  } catch {
    /* Anonymous fixture request. */
  }
  const validScenario = [
    "member",
    "pending",
    "therapist",
    "admin",
    "admin-stats-error",
    "admin-top-error",
    "admin-empty",
    "empty-therapist",
  ].includes(scenario);
  const role =
    validScenario && scenario.startsWith("admin")
      ? "admin"
      : ["therapist", "empty-therapist"].includes(scenario)
        ? "therapist"
        : "member";
  const user = {
    id: "11111111-1111-4111-8111-111111111111",
    email: "fixture-user@example.invalid",
    role: "authenticated",
    aud: "authenticated",
    app_metadata: {},
    user_metadata: {},
    created_at: "2026-01-01T00:00:00Z",
  };
  response.setHeader("Content-Type", "application/json");
  if (url.pathname === "/health") return response.end("{}");
  // Stop OAuth tests at a local page, including native form redirect chains.
  // Never forward this endpoint to Google or issue a real session.
  if (url.pathname === "/auth/v1/authorize") {
    response.setHeader("Content-Type", "text/html");
    return response.end(
      "<!doctype html><html><body><h1>Local OAuth destination</h1></body></html>",
    );
  }
  if (
    url.pathname.startsWith("/rest/v1/rpc/othub_admin_") &&
    validScenario &&
    role === "admin"
  ) {
    const isStats = url.pathname.endsWith("othub_admin_pageview_stats");
    const isTop = url.pathname.endsWith("othub_admin_top_pages");
    if (
      (isStats && scenario === "admin-stats-error") ||
      (isTop && scenario === "admin-top-error")
    ) {
      response.statusCode = 500;
      return response.end(
        JSON.stringify({
          code: "fixture_error",
          message: "Local test query failure",
        }),
      );
    }
    if (isStats)
      return response.end(
        JSON.stringify([
          scenario === "admin-empty"
            ? {
                total_views: 0,
                views_7d: 0,
                views_30d: 0,
                visitors_7d: 0,
                visitors_30d: 0,
              }
            : {
                total_views: 1200,
                views_7d: 84,
                views_30d: 360,
                visitors_7d: 28,
                visitors_30d: 90,
              },
        ]),
      );
    if (isTop) {
      let body = "";
      for await (const chunk of request) body += chunk;
      const { days } = JSON.parse(body || "{}");
      return response.end(
        JSON.stringify(
          scenario === "admin-empty"
            ? []
            : [
                { path: "/hub/apps", views: days === 30 ? 180 : 42 },
                {
                  path: "/hub/apps/cu-kiosk-trainer",
                  views: days === 30 ? 120 : 28,
                },
                { path: "/hub", views: days === 30 ? 60 : 14 },
              ],
        ),
      );
    }
  }
  if (url.pathname === "/auth/v1/user" && validScenario)
    return response.end(JSON.stringify(user));
  if (url.pathname === "/rest/v1/othub_profiles" && validScenario)
    return response.end(
      JSON.stringify({
        id: user.id,
        display_name: "테스트 회원",
        role,
        therapist_requested_at:
          scenario === "pending" ? "2026-01-01T00:00:00Z" : null,
        approved_at: null,
      }),
    );
  if (url.pathname === "/rest/v1/othub_bookmarks" && validScenario)
    return response.end(
      JSON.stringify(
        ["therapist", "admin"].includes(scenario)
          ? [
              { content_id: "tool-1" },
              { content_id: "content-1" },
              { content_id: "content-2" },
            ]
          : [],
      ),
    );
  if (url.pathname === "/rest/v1/othub_assessment_sessions" && validScenario)
    return response.end(
      JSON.stringify(
        ["therapist", "admin"].includes(scenario)
          ? [1, 2, 3, 4].map((id) => ({
              id: `fixture-session-${id}`,
              client_code: `샘플-${id}`,
              client_meta: {},
              tools: [],
              status: id === 1 ? "in_progress" : "done",
              created_at: `2026-01-0${5 - id}T00:00:00Z`,
              updated_at: "2026-01-05T00:00:00Z",
            }))
          : [],
      ),
    );
  if (url.pathname === "/__views") return response.end(JSON.stringify(views));
  if (
    url.pathname === "/rest/v1/othub_page_views" &&
    request.method === "POST"
  ) {
    let body = "";
    for await (const chunk of request) body += chunk;
    views.push(JSON.parse(body));
    response.statusCode = 201;
    return response.end("{}");
  }
  if (url.pathname === "/rest/v1/othub_content_items") {
    // Deliberately slow data fetch to expose navigation feedback regressions.
    await new Promise((resolve) => setTimeout(resolve, 900));
    const slug = url.searchParams.get("slug")?.replace(/^eq\./, "");
    const ids = url.searchParams
      .get("id")
      ?.replace(/^in\.\(/, "")
      .replace(/\)$/, "")
      .split(",");
    return response.end(
      JSON.stringify(
        slug
          ? (content.find((item) => item.slug === slug) ?? null)
          : ids
            ? content.filter((item) => ids.includes(item.id))
            : content,
      ),
    );
  }
  if (url.pathname.startsWith("/rest/v1/")) return response.end("[]");
  response.statusCode = 401;
  response.end('{"error":"No test session"}');
});
server.listen(4181, "127.0.0.1");
