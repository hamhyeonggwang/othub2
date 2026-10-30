"use client";

import { useActionState } from "react";
import Link from "next/link";
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
    initialState,
  );

  return (
    <div className="comment-section">
      <h2>댓글 {comments.length}개</h2>

      {isLoggedIn ? (
        <form action={formAction} className="comment-form">
          {state.error && (
            <div className="auth-error" role="alert">
              {state.error}
            </div>
          )}
          <textarea
            aria-label="댓글 내용"
            name="body"
            placeholder="댓글을 남겨보세요"
            required
            maxLength={1000}
            aria-describedby="comment-privacy-note"
          />
          <p className="hint" id="comment-privacy-note">
            환자·대상자의 실명, 사진, 연락처처럼 개인을 알아볼 수 있는 정보는 쓰지 마세요.
          </p>
          <button type="submit" className="auth-submit" disabled={pending}>
            {pending ? "등록 중..." : "댓글 등록"}
          </button>
        </form>
      ) : (
        <p className="hint">
          <Link href={`/login?next=${encodeURIComponent(path)}`}>로그인</Link>{" "}
          후 댓글을 남길 수 있습니다.
        </p>
      )}

      <ul className="comment-list">
        {comments.length === 0 && (
          <li className="comment-empty">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
          </li>
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
