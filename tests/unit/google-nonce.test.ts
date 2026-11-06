import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { generateGoogleNonce } from "@/lib/google-nonce";

it("returns a random nonce and its SHA-256 hex digest", async () => {
  const a = await generateGoogleNonce();
  const b = await generateGoogleNonce();
  expect(a.raw).not.toBe(b.raw);
  expect(a.hashed).toBe(createHash("sha256").update(a.raw).digest("hex"));
  expect(a.hashed).toMatch(/^[0-9a-f]{64}$/);
});
