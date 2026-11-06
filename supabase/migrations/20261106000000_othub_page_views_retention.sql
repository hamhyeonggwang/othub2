-- 개인정보처리방침 '방문 통계 1년 보관'을 실제로 지키기 위한 자동 삭제.
-- 매일 03:17(UTC)에 1년이 지난 방문 기록(othub_page_views)을 지운다.
create extension if not exists pg_cron;

select cron.unschedule(jobid) from cron.job where jobname = 'othub_page_views_retention';

select cron.schedule(
  'othub_page_views_retention',
  '17 3 * * *',
  $$delete from public.othub_page_views where created_at < now() - interval '1 year'$$
);
