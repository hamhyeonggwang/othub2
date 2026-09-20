"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main" className="route-loading">
    <h1>페이지를 불러오지 못했습니다</h1>
    <p>잠시 후 다시 시도해 주세요. 다른 메뉴는 계속 이용할 수 있습니다.</p>
    <button className="button button-primary" onClick={reset}>다시 시도</button>
  </main>;
}
