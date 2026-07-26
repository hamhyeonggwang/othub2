import type { ReactNode } from "react";
import Link from "next/link";

export interface LandingCta {
  label: string;
  href: string;
}

export interface LandingToolGridItem {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  tags?: string[];
}

export interface LandingTrustStat {
  value: string;
  label: string;
}

export interface LandingShellProps {
  eyebrow: string;
  headline: ReactNode;
  subcopy?: string;
  primaryCta: LandingCta;
  secondaryCta?: LandingCta;
  trustStats?: LandingTrustStat[];
  toolGrid?: {
    title: string;
    items: LandingToolGridItem[];
  };
  trailingCta?: LandingCta & { note?: string };
  children?: ReactNode;
}

/**
 * 목적별 랜딩페이지 공용 템플릿. /about·/assess·/lab에서 검증된 히어로+CTA
 * 화법을 재사용하되 특정 목적(페르소나/캠페인/컬렉션 등)을 전제하지 않는다.
 */
export default function LandingShell({
  eyebrow,
  headline,
  subcopy,
  primaryCta,
  secondaryCta,
  trustStats,
  toolGrid,
  trailingCta,
  children,
}: LandingShellProps) {
  return (
    <div className="landing-shell" id="main">
      <section className="landing-hero">
        <p className="eyebrow">
          <span></span> {eyebrow}
        </p>
        <h1>{headline}</h1>
        {subcopy && <p className="hero-description">{subcopy}</p>}
        <div className="hero-actions">
          <Link className="button button-primary" href={primaryCta.href}>
            {primaryCta.label}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          {secondaryCta && (
            <Link className="button button-secondary" href={secondaryCta.href}>
              {secondaryCta.label}
            </Link>
          )}
        </div>
        {trustStats && trustStats.length > 0 && (
          <div className="trust-stats">
            {trustStats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
        )}
      </section>

      {toolGrid && toolGrid.items.length > 0 && (
        <section className="section">
          <h2>{toolGrid.title}</h2>
          <div className="hub-grid">
            {toolGrid.items.map((item) => (
              <Link
                key={item.slug}
                className="hub-card"
                href={`/hub/apps/${item.slug}`}
              >
                {item.badge && <span className="hub-card-badge">{item.badge}</span>}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.tags && (
                  <div className="hub-card-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {children}

      {trailingCta && (
        <section className="section contact">
          <div className="contact-inner">
            <Link className="button button-light" href={trailingCta.href}>
              {trailingCta.label}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            {trailingCta.note && (
              <small className="contact-note">{trailingCta.note}</small>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
