"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsPath } from "@/lib/analytics";

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  useEffect(() => {
    const path = analyticsPath(pathname);
    if (!path) { lastPath.current = null; return; }
    if (navigator.doNotTrack === "1" || lastPath.current === pathname) return;
    // A task after hydration; telemetry is not part of navigation's critical path.
    const timer = window.setTimeout(() => {
      if (document.visibilityState !== "visible") return;
      lastPath.current = pathname;
      void fetch("/api/page-view", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "same-origin", body: JSON.stringify({ path }),
        keepalive: true,
      }).catch(() => { /* Analytics availability must not affect the UI. */ });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
}
