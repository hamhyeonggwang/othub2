export type SiteCategory = "관련협회" | "OT학회" | "OT정보커뮤니티" | "기타";

export const SITE_CATEGORY_ORDER: SiteCategory[] = [
  "관련협회",
  "OT학회",
  "OT정보커뮤니티",
  "기타",
];

/** slug -> 유용한 사이트 카테고리. 새 Web 링크를 등록하면 여기에 추가한다. */
export const SITE_CATEGORY: Record<string, SiteCategory> = {
  "site-kaot": "관련협회",
  "site-kasdr": "관련협회",
  "site-ksot": "OT학회",
  "site-ksotcs": "OT학회",
  "site-kasi": "OT학회",
  "site-jakgeopgongbang": "OT정보커뮤니티",
  "site-digital-learning": "기타",
};
