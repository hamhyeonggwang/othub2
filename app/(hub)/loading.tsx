export default function Loading() {
  return <main id="main" className="route-loading" aria-busy="true">
    <p role="status">페이지를 불러오고 있습니다…</p>
    <div className="route-skeleton-title" aria-hidden="true" />
    <div className="route-skeleton-grid" aria-hidden="true">
      {[0, 1, 2].map((key) => <div className="route-skeleton-card" key={key} />)}
    </div>
  </main>;
}
