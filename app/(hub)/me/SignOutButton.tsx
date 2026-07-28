"use client";

import { signOut } from "@/app/actions/auth";

export default function SignOutButton({
  className = "profile-signout",
}: {
  className?: string;
}) {
  return (
    <button className={className} onClick={() => signOut()} type="button">
      로그아웃
    </button>
  );
}
