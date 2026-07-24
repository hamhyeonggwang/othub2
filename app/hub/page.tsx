import type { Metadata } from "next";
import Link from "next/link";
import "./hub.css";
import { getPublishedContent } from "@/lib/supabase/content";
import HubFeed from "./HubFeed";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Content",
  description: "치료 영상과 임상 도구를 한곳에서 탐색하세요.",
};

export default async function HubPage() {
  const items = (await getPublishedContent()).filter(
    (item) => item.type !== "app" && item.type !== "project" && !item.tags.includes("Web")
  );

  return (
    <>
      <SiteHeader />
      <div className="hub-shell" id="main">
        <div className="hub-header">
          <Link className="hub-back" href="/">
            ← OTHub 홈으로
          </Link>
          <h1 className="hub-title">Content</h1>
          <p className="hub-desc">
            작업치료사가 큐레이션한 영상·임상 도구를 한곳에서 탐색하세요.
            PEO(사람·환경·작업) 관점으로도 찾아볼 수 있습니다.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link className="hub-apps-cta" href="/hub/apps">
              Tool은 여기서 바로 써보세요 →
            </Link>
            <Link className="hub-apps-cta" href="/links">
              협회·학회 사이트는 Link에서 →
            </Link>
          </div>
        </div>

        <HubFeed items={items} />
      </div>
    </>
  );
}
