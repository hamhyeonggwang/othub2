import type { Metadata } from "next";
import Link from "next/link";
import "../hub.css";
import { APP_CATEGORIES, getPublishedContent } from "@/lib/supabase/content";

export const metadata: Metadata = {
  title: "훈련 웹앱",
  description: "키오스크 훈련, 손 인식 AI 게임, 시선 추적 훈련 웹앱을 무료로 이용하세요.",
};

export default async function AppsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const params = await searchParams;
  const activeCat = params.cat ?? "all";

  const allContent = await getPublishedContent();
  const allApps = allContent.filter((item) => item.type === "app");
  const apps =
    activeCat === "all"
      ? allApps
      : allApps.filter((app) => app.category === activeCat);

  return (
    <div className="hub-shell">
      <div className="hub-header">
        <Link className="hub-back" href="/hub">
          ← 콘텐츠 허브로
        </Link>
        <h1 className="hub-title">훈련 웹앱</h1>
        <p className="hub-desc">
          로그인 없이 누구나 바로 사용할 수 있습니다. 키오스크 훈련, 손 인식 AI
          게임, 시선 추적 훈련 총 {allApps.length}종을 제공합니다.
        </p>
      </div>

      <nav className="hub-filters" aria-label="카테고리 필터">
        {APP_CATEGORIES.map((c) => (
          <Link
            key={c.key}
            href={c.key === "all" ? "/hub/apps" : `/hub/apps?cat=${c.key}`}
            className="hub-filter"
            data-active={activeCat === c.key}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      <div className="hub-grid">
        {apps.length === 0 && (
          <p className="hub-empty">해당 카테고리의 웹앱이 아직 없습니다.</p>
        )}
        {apps.map((app) => (
          <Link key={app.slug} className="hub-card" href={`/hub/apps/${app.slug}`}>
            <span className="hub-card-badge">
              {app.requires_camera ? "📷 카메라 필요" : "🖱️ 클릭만으로 가능"}
            </span>
            <h3>{app.title}</h3>
            <p>{app.description}</p>
            <div className="hub-card-tags">
              {app.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="hub-card-engage">
              <span>❤️ {app.likeCount}</span>
              <span>💬 {app.commentCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
