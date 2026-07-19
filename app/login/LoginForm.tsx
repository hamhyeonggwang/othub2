"use client";

import { useActionState } from "react";
import { sendMagicLink } from "@/app/actions/auth";

const initialState = { error: null as string | null, sent: false };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) =>
      sendMagicLink(formData),
    initialState
  );

  if (state.sent) {
    return (
      <div className="auth-success">
        메일함을 확인해 주세요. 로그인 링크를 보내드렸습니다. 링크를 클릭하면
        자동으로 로그인됩니다.
      </div>
    );
  }

  return (
    <form action={formAction}>
      {state.error && <div className="auth-error">{state.error}</div>}
      <div className="auth-field">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>
      <button className="auth-submit" type="submit" disabled={pending}>
        {pending ? "전송 중..." : "로그인 링크 받기"}
      </button>
      <p className="auth-note">
        비밀번호 없이 이메일로 받은 링크로 로그인합니다.
      </p>
    </form>
  );
}
