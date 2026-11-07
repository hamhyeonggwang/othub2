"use client";

import { useActionState } from "react";
import { withdrawAccount } from "@/app/actions/account";

const initialState = { error: null as string | null };

export default function WithdrawForm() {
  const [state, formAction, pending] = useActionState(withdrawAccount, initialState);

  return (
    <details className="withdraw">
      <summary>회원 탈퇴</summary>
      <p>탈퇴하면 다음 OTHub 정보가 바로 삭제되며 되돌릴 수 없습니다.</p>
      <ul>
        <li>프로필(표시 이름, 회원 등급, 치료사 인증 정보: 면허번호·소속)</li>
        <li>작성한 댓글, 좋아요, 북마크</li>
        <li>저장한 평가 기록과 결과 보고서</li>
      </ul>
      <p className="withdraw-note">
        Google 로그인 계정은 같은 계정을 쓰는 다른 서비스가 있어 지우지 않습니다. 다시 로그인하면
        새 일반 회원으로 시작합니다. 방문 통계는 회원 정보와 연결되지 않은 기록이라 남습니다.
      </p>
      <form action={formAction}>
        {state.error && (
          <div className="auth-error" role="alert">
            {state.error}
          </div>
        )}
        <div className="auth-field">
          <label htmlFor="withdraw-confirm">확인을 위해 ‘탈퇴’를 입력해 주세요</label>
          <input id="withdraw-confirm" name="confirm" type="text" autoComplete="off" required />
        </div>
        <button className="withdraw-submit" type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "삭제 중..." : "OTHub 정보 삭제하고 탈퇴"}
        </button>
      </form>
    </details>
  );
}
