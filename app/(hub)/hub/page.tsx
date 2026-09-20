import type { Metadata } from "next";
import Link from "next/link";
import "./hub.css";
import "./catalog.css";
import { getPublishedContent } from "@/lib/supabase/content";
import HubFeed from "./HubFeed";

export const metadata: Metadata = {
  title: "Content",
  description: "치료 영상과 임상 도구를 한곳에서 탐색하세요.",
  alternates: { canonical: "/hub" },
};

export default async function HubPage() {
  const allContent = await getPublishedContent();
  const items = allContent.filter(
    (item) =>
      item.type !== "app" &&
      item.type !== "project" &&
      !item.tags.includes("Web"),
  );

  return (
    <>
      <main className="hub-shell" id="main">
        <header className="workspace-heading">
          <p className="workspace-eyebrow">CONTENT LIBRARY</p>
          <h1>콘텐츠 라이브러리</h1>
          <p className="hub-desc">
            작업치료사가 큐레이션한 영상·임상 도구를 한곳에서 탐색하세요.
            PEO(사람·환경·작업) 관점으로도 찾아볼 수 있습니다.
          </p>
          <div className="workspace-links">
            <Link href="/hub/apps">훈련 도구 찾기 →</Link>
            <Link href="/links">협회·학회 링크 모음 →</Link>
          </div>
        </header>

        <HubFeed items={items} />
      </main>
    </>
  );
}
