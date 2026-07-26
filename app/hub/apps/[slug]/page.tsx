import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../hub.css";
import { getContentBySlug, getComments } from "@/lib/supabase/content";
import { getAuthUser } from "@/lib/supabase/auth";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import LikeBookmarkButtons from "@/components/LikeBookmarkButtons";
import CommentSection from "@/components/CommentSection";
import SiteHeader from "@/components/SiteHeader";
import AppFrame from "@/components/AppFrame";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = await getContentBySlug(slug);
  if (!app || app.type !== "app") return {};
  return { title: app.title, description: app.description ?? undefined };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [app] = await Promise.all([
    getContentBySlug(slug),
    getCurrentUserAndProfile(),
  ]);
  if (!app || app.type !== "app" || !app.app_path) notFound();

  const path = `/hub/apps/${slug}`;
  const [comments, user] = await Promise.all([
    getComments(app.id),
    getAuthUser(),
  ]);

  return (
    <>
      <SiteHeader />
      <div className="hub-shell" id="main">
        <Link className="hub-back" href="/hub/apps">
          ← Tool 목록으로
        </Link>

        <div className="app-detail-header">
          <div className="app-detail-info">
            <h1>{app.title}</h1>
            <p>{app.description}</p>
            <div className="hub-card-tags">
              {app.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {app.requires_camera && (
              <p className="app-camera-note">
                이 훈련은 웹캠 접근 권한이 필요합니다. 브라우저에서 카메라
                사용을 허용해 주세요.
              </p>
            )}
            <LikeBookmarkButtons
              contentId={app.id}
              path={path}
              likeCount={app.likeCount}
              likedByMe={app.likedByMe}
              bookmarkedByMe={app.bookmarkedByMe}
              isLoggedIn={!!user}
            />
          </div>
        </div>

        <AppFrame
          src={app.app_path}
          title={app.title}
          requiresCamera={app.requires_camera}
        />

        <CommentSection
          contentId={app.id}
          path={path}
          comments={comments}
          isLoggedIn={!!user}
        />
      </div>
    </>
  );
}
