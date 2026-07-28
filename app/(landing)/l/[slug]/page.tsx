import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../../(hub)/hub/hub.css";
import LandingShell from "@/components/LandingShell";
import { getLandingPage, LANDING_PAGES } from "@/lib/landing-pages";
import { getPublishedContent } from "@/lib/supabase/content";

export function generateStaticParams() {
  return LANDING_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/l/${slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function LandingSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  let toolGrid: { title: string; items: { slug: string; title: string; description: string; badge: string; tags: string[] }[] } | undefined;

  if (page.toolGridAppSlugs && page.toolGridAppSlugs.length > 0) {
    const allContent = await getPublishedContent();
    const items = page.toolGridAppSlugs
      .map((s) => allContent.find((c) => c.slug === s))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => ({
        slug: c.slug,
        title: c.title,
        description: c.description ?? "",
        badge: c.requires_camera ? "카메라 필요" : "클릭만으로 가능",
        tags: c.tags,
      }));
    toolGrid = { title: page.toolGridTitle ?? "관련 도구", items };
  }

  return (
    <LandingShell
      eyebrow={page.eyebrow}
      headline={page.headline}
      subcopy={page.subcopy}
      primaryCta={page.primaryCta}
      secondaryCta={page.secondaryCta}
      toolGrid={toolGrid}
      trailingCta={page.trailingCta}
    />
  );
}
