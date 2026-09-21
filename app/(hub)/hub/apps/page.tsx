import type { Metadata } from "next";
import "../hub.css";
import "../catalog.css";
import { getPublishedContent } from "@/lib/supabase/content";
import ToolCatalog from "@/components/ToolCatalog";

export const metadata: Metadata = {
  title: "Tool",
  description:
    "키오스크 훈련, 손 동작 훈련, 시선 추적 훈련 웹앱을 찾아보세요.",
  alternates: { canonical: "/hub/apps" },
};

export default async function AppsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  // Keep query-dependent initial rendering for direct links and no-JS navigation.
  await searchParams;
  const items = (await getPublishedContent()).filter(
    (item) => item.type === "app",
  );
  return (
    <main className="hub-shell" id="main">
      <header className="workspace-heading">
        <p className="workspace-eyebrow">TOOL LIBRARY</p>
        <h1>훈련 도구</h1>
        <p className="hub-desc">
          오늘 연습할 활동을 찾아보세요.
          <br />
          로그인 없이 시작하고, 사용 환경에 맞는 도구를 선택할 수 있습니다.
        </p>
      </header>
      <ToolCatalog items={items} />
    </main>
  );
}
