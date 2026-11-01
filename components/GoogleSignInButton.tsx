"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateGoogleNonce } from "@/lib/google-nonce";

/**
 * Google Identity Services 버튼.
 * Supabase 주소로 리디렉트하는 OAuth와 달리 로그인 창이 이 사이트(othub.kr) 위에서 열리므로,
 * Google 화면에 프로젝트 주소(*.supabase.co) 대신 사이트 주소가 표시된다.
 * NEXT_PUBLIC_GOOGLE_CLIENT_ID가 없으면 아무것도 그리지 않고, 로그인 폼이 기존 OAuth 버튼을 쓴다.
 */
type GoogleCredential = { credential: string };
type GoogleId = {
  initialize: (o: Record<string, unknown>) => void;
  renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
};
declare global {
  interface Window { google?: { accounts: { id: GoogleId } } }
}

const GSI_SRC = "https://accounts.google.com/gsi/client";
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

function loadGsi(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
    const s = existing ?? document.createElement("script");
    s.addEventListener("load", () => resolve());
    s.addEventListener("error", () => reject(new Error("gsi load failed")));
    if (!existing) {
      s.src = GSI_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
  });
}

export default function GoogleSignInButton({ next }: { next: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "signing" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;
    (async () => {
      try {
        await loadGsi();
        const { raw, hashed } = await generateGoogleNonce();
        if (cancelled || !holder.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          nonce: hashed,
          use_fedcm_for_button: true,
          callback: async ({ credential }: GoogleCredential) => {
            setStatus("signing");
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: credential,
              nonce: raw,
            });
            if (error) {
              setStatus("error");
              setMessage("로그인을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.");
              return;
            }
            // 탈퇴 후 다시 로그인한 경우를 위한 프로필 복구 (함수가 없으면 무시)
            await Promise.resolve(supabase.rpc("othub_ensure_my_profile")).catch(() => {});
            window.location.assign(next);
          },
        });
        window.google.accounts.id.renderButton(holder.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "center",
          locale: "ko",
          width: Math.min(holder.current.clientWidth || 320, 400),
        });
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Google 로그인 버튼을 불러오지 못했습니다. 새로고침하거나 잠시 후 다시 시도해 주세요.");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [next]);

  if (!GOOGLE_CLIENT_ID) return null;
  return (
    <div className="auth-gis">
      <div ref={holder} className="auth-gis-button" aria-busy={status !== "ready"} />
      {status === "loading" && <p className="auth-note">Google 로그인 버튼을 불러오는 중…</p>}
      {status === "signing" && <p className="auth-note" role="status">로그인하는 중…</p>}
      {status === "error" && <div className="auth-error" role="alert">{message}</div>}
    </div>
  );
}
