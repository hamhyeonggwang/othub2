"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  APP_CATEGORIES,
  type ContentItemWithStats,
} from "@/lib/supabase/content-types";
import { filterTools, toolCategory, type CameraFilter } from "@/lib/catalog";
import WorkspaceIcon, {
  type WorkspaceIconKind,
} from "@/components/WorkspaceIcon";

const cameraOptions = [
  { key: "all", label: "모든 환경" },
  { key: "without", label: "카메라 없이" },
  { key: "with", label: "카메라 활용" },
] as const;

export default function ToolCatalog({
  items,
}: {
  items: ContentItemWithStats[];
}) {
  const params = useSearchParams();
  const category = toolCategory(params.get("cat"));
  const [camera, setCamera] = useState<CameraFilter>("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => filterTools(items, category, camera, query),
    [items, category, camera, query],
  );
  const hasFilters = category !== "all" || camera !== "all" || query.length > 0;

  const changeCategory = (key: string) => {
    const next = new URL(window.location.href);
    if (key === "all") next.searchParams.delete("cat");
    else next.searchParams.set("cat", key);
    if (next.href !== window.location.href)
      window.history.pushState(
        null,
        "",
        `${next.pathname}${next.search}${next.hash}`,
      );
  };
  const reset = () => {
    setQuery("");
    setCamera("all");
    changeCategory("all");
  };

  return (
    <section className="catalog" aria-label="훈련 도구 탐색">
      <div className="catalog-controls">
        <label className="catalog-search">
          <WorkspaceIcon kind="search" />
          <span className="visually-hidden">훈련 도구 검색</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="도구 이름, 활동, 키워드로 검색"
          />
          <span className="search-shortcut" aria-hidden="true">
            검색
          </span>
        </label>
        <nav className="catalog-categories" aria-label="카테고리 필터">
          {APP_CATEGORIES.map(({ key, label }) => (
            <Link
              key={key}
              href={key === "all" ? "/hub/apps" : `/hub/apps?cat=${key}`}
              prefetch={false}
              aria-current={category === key ? "true" : undefined}
              data-active={category === key}
              onNavigate={(event) => {
                event.preventDefault();
                changeCategory(key);
              }}
            >
              {label}
              <span aria-hidden="true">
                {key === "all"
                  ? items.length
                  : items.filter((item) => item.category === key).length}
              </span>
            </Link>
          ))}
        </nav>
        <div
          className="catalog-options"
          role="group"
          aria-label="카메라 사용 조건"
        >
          <span>사용 환경</span>
          {cameraOptions.map(({ key, label }) => (
            <button
              type="button"
              key={key}
              aria-pressed={camera === key}
              onClick={() => setCamera(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="catalog-result-bar">
        <p role="status" aria-live="polite">
          전체 {items.length}개 중 <strong>{filtered.length}개</strong> 도구
        </p>
        {hasFilters && (
          <button className="catalog-reset" type="button" onClick={reset}>
            필터 초기화
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="catalog-empty">
          <WorkspaceIcon kind="search" />
          <h2>
            {items.length
              ? "조건에 맞는 도구가 없습니다"
              : "등록된 훈련 도구가 없습니다"}
          </h2>
          <p>
            {items.length
              ? "검색어를 줄이거나 다른 카테고리와 사용 환경을 선택해 보세요."
              : "공개된 도구가 등록되면 이곳에서 확인할 수 있습니다."}
          </p>
          {hasFilters && (
            <button
              type="button"
              className="button button-secondary"
              onClick={reset}
            >
              전체 도구 보기
            </button>
          )}
        </div>
      ) : (
        <div className="catalog-grid">
          {filtered.map((item) => {
            const kind: WorkspaceIconKind =
              item.category === "hand" || item.category === "gaze"
                ? item.category
                : "kiosk";
            return (
              <Link
                className="tool-card"
                data-category={kind}
                href={`/hub/apps/${item.slug}`}
                key={item.id}
              >
                <div className="tool-card-top">
                  <span className="tool-symbol">
                    <WorkspaceIcon kind={kind} />
                  </span>
                  <span className="tool-requirement">
                    {item.requires_camera ? "카메라 필요" : "카메라 없이"}
                  </span>
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="tool-tags">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="tool-card-bottom">
                  <span>
                    도구 열기 <WorkspaceIcon kind="arrow" />
                  </span>
                  <small>
                    좋아요 {item.likeCount} · 댓글 {item.commentCount}
                  </small>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <aside className="catalog-note">
        <WorkspaceIcon kind="assess" />
        <div>
          <strong>평가 도구를 찾고 계신가요?</strong>
          <p>OTHub Assess는 치료사 인증 후 이용할 수 있습니다.</p>
        </div>
        <Link href="/assess">평가 도구 보기 →</Link>
      </aside>
    </section>
  );
}
