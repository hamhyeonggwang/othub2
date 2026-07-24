import type { Metadata } from "next";
import Link from "next/link";
import "../hub/hub.css";
import SiteHeader from "@/components/SiteHeader";
import { getPublishedContent } from "@/lib/supabase/content";
import { SITE_CATEGORY, SITE_CATEGORY_ORDER } from "@/lib/useful-sites";

export const metadata: Metadata = {
  title: "Link",
  description: "관련 협회·학회·커뮤니티 등 작업치료사에게 유용한 외부 사이트 모음.",
};

export default async function LinksPage() {
  const items = (await getPublishedContent()).filter(
    (item) => item.tags.includes("Web") && SITE_CATEGORY[item.slug]
  );

  const grouped = SITE_CATEGORY_ORDER.map((category) => ({
    category,
    sites: items.filter((item) => SITE_CATEGORY[item.slug] === category),
  })).filter((g) => g.sites.length > 0);

  return (
    <>
      <SiteHeader />
      <div className="hub-shell" id="main">
        <Link className="hub-back" href="/">
          ← OTHub 홈으로
        </Link>

        <div className="hub-header">
          <h1 className="hub-title">Link</h1>
          <p className="hub-desc">
            작업치료사에게 도움이 되는 협회·학회·커뮤니티 사이트를 모았습니다.
          </p>
        </div>

        {grouped.length === 0 && <p className="hub-empty">등록된 사이트가 없습니다.</p>}

        {grouped.map((g) => (
          <section key={g.category} className="about-section">
            <h2>{g.category}</h2>
            <div className="hub-grid">
              {g.sites.map((site) => (
                <a
                  key={site.slug}
                  className="hub-card-external"
                  href={site.external_url ?? "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <h3>{site.title}</h3>
                  <p>{site.description}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
