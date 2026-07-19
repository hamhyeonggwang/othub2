import type { Metadata } from "next";
import Link from "next/link";
import "./hub.css";
import { getPublishedContent } from "@/lib/supabase/content";
import HubFeed from "./HubFeed";

export const metadata: Metadata = {
  title: "콘텐츠 허브",
  description:
    "훈련 웹앱, 치료 영상, 학회 정보, 임상 도구를 한곳에서 탐색하세요.",
};

export default async function HubPage() {
  const items = await getPublishedContent();

  return (
    <div className="hub-shell">
      <div className="hub-header">
        <Link className="hub-back" href="/">
          ← OTHub 홈으로
        </Link>
        <h1 className="hub-title">콘텐츠 허브</h1>
        <p className="hub-desc">
          작업치료사가 큐레이션한 훈련 웹앱·영상·학회 정보·임상 도구를 한곳에서
          탐색하세요. PEO(사람·환경·작업) 관점으로도 찾아볼 수 있습니다.
        </p>
      </div>

      <HubFeed items={items} />
    </div>
  );
}
