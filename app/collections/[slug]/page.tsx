import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../hub/hub.css";
import SiteHeader from "@/components/SiteHeader";
import { getPublishedContent } from "@/lib/supabase/content";
import { getCollection, COLLECTIONS } from "@/lib/collections";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return { title: collection.title, description: collection.description };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const allContent = await getPublishedContent();
  const tools = collection.appSlugs
    .map((appSlug) => allContent.find((item) => item.slug === appSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <SiteHeader />
      <div className="hub-shell" id="main">
        <Link className="hub-back" href="/">
          ← OTHub 홈으로
        </Link>

        <div className="hub-header">
          <p className="eyebrow">
            <span></span> {collection.eyebrow}
          </p>
          <h1 className="hub-title">{collection.title}</h1>
          <p className="hub-desc">{collection.description}</p>
        </div>

        <h3 className="feed-section-title">훈련 도구 {tools.length}종</h3>
        <div className="hub-grid" style={{ marginBottom: 44 }}>
          {tools.map((tool) => (
            <Link key={tool.slug} className="hub-card" href={`/hub/apps/${tool.slug}`}>
              <span className="hub-card-badge">
                {tool.requires_camera ? "카메라 필요" : "클릭만으로 가능"}
              </span>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <div className="hub-card-tags">
                {tool.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {collection.assessNote && (
          <div className="collection-card">
            <div>
              <p className="eyebrow light">
                <span></span> ASSESSMENT
              </p>
              <h3>평가로 수행 수준 확인하기</h3>
              <p>{collection.assessNote}</p>
              <Link className="button button-light" href="/assess">
                OTHub Assess 열기
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
