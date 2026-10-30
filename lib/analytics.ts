export const VISITOR_COOKIE = "othub_vid";
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const publicPages = new Set([
  "/", "/hub", "/hub/apps", "/assess", "/links", "/lab", "/groups",
  "/about", "/portfolio", "/me", "/privacy", "/terms",
]);

/** Fixed route shapes only: never queries, search terms or assessment IDs. */
export function analyticsPath(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 200 || /[?#%\\\s]/.test(input)) return null;
  const path = input === "/" ? input : input.replace(/\/$/, "");
  if (publicPages.has(path)) return path;
  if (/^\/assess\/[0-9a-f-]{36}$/i.test(path)) return "/assess/session";
  if (/^\/hub\/apps\/[a-z0-9][a-z0-9-]{0,79}$/.test(path)) return path;
  if (/^\/collections\/[a-z0-9][a-z0-9-]{0,79}$/.test(path)) return path;
  if (/^\/l\/[a-z0-9][a-z0-9-]{0,79}$/.test(path)) return path;
  return null;
}

export function isSameOrigin(request: Request): boolean {
  // Next may construct request.url with its internal hostname. Browser Origin
  // must match the incoming Host, not that internal URL or a forwarded host.
  const url = new URL(request.url);
  const host = request.headers.get("host") ?? url.host;
  return request.headers.get("origin") === `${url.protocol}//${host}` &&
    request.headers.get("sec-fetch-site") !== "cross-site";
}
