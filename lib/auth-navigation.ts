/** Validate both the login action and callback; callback URLs are user input. */
export function safeReturnPath(value: string | null | undefined, fallback = "/me"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(value)) return fallback;
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(decoded)) return fallback;
    const url = new URL(value, "https://othub.invalid");
    if (url.origin !== "https://othub.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
