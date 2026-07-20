"use client";

import { useActionState } from "react";
import { saveContent } from "@/app/actions/admin";
import type { ContentItem } from "@/lib/supabase/content-types";

const initialState = { error: null as string | null };

export default function ContentForm({ editing }: { editing: ContentItem | null }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => saveContent(formData),
    initialState
  );

  return (
    <form action={formAction} className="admin-form" key={editing?.id ?? "new"}>
      <h3>{editing ? `콘텐츠 수정 — ${editing.title}` : "새 콘텐츠 등록"}</h3>
      {state.error && <div className="auth-error">{state.error}</div>}
      {editing && <input type="hidden" name="id" value={editing.id} />}

      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="c-slug">slug (영소문자·하이픈)</label>
          <input id="c-slug" name="slug" defaultValue={editing?.slug} required />
        </div>
        <div className="admin-field">
          <label htmlFor="c-type">타입</label>
          <select id="c-type" name="type" defaultValue={editing?.type ?? "info"}>
            <option value="app">웹앱</option>
            <option value="video">영상</option>
            <option value="book">도서</option>
            <option value="tool">도구</option>
            <option value="info">정보</option>
          </select>
        </div>
        <div className="admin-field admin-field-wide">
          <label htmlFor="c-title">제목</label>
          <input id="c-title" name="title" defaultValue={editing?.title} required />
        </div>
        <div className="admin-field admin-field-wide">
          <label htmlFor="c-desc">설명</label>
          <textarea
            id="c-desc"
            name="description"
            rows={2}
            defaultValue={editing?.description ?? ""}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="c-url">외부 URL (영상·정보)</label>
          <input id="c-url" name="external_url" defaultValue={editing?.external_url ?? ""} />
        </div>
        <div className="admin-field">
          <label htmlFor="c-path">앱 경로 (웹앱: /apps/...)</label>
          <input id="c-path" name="app_path" defaultValue={editing?.app_path ?? ""} />
        </div>
        <div className="admin-field">
          <label htmlFor="c-cat">카테고리 (kiosk/hand/gaze 등)</label>
          <input id="c-cat" name="category" defaultValue={editing?.category ?? ""} />
        </div>
        <div className="admin-field">
          <label htmlFor="c-tags">태그 (콤마 구분)</label>
          <input id="c-tags" name="tags" defaultValue={editing?.tags.join(", ")} />
        </div>
        <div className="admin-field admin-field-wide">
          <label htmlFor="c-peo">PEO 태그 (콤마 구분)</label>
          <input id="c-peo" name="peo_tags" defaultValue={editing?.peo_tags.join(", ")} />
        </div>
      </div>

      <label className="admin-check">
        <input
          type="checkbox"
          name="requires_camera"
          defaultChecked={editing?.requires_camera ?? false}
        />
        카메라 필요
      </label>
      <label className="admin-check">
        <input
          type="checkbox"
          name="publish"
          defaultChecked={editing ? editing.status === "published" : false}
        />
        게시 (체크 해제 = 임시저장)
      </label>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button className="admin-btn admin-btn-approve" type="submit" disabled={pending}>
          {pending ? "저장 중..." : editing ? "수정 저장" : "등록"}
        </button>
        {editing && (
          <a className="admin-btn admin-btn-ghost" href="/admin?tab=content">
            수정 취소
          </a>
        )}
      </div>
    </form>
  );
}
