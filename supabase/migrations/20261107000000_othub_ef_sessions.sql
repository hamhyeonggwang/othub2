-- 실행기능 과제 결과 저장 (2단계)
-- 인증 치료사(therapist·admin)가 과제 결과 화면에서 '저장'을 누를 때만 쌓인다.
-- 대상자는 실명·생년월일 대신 치료사가 정한 영문·숫자 코드로만 구분한다(이름이 들어가지 않도록 형식을 제한).

create table if not exists public.othub_ef_sessions (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references auth.users (id) on delete cascade,
  subject_code text not null check (subject_code ~ '^[A-Za-z0-9_-]{1,20}$'),
  task text not null check (task in ('nback', 'stroop', 'corsi', 'cardsort', 'hearts_flowers')),
  summary jsonb not null default '{}'::jsonb,
  device jsonb not null default '{}'::jsonb,
  started_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists othub_ef_sessions_owner_idx
  on public.othub_ef_sessions (therapist_id, subject_code, task, started_at);

-- 시행 단위 원자료 (세션당 한 행, 최대 500시행)
create table if not exists public.othub_ef_trials (
  session_id uuid primary key references public.othub_ef_sessions (id) on delete cascade,
  trials jsonb not null default '[]'::jsonb check (jsonb_typeof(trials) = 'array' and jsonb_array_length(trials) <= 500)
);

alter table public.othub_ef_sessions enable row level security;
alter table public.othub_ef_trials enable row level security;

-- 본인 기록만, 그리고 치료사·관리자 역할일 때만 (평가 기록과 같은 규칙)
drop policy if exists othub_ef_sessions_own on public.othub_ef_sessions;
create policy othub_ef_sessions_own on public.othub_ef_sessions
  for all to authenticated
  using (
    therapist_id = auth.uid()
    and exists (select 1 from public.othub_profiles p where p.id = auth.uid() and p.role in ('therapist', 'admin'))
  )
  with check (
    therapist_id = auth.uid()
    and exists (select 1 from public.othub_profiles p where p.id = auth.uid() and p.role in ('therapist', 'admin'))
  );

drop policy if exists othub_ef_trials_own on public.othub_ef_trials;
create policy othub_ef_trials_own on public.othub_ef_trials
  for all to authenticated
  using (exists (select 1 from public.othub_ef_sessions s where s.id = session_id and s.therapist_id = auth.uid()))
  with check (exists (select 1 from public.othub_ef_sessions s where s.id = session_id and s.therapist_id = auth.uid()));

revoke all on public.othub_ef_sessions, public.othub_ef_trials from anon;
grant select, insert, delete on public.othub_ef_sessions, public.othub_ef_trials to authenticated;

-- 회원 탈퇴 시 실행기능 과제 기록도 함께 지운다
create or replace function public.othub_delete_my_data()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  n_sessions int;
  n_ef int;
  n_comments int;
  n_likes int;
  n_bookmarks int;
  n_profiles int;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if exists (select 1 from othub_profiles where id = uid and role = 'admin')
     and (select count(*) from othub_profiles where role = 'admin') <= 1 then
    raise exception 'last admin cannot withdraw' using errcode = 'P0001';
  end if;
  delete from othub_assessment_sessions where therapist_id = uid;
  get diagnostics n_sessions = row_count;
  delete from othub_ef_sessions where therapist_id = uid;      -- 시행 기록은 CASCADE로 함께 삭제
  get diagnostics n_ef = row_count;
  delete from othub_comments where user_id = uid;
  get diagnostics n_comments = row_count;
  delete from othub_likes where user_id = uid;
  get diagnostics n_likes = row_count;
  delete from othub_bookmarks where user_id = uid;
  get diagnostics n_bookmarks = row_count;
  delete from othub_profiles where id = uid;
  get diagnostics n_profiles = row_count;
  return jsonb_build_object(
    'sessions', n_sessions, 'ef_sessions', n_ef, 'comments', n_comments, 'likes', n_likes,
    'bookmarks', n_bookmarks, 'profile', n_profiles
  );
end;
$$;
revoke all on function public.othub_delete_my_data() from public, anon;
grant execute on function public.othub_delete_my_data() to authenticated;
