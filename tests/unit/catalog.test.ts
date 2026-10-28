import { expect, it } from "vitest";
import { externalContentUrl, filterTools, toolCategory } from "@/lib/catalog";
import type { ContentItemWithStats } from "@/lib/supabase/content-types";

const base: ContentItemWithStats = {
  id: "one",
  slug: "kiosk",
  title: "편의점 훈련",
  description: null,
  type: "app",
  category: "kiosk",
  tags: ["I-ADL"],
  peo_tags: ["지역사회"],
  requires_camera: false,
  thumb_url: null,
  external_url: null,
  app_path: null,
  status: "published",
  created_at: "",
  view_count: 0,
  likeCount: 0,
  commentCount: 0,
  likedByMe: false,
  bookmarkedByMe: false,
};
const tools = [
  base,
  {
    ...base,
    id: "two",
    title: "손 그림",
    category: "hand",
    requires_camera: true,
  },
];
it("matches all search words across title, tags and topics", () => {
  expect(filterTools(tools, "all", "all", " 편의점   i-adl ")).toEqual([base]);
  expect(filterTools(tools, "all", "all", "지역사회")).toHaveLength(2);
});
it("combines category and camera requirements", () => {
  expect(filterTools(tools, "kiosk", "with", "")).toEqual([]);
  expect(filterTools(tools, "hand", "with", "")).toHaveLength(1);
  expect(filterTools(tools, "all", "without", "")).toEqual([base]);
});
it("accepts the assistive category", () => {
  expect(toolCategory("assistive")).toBe("assistive");
});
it("accepts the cognitive category", () => {
  expect(toolCategory("cognitive")).toBe("cognitive");
});
it.each([undefined, null, "", "unknown", "<script>"])(
  "falls back safely for category %s",
  (value) => {
    expect(toolCategory(value)).toBe("all");
  },
);
it.each([
  null,
  "#",
  "javascript:alert(1)",
  "data:text/html,test",
  "https://user:password@example.com",
])("does not render unsafe or missing content links: %s", (value) => {
  expect(externalContentUrl(value)).toBeNull();
});
it("keeps valid external resource links", () =>
  expect(externalContentUrl("https://example.com/video")).toBe(
    "https://example.com/video",
  ));
