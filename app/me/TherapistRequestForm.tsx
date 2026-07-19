"use client";

import { useActionState } from "react";
import { requestTherapistRole } from "@/app/actions/auth";

const initialState = { error: null as string | null };

export default function TherapistRequestForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) =>
      requestTherapistRole(formData),
    initialState
  );

  return (
    <form action={formAction}>
      {state.error && <div className="auth-error">{state.error}</div>}
      <div className="auth-field">
        <label htmlFor="license_no">면허번호</label>
        <input id="license_no" name="license_no" type="text" required />
      </div>
      <div className="auth-field">
        <label htmlFor="org">소속 (선택)</label>
        <input id="org" name="org" type="text" placeholder="○○병원 재활의학과" />
      </div>
      <button className="auth-submit" type="submit" disabled={pending}>
        {pending ? "요청 중..." : "치료사 인증 요청"}
      </button>
    </form>
  );
}
