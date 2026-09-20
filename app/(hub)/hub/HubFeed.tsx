"use client";

import { useMemo, useState } from "react";
import {
  PEO_FILTERS,
  TYPE_LABEL,
  type ContentItemWithStats,
} from "@/lib/supabase/content-types";
import { externalContentUrl } from "@/lib/catalog";
import WorkspaceIcon from "@/components/WorkspaceIcon";

const TYPE_CHIPS = [
  { key: "all", label: "전체" },
  { key: "video", label: "영상" },
  { key: "info", label: "정보" },
] as const;

export default function HubFeed({ items }: { items: ContentItemWithStats[] }) {
  const [type, setType] = useState<string>("all");
  const [peo, setPeo] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (type !== "all" && item.type !== type) return false;
        if (peo && !item.peo_tags.includes(peo)) return false;
        const text =
          `${item.title} ${item.description ?? ""} ${item.tags.join(" ")} ${item.peo_tags.join(" ")}`
            .normalize("NFC")
            .toLowerCase();
        return query
          .normalize("NFC")
          .trim()
          .toLowerCase()
          .split(/\s+/)
          .every((term) => text.includes(term));
      }),
    [items, type, peo, query],
  );
  const hasFilters = type !== "all" || peo !== null || query.length > 0;
  const reset = () => {
    setType("all");
    setPeo(null);
    setQuery("");
  };

  return (
    <section className="catalog" aria-label="콘텐츠 탐색">
      <div className="catalog-controls">
        <label className="catalog-search">
          <WorkspaceIcon kind="search" />
          <span className="visually-hidden">콘텐츠 검색</span>
          <input
            type="search"
            placeholder="제목, 주제, 키워드로 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <nav className="catalog-categories" aria-label="콘텐츠 타입 필터">
          {TYPE_CHIPS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              data-active={type === key}
              aria-pressed={type === key}
              onClick={() => setType(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <details className="content-topics">
          <summary>관심 주제로 좁혀보기{peo ? ` · ${peo}` : ""}</summary>
          <div className="catalog-options" role="group" aria-label="PEO 필터">
            {PEO_FILTERS.map((topic) => (
              <button
                type="button"
                key={topic}
                aria-pressed={peo === topic}
                onClick={() => setPeo(peo === topic ? null : topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </details>
      </div>
      <div className="catalog-result-bar">
        <p role="status" aria-live="polite">
          전체 {items.length}개 중 <strong>{filtered.length}개</strong> 콘텐츠
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
              ? "조건에 맞는 콘텐츠가 없습니다"
              : "등록된 콘텐츠가 없습니다"}
          </h2>
          <p>다른 검색어나 주제를 선택해 보세요.</p>
          {hasFilters && (
            <button
              className="button button-secondary"
              type="button"
              onClick={reset}
            >
              전체 콘텐츠 보기
            </button>
          )}
        </div>
      ) : (
        <div className="catalog-grid">
          {filtered.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function FeedCard({ item }: { item: ContentItemWithStats }) {
  const href = externalContentUrl(item.external_url);
  const content = (
    <>
      <div className="tool-card-top">
        <span className="tool-symbol">
          <WorkspaceIcon kind="content" />
        </span>
        <span className="tool-requirement">{TYPE_LABEL[item.type]}</span>
      </div>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <div className="tool-tags">
        {item.tags.slice(0, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="tool-card-bottom">
        <span>{href ? "자료 열기 ↗" : "링크 준비 중"}</span>
        {href && <small>새 창에서 열립니다</small>}
      </div>
    </>
  );
  return href ? (
    <a
      className="tool-card"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {content}
    </a>
  ) : (
    <article className="tool-card">{content}</article>
  );
}
