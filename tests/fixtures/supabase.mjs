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
    title: "에어 드로잉",
    description: "손을 움직이며 허공에 그림을 그립니다.",
    category: "hand",
    requires_camera: true,
    tags: ["손 인식", "상지기능"],
  },
  {
    ...base,
    id: "tool-3",
    type: "app",
    slug: "gazeplay-stars",
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
  response.setHeader("Content-Type", "application/json");
  if (url.pathname === "/health") return response.end("{}");
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
    return response.end(
      JSON.stringify(
        slug ? (content.find((item) => item.slug === slug) ?? null) : content,
      ),
    );
  }
  if (url.pathname.startsWith("/rest/v1/")) return response.end("[]");
  response.statusCode = 401;
  response.end('{"error":"No test session"}');
});
server.listen(4181, "127.0.0.1");
