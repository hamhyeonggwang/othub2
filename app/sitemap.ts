import type { MetadataRoute } from "next";
import { getPublishedContent } from "@/lib/supabase/content";
import { COLLECTIONS } from "@/lib/collections";

const BASE_URL = "https://othub.kr";

// 콘텐츠는 Supabase에서 오므로 1시간마다 재생성한다.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/hub`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/hub/apps`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/links`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/groups`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/lab`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const content = await getPublishedContent();
  const appRoutes: MetadataRoute.Sitemap = content
    .filter((item) => item.type === "app")
    .map((item) => ({
      url: `${BASE_URL}/hub/apps/${item.slug}`,
      lastModified: new Date(item.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...appRoutes, ...collectionRoutes];
}
