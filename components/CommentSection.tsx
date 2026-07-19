"use client";

import { useActionState } from "react";
import { addComment, deleteComment } from "@/app/actions/engagement";
import type { CommentWithAuthor } from "@/lib/supabase/content-types";

const initialState = { error: null as string | null };

export default function CommentSection({
  contentId,
  path,
  comments,
  isLoggedIn,
}: {
  contentId: string;
  path: string;
  comments: CommentWithAuthor[];
  isLoggedIn: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) =>
      addComment(contentId, path, formData),
    initialState
  );

  return (
    <div className="comment-section">
      <h2>댓글 {comments.length}개</h2>

      {isLoggedIn ? (
        <form action={formAction} className="comment-form">
          {state.error && <div className="auth-error">{state.error}</div>}
          <textarea
            name="body"
            placeholder="댓글을 남겨보세요"
            required
            maxLength={1000}
          />
          <button type="submit" className="auth-submit" disabled={pending}>
            {pending ? "등록 중..." : "댓글 등록"}
          </button>
        </form>
      ) : (
        <p className="hint">
          <a href="/login">로그인</a> 후 댓글을 남길 수 있습니다.
        </p>
      )}

      <ul className="comment-list">
        {comments.length === 0 && (
          <li className="comment-empty">아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="comment-item">
            <div className="comment-meta">
              <strong>{c.authorName}</strong>
              <span>{new Date(c.created_at).toLocaleDateString("ko-KR")}</span>
            </div>
            <p>{c.body}</p>
            {c.isMine && (
              <form action={deleteComment.bind(null, c.id, path)}>
                <button type="submit" className="comment-delete">
                  삭제
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
