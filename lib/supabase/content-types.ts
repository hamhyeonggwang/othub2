export type ContentType = "app" | "video" | "book" | "tool" | "info" | "project";
export type AppCategory = "kiosk" | "hand" | "gaze";
export type ProjectStatus = "available" | "beta" | "research" | "concept";

export interface ContentItem {
  id: string;
  slug: string;
  type: ContentType;
  title: string;
  description: string | null;
  thumb_url: string | null;
  external_url: string | null;
  app_path: string | null;
  category: string | null;
  requires_camera: boolean;
  tags: string[];
  peo_tags: string[];
  status: "draft" | "published";
  view_count: number;
  created_at: string;
}

export interface ContentItemWithStats extends ContentItem {
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  bookmarkedByMe: boolean;
}

export interface CommentWithAuthor {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  authorName: string;
  isMine: boolean;
}

export const TYPE_LABEL: Record<ContentType, string> = {
  app: "웹앱",
  video: "영상",
  book: "도서",
  tool: "도구",
  info: "정보",
  project: "프로젝트",
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  available: "AVAILABLE",
  beta: "BETA",
  research: "RESEARCH",
  concept: "CONCEPT",
};

/** slug -> Lab 프로젝트 진행 상태. 새 프로젝트를 등록하면 여기에 추가한다. */
export const PROJECT_STATUS: Record<string, ProjectStatus> = {
  "tool-gas": "concept",
  "tool-icf-classifier": "research",
  "tool-mbi-fim": "concept",
  "tool-report": "concept",
};

export const APP_CATEGORIES: { key: AppCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "kiosk", label: "키오스크 훈련" },
  { key: "hand", label: "손 인식 AI" },
  { key: "gaze", label: "시선 추적" },
];

export const PEO_FILTERS = [
  "감각통합",
  "인지재활",
  "상지기능",
  "학교",
  "일상생활",
  "지역사회",
  "놀이",
  "병원·임상",
] as const;
