-- OTHub 회원 탈퇴: 로그인한 본인의 OTHub 데이터만 지운다.
-- 이 Supabase 프로젝트의 auth.users는 다른 앱과 함께 쓰므로 계정 자체는 지우지 않는다
-- (auth.users를 지우면 다른 앱 데이터가 연쇄 삭제되거나, NO ACTION 외래키에 막힌다).

create or replace function public.othub_delete_my_data()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  n_sessions int;
  n_comments int;
  n_likes int;
  n_bookmarks int;
  n_profiles int;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  -- 마지막 관리자가 탈퇴하면 관리 기능을 쓸 사람이 없어진다
  if exists (select 1 from othub_profiles where id = uid and role = 'admin')
     and (select count(*) from othub_profiles where role = 'admin') <= 1 then
    raise exception 'last admin cannot withdraw' using errcode = 'P0001';
  end if;

  delete from othub_assessment_sessions where therapist_id = uid;  -- 평가 결과는 외래키 CASCADE로 함께 삭제
  get diagnostics n_sessions = row_count;
  delete from othub_comments where user_id = uid;
  get diagnostics n_comments = row_count;
  delete from othub_likes where user_id = uid;
  get diagnostics n_likes = row_count;
  delete from othub_bookmarks where user_id = uid;
  get diagnostics n_bookmarks = row_count;
  delete from othub_profiles where id = uid;                       -- 면허번호·소속 포함
  get diagnostics n_profiles = row_count;

  return jsonb_build_object(
    'sessions', n_sessions, 'comments', n_comments, 'likes', n_likes,
    'bookmarks', n_bookmarks, 'profile', n_profiles
  );
end;
$$;

-- 탈퇴 후 다시 로그인한 경우 OTHub 프로필을 일반 회원으로 새로 만든다.
-- (프로필은 auth.users 생성 트리거로만 만들어지므로, 기존 계정에는 다시 생기지 않는다)
create or replace function public.othub_ensure_my_profile()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    return;
  end if;
  insert into othub_profiles (id, display_name)
  select u.id, coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1))
    from auth.users u
   where u.id = uid
  on conflict (id) do nothing;
end;
$$;

revoke all on function public.othub_delete_my_data() from public, anon;
revoke all on function public.othub_ensure_my_profile() from public, anon;
grant execute on function public.othub_delete_my_data() to authenticated;
grant execute on function public.othub_ensure_my_profile() to authenticated;
