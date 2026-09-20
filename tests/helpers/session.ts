import type { BrowserContext } from "@playwright/test";

// Local fake backend only. Never use production credentials or real sessions.
export async function signInFixture(context: BrowserContext, scenario: string) {
  const expires = Math.floor(Date.now() / 1000) + 3600;
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const token = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: "11111111-1111-4111-8111-111111111111", exp: expires, fixture: scenario })}.test-only`;
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      url: "http://127.0.0.1:4180",
      value: `base64-${encode({ access_token: token, refresh_token: "test-only", token_type: "bearer", expires_at: expires, expires_in: 3600, user: { id: "11111111-1111-4111-8111-111111111111" } })}`,
    },
  ]);
}
