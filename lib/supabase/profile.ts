import { createClient } from "@/lib/supabase/server";
import type { OTHubProfile } from "@/lib/supabase/types";

export async function getCurrentUserAndProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("othub_profiles")
    .select("*")
    .eq("id", user.id)
    .single<OTHubProfile>();

  return { user, profile };
}
