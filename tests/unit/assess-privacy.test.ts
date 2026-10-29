import { expect, it } from "vitest";
import { scrubber } from "@/lib/assess-privacy";

it("removes diagnosis and birth values from report HTML", () => {
  const scrub = scrubber(["뇌성마비", "2015-03-02"]);
  const html = "<div>A-03 · 뇌성마비 · 평가일: 2026-10-29</div><p>생년월일 2015-03-02</p>";
  const out = scrub(html);
  expect(out).not.toContain("뇌성마비");
  expect(out).not.toContain("2015-03-02");
  expect(out).toContain("A-03");
  expect(out).toContain("2026-10-29");
});
it("also removes the HTML-escaped form", () => {
  const out = scrubber(["ASD & ADHD"])("<b>ASD &amp; ADHD</b>");
  expect(out).toBe("<b>—</b>");
});
it.each([[undefined], [null], [""], ["뇌"]])("leaves HTML unchanged for %s", (v) => {
  expect(scrubber([v])("<p>뇌병변</p>")).toBe("<p>뇌병변</p>");
});
