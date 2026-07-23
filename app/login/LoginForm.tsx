import { signInWithGoogle } from "@/app/actions/auth";

export default function LoginForm({ error }: { error?: string }) {
  return (
    <form action={signInWithGoogle}>
      {error && <div className="auth-error">{error}</div>}
      <button className="auth-submit auth-google" type="submit">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.82-.07-1.42-.22-2.05H12v3.9h6.5c-.13 1.05-.84 2.63-2.42 3.7l-.02.15 3.52 2.7.24.02c2.24-2.06 3.53-5.1 3.53-8.42Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.05 7.93-2.87l-3.78-2.9c-1.01.7-2.37 1.19-4.15 1.19-3.17 0-5.86-2.09-6.82-4.97l-.14.01-3.66 2.8-.05.13C3.3 21.3 7.31 24 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.18 14.65a7.16 7.16 0 0 1-.39-2.3c0-.8.14-1.58.38-2.3l-.01-.16-3.7-2.87-.12.06A11.94 11.94 0 0 0 0 12.35c0 1.93.47 3.75 1.34 5.32l3.84-3.02Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c2.26 0 3.78.97 4.65 1.79l3.39-3.3C17.94 1.19 15.24 0 12 0 7.31 0 3.3 2.7 1.34 6.68l3.83 2.98c.97-2.88 3.66-4.91 6.83-4.91Z"
          />
        </svg>
        Google로 계속하기
      </button>
      <p className="auth-note">
        별도 회원가입 없이 구글 계정으로 바로 시작합니다.
      </p>
    </form>
  );
}
