"use client";

import { signOut } from "@/app/actions/auth";

export default function SignOutButton() {
  return (
    <button
      className="profile-signout"
      onClick={() => signOut()}
      type="button"
    >
      로그아웃
    </button>
  );
}
