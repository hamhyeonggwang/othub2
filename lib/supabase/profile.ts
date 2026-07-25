import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import type { OTHubProfile } from "@/lib/supabase/types";

/**
 * 요청 1회당 한 번만 실행되도록 memoize.
 * 페이지에서 미리 호출해 SiteHeader와 병렬로 뜨게 하면 순차 대기를 없앨 수 있다.
 */
export const getCurrentUserAndProfile = cache(async () => {
  const supabase = await createClient();
  const user = await getAuthUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("othub_profiles")
    .select("*")
    .eq("id", user.id)
    .single<OTHubProfile>();

  return { user, profile };
});
