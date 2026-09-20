import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import SiteNavigation from "@/components/SiteNavigation";
import SignOutButton from "@/app/(hub)/me/SignOutButton";

async function Account({ compact = false }: { compact?: boolean }) {
  const { user, profile } = await getCurrentUserAndProfile();
  return <>
    <Link className={compact ? undefined : "button button-secondary"} href={user ? "/me" : "/login"}>
      {user ? profile?.display_name || "My Hub" : "로그인"}
    </Link>
    {user && <SignOutButton className="header-signout" />}
  </>;
}

function AccountPlaceholder() {
  return <span className="account-placeholder" role="status">계정 확인 중…</span>;
}

export default function SiteHeader() {
  return <>
    <SiteNavigation>
      <Suspense fallback={<AccountPlaceholder />}><Account compact /></Suspense>
    </SiteNavigation>
    <div className="header-account">
      <Suspense fallback={<AccountPlaceholder />}><Account /></Suspense>
    </div>
  </>;
}
