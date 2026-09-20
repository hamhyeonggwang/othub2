import Link from "next/link";
import { getPageViewStats, getTopPages } from "@/lib/supabase/admin";

const PAGE_NAMES: Record<string, string> = {
  "/": "홈",
  "/hub/apps": "훈련 도구 목록",
  "/hub": "콘텐츠 라이브러리",
  "/about": "서비스 소개",
  "/me": "My Hub",
  "/assess": "평가 도구",
  "/assess/session": "평가 세션",
  "/links": "링크 모음",
  "/lab": "실험실",
  "/groups": "그룹",
  "/portfolio": "프로젝트",
};

function pageName(path: string) {
  if (Object.hasOwn(PAGE_NAMES, path)) return PAGE_NAMES[path];
  if (path.startsWith("/hub/apps/")) return "훈련 도구 상세";
  if (path.startsWith("/collections/")) return "주제별 모음";
  return "기타 페이지";
}

function LoadError({ title, days }: { title: string; days: number }) {
  return (
    <div className="analytics-error" role="alert">
      <h3>{title}</h3>
      <p>
        데이터가 0건이라는 뜻은 아닙니다. 다시 시도해 주세요. 문제가 계속되면
        통계 조회 권한과 서버 연결을 확인해 주세요.
      </p>
      <a href={`/admin?tab=visits&days=${days}`}>통계 다시 불러오기 →</a>
    </div>
  );
}

export default async function VisitsTab({ days }: { days: 7 | 30 }) {
  const [statsResult, pagesResult] = await Promise.allSettled([
    getPageViewStats(),
    getTopPages(days, 10),
  ]);
  const stats = statsResult.status === "fulfilled" ? statsResult.value : null;
  const pages = pagesResult.status === "fulfilled" ? pagesResult.value : null;
  const views = stats ? (days === 30 ? stats.views30d : stats.views7d) : null;
  const visitors = stats
    ? days === 30
      ? stats.visitors30d
      : stats.visitors7d
    : null;
  const maximum = Math.max(1, ...(pages ?? []).map((page) => page.views));
  const number = (value: number) => value.toLocaleString("ko-KR");

  return (
    <section className="analytics-workspace" aria-labelledby="visits-title">
      <header className="analytics-toolbar">
        <div>
          <h2 id="visits-title">방문 현황</h2>
          <p>어떤 페이지를 많이 찾는지 살펴보세요.</p>
        </div>
        <nav className="analytics-period" aria-label="방문 통계 집계 기간">
          {[7, 30].map((period) => (
            <Link
              key={period}
              href={`/admin?tab=visits&days=${period}`}
              aria-current={days === period ? "page" : undefined}
            >
              최근 {period}일
            </Link>
          ))}
        </nav>
      </header>
      {stats && views !== null && visitors !== null ? (
        <dl
          className="analytics-metrics"
          aria-label={`최근 ${days}일 방문 지표`}
        >
          <div>
            <dt>페이지 조회</dt>
            <dd>
              {number(views)}
              <span>회</span>
            </dd>
            <dd className="analytics-metric-note">
              최근 {days}일 · 화면 조회 횟수
            </dd>
          </div>
          <div>
            <dt>고유 브라우저</dt>
            <dd>
              {number(visitors)}
              <span>개</span>
            </dd>
            <dd className="analytics-metric-note">
              최근 {days}일 · 실제 사람 수와 다름
            </dd>
          </div>
          <div className="analytics-total">
            <dt>누적 페이지 조회</dt>
            <dd>
              {number(stats.total)}
              <span>회</span>
            </dd>
            <dd className="analytics-metric-note">
              전체 기간 · 기간 선택과 무관
            </dd>
          </div>
        </dl>
      ) : (
        <LoadError title="방문 지표를 불러오지 못했습니다" days={days} />
      )}

      <section className="analytics-panel" aria-labelledby="top-pages-title">
        <div className="analytics-panel-heading">
          <div>
            <p className="workspace-eyebrow">POPULAR PAGES</p>
            <h3 id="top-pages-title">많이 본 페이지</h3>
          </div>
          <span>최근 {days}일 · 상위 10개</span>
        </div>
        {pages === null ? (
          <LoadError title="인기 페이지를 불러오지 못했습니다" days={days} />
        ) : pages.length === 0 ? (
          <div className="analytics-empty">
            <h4>선택한 기간의 방문 기록이 없습니다</h4>
            <p>
              조회가 완료됐지만 표시할 페이지가 없습니다. 다른 기간을 선택해
              보세요.
            </p>
            <Link href={`/admin?tab=visits&days=${days === 7 ? 30 : 7}`}>
              최근 {days === 7 ? 30 : 7}일 보기 →
            </Link>
          </div>
        ) : (
          <>
            <ol className="analytics-ranking">
              {pages.map((page, index) => (
                <li key={page.path}>
                  <span className="analytics-rank" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="analytics-page">
                    <strong>{pageName(page.path)}</strong>
                    <code>{page.path}</code>
                    <div className="analytics-track" aria-hidden="true">
                      <span
                        style={{
                          width: `${(Math.max(0, page.views) / maximum) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="analytics-views">
                    {number(page.views)}
                    <small>회 조회</small>
                  </span>
                </li>
              ))}
            </ol>
            <p className="analytics-caption">
              막대 길이는 이 목록의 최다 조회 페이지를 기준으로 비교한 값입니다.
              전체 이용자 비율이나 도구 실행 횟수가 아닙니다.
            </p>
          </>
        )}
      </section>

      <aside className="analytics-guide" aria-labelledby="metrics-guide-title">
        <h3 id="metrics-guide-title">지표를 읽기 전에</h3>
        <div>
          <section>
            <h4>조회수와 사람 수는 달라요</h4>
            <p>
              고유 브라우저는 무작위 쿠키 식별자 기준입니다. 쿠키를 지우거나
              다른 브라우저를 사용하면 새로 집계될 수 있습니다.
            </p>
          </section>
          <section>
            <h4>도구 안의 활동은 포함하지 않아요</h4>
            <p>
              현재 지표는 페이지 이동 중심입니다. 독립 HTML 도구 내부
              실행·완료·체류시간은 측정하지 않습니다.
            </p>
          </section>
          <section>
            <h4>수집 방식 변경에 유의하세요</h4>
            <p>
              새 방식은 미리 불러오기, 검색 조건 변경, 관리자·로그인 페이지를
              제외합니다. 이전 데이터가 포함된 기간의 단순 증감을 성과로
              해석하지 마세요.
            </p>
          </section>
        </div>
        <p className="analytics-caption">
          추적 거부(DNT), 네트워크 차단 등에 따라 집계가 누락될 수 있습니다.
          기간은 기존 서버 집계 기준을 따릅니다.
        </p>
      </aside>
    </section>
  );
}
