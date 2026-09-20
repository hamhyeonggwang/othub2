// Local-only fake backend. Never forward requests or load production credentials.
import { createServer } from "node:http";
const views = [];
const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:4181");
  response.setHeader("Content-Type", "application/json");
  if (url.pathname === "/health") return response.end('{}');
  if (url.pathname === "/__views") return response.end(JSON.stringify(views));
  if (url.pathname === "/rest/v1/othub_page_views" && request.method === "POST") {
    let body = "";
    for await (const chunk of request) body += chunk;
    views.push(JSON.parse(body));
    response.statusCode = 201;
    return response.end('{}');
  }
  if (url.pathname === "/rest/v1/othub_content_items") {
    // Deliberately slow data fetch to expose navigation feedback regressions.
    await new Promise((resolve) => setTimeout(resolve, 900));
  }
  if (url.pathname.startsWith("/rest/v1/")) return response.end('[]');
  response.statusCode = 401;
  response.end('{"error":"No test session"}');
});
server.listen(4181, "127.0.0.1");
