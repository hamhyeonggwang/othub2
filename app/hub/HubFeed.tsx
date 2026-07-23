"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  PEO_FILTERS,
  TYPE_LABEL,
  type ContentItemWithStats,
} from "@/lib/supabase/content-types";

type FilterKey = "all" | "video" | "info" | "web";

const TYPE_CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "video", label: "영상" },
  { key: "info", label: "정보" },
  { key: "web", label: "Web" },
];

export default function HubFeed({ items }: { items: ContentItemWithStats[] }) {
  const [type, setType] = useState<FilterKey>("all");
  const [peo, setPeo] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (type === "web" && !item.tags.includes("Web")) return false;
      if (type !== "all" && type !== "web" && item.type !== type) return false;
      if (peo && !item.peo_tags.includes(peo)) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const haystack = `${item.title} ${item.description ?? ""} ${item.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, type, peo, query]);

  return (
    <>
      <input
        className="hub-search"
        type="search"
        placeholder="웹앱, 영상, 정보 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="콘텐츠 검색"
      />

      <nav className="hub-filters" aria-label="콘텐츠 타입 필터">
        {TYPE_CHIPS.map((c) => (
          <button
            key={c.key}
            type="button"
            className="hub-filter"
            data-active={type === c.key}
            onClick={() => setType(c.key)}
          >
            {c.label}
          </button>
        ))}
      </nav>

      <nav className="hub-filters" aria-label="PEO 필터">
        {PEO_FILTERS.map((p) => (
          <button
            key={p}
            type="button"
            className="hub-filter"
            data-active={peo === p}
            onClick={() => setPeo(peo === p ? null : p)}
          >
            {p}
          </button>
        ))}
      </nav>

      <div className="hub-grid">
        {filtered.length === 0 && (
          <p className="hub-empty">조건에 맞는 콘텐츠가 없습니다.</p>
        )}
        {filtered.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}

function FeedCard({ item }: { item: ContentItemWithStats }) {
  const badge = `${item.requires_camera ? "카메라 필요 · " : ""}${TYPE_LABEL[item.type]}`;

  return (
    <a
      className="hub-card-external"
      href={item.external_url ?? "#"}
      target="_blank"
      rel="noreferrer noopener"
    >
      <span className="hub-card-badge">{badge}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="hub-card-tags">
        {item.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </a>
  );
}
