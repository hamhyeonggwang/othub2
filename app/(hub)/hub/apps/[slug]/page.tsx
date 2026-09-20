import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../hub.css";
import "../../catalog.css";
import "../../../workspace-detail.css";
import { getContentBySlug, getComments } from "@/lib/supabase/content";
import { getAuthUser } from "@/lib/supabase/auth";
import LikeBookmarkButtons from "@/components/LikeBookmarkButtons";
import CommentSection from "@/components/CommentSection";
import AppFrame from "@/components/AppFrame";
import { APP_CATEGORIES } from "@/lib/supabase/content-types";
import { toolCategory } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = await getContentBySlug(slug);
  if (!app || app.type !== "app") return {};
  return {
    title: app.title,
    description: app.description ?? undefined,
    alternates: { canonical: `/hub/apps/${slug}` },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await getContentBySlug(slug);
  if (!app || app.type !== "app" || !app.app_path) notFound();

  const path = `/hub/apps/${slug}`;
  const [comments, user] = await Promise.all([
    getComments(app.id),
    getAuthUser(),
  ]);

  const category = toolCategory(app.category);
  const categoryLabel = APP_CATEGORIES.find(
    (item) => item.key === category,
  )?.label;

  return (
    <main className="hub-shell detail-workspace" id="main">
      <Link
        className="hub-back"
        href={category === "all" ? "/hub/apps" : `/hub/apps?cat=${category}`}
      >
        ← 훈련 도구 목록으로
      </Link>
      <header className="workspace-heading detail-heading">
        <p className="workspace-eyebrow">TOOL WORKSPACE</p>
        <h1>{app.title}</h1>
        <p className="hub-desc">{app.description}</p>
        <div className="detail-facts">
          {category !== "all" && <span>{categoryLabel}</span>}
          <span>
            {app.requires_camera ? "카메라 사용" : "카메라 없이 이용"}
          </span>
          <span>로그인 없이 실행</span>
        </div>
        <div className="hub-card-tags detail-tags">
          {app.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </header>
      <div className="detail-layout">
        <section className="detail-player" aria-labelledby="tool-player-title">
          <div className="workspace-section-heading">
            <h2 id="tool-player-title">훈련 화면</h2>
            <span>화면 안의 안내에 따라 시작하세요</span>
          </div>
          <AppFrame
            src={app.app_path}
            title={app.title}
            requiresCamera={app.requires_camera}
          />
          <p className="workspace-caption">
            화면이 작게 느껴지면 도구 오른쪽 위의 전체화면 버튼을 이용하세요.
          </p>
        </section>
        <aside className="detail-guide" aria-label="도구 이용 안내">
          <section className="workspace-panel">
            <p className="workspace-eyebrow">GET READY</p>
            <h2>시작하기 전에</h2>
            <p>
              {app.requires_camera
                ? "이 도구는 카메라를 사용합니다. 브라우저에서 카메라 권한을 허용하고, 화면에 나오는 위치 안내에 맞춰 주세요."
                : "카메라를 켜지 않아도 이용할 수 있습니다. 도구 화면의 조작 안내를 먼저 확인해 주세요."}
            </p>
            {app.requires_camera && (
              <p className="workspace-callout">
                카메라가 연결되지 않으면 브라우저의 사이트 권한과 카메라를 사용
                중인 다른 앱을 확인해 주세요.
              </p>
            )}
          </section>
          <section className="workspace-panel">
            <h2>다시 찾기 쉽게</h2>
            <p>북마크한 도구는 My Hub의 저장한 자료에서 다시 열 수 있습니다.</p>
            <LikeBookmarkButtons
              contentId={app.id}
              path={path}
              likeCount={app.likeCount}
              likedByMe={app.likedByMe}
              bookmarkedByMe={app.bookmarkedByMe}
              isLoggedIn={!!user}
            />
            {!user && (
              <Link
                className="workspace-text-link"
                href={`/login?next=${encodeURIComponent(path)}`}
              >
                로그인하고 북마크하기 →
              </Link>
            )}
          </section>
        </aside>
      </div>
      <section
        className="workspace-panel detail-discussion"
        aria-label="이용 의견"
      >
        <CommentSection
          contentId={app.id}
          path={path}
          comments={comments}
          isLoggedIn={!!user}
        />
      </section>
    </main>
  );
}
