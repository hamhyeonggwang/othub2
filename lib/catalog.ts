import type { ContentItemWithStats } from "@/lib/supabase/content-types";

export type ToolCategory = "all" | "kiosk" | "hand" | "gaze" | "assistive";
export type CameraFilter = "all" | "without" | "with";

export function toolCategory(value: string | null | undefined): ToolCategory {
  return value === "kiosk" ||
    value === "hand" ||
    value === "gaze" ||
    value === "assistive"
    ? value
    : "all";
}

export function filterTools(
  items: ContentItemWithStats[],
  category: ToolCategory,
  camera: CameraFilter,
  query: string,
) {
  const terms = query
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return items.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (camera === "with" && !item.requires_camera) return false;
    if (camera === "without" && item.requires_camera) return false;
    const text =
      `${item.title} ${item.description ?? ""} ${item.tags.join(" ")} ${item.peo_tags.join(" ")}`
        .normalize("NFC")
        .toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
}

export function externalContentUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
