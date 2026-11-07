"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** 저장한 실행기능 과제 기록 1건 삭제 (확인 후) */
export default function DeleteEfSession({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <button
        type="button"
        className="ef-rec-delete"
        disabled={busy}
        onClick={async () => {
          if (!window.confirm("이 기록을 삭제할까요? 삭제하면 되돌릴 수 없습니다.")) return;
          setBusy(true);
          setError("");
          const res = await fetch(`/api/ef/sessions/${id}`, { method: "DELETE" });
          setBusy(false);
          if (res.ok) router.refresh();
          else setError("삭제하지 못했습니다");
        }}
      >
        삭제
      </button>
      {error && <span role="alert" className="ef-rec-error">{error}</span>}
    </>
  );
}
