import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * 요청 1회당 실제 네트워크 호출은 한 번만 나가도록 memoize.
 * SiteHeader + 페이지 자체 데이터 조회가 각자 auth.getUser()를 부르던 걸
 * 하나로 합쳐 페이지 이동 지연을 줄인다.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
