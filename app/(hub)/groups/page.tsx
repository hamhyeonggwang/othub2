import type { Metadata } from "next";
import Link from "next/link";
import "../hub/hub.css";
import { SMALL_GROUPS } from "@/lib/small-groups";

export const metadata: Metadata = {
  title: "소모임",
  description: "OTHub 회원들이 함께 만들어가는 소모임을 소개합니다.",
};

export default function GroupsPage() {
  return (
    <div className="hub-shell" id="main">
      <Link className="hub-back" href="/">
        ← OTHub 홈으로
      </Link>

      <div className="hub-header">
        <h1 className="hub-title">소모임</h1>
        <p className="hub-desc">
          OTHub 회원들이 함께 만들어가는 소모임입니다. 문의는 인스타그램 DM
          또는 메일로 받습니다.
        </p>
      </div>

      <div className="hub-grid">
        {SMALL_GROUPS.map((group) => (
          <div key={group.slug} className="hub-card">
            <span className="hub-card-badge">{group.category}</span>
            <h3>{group.name}</h3>
            <p>{group.description}</p>
            {group.activities && <p>{group.activities}</p>}
            <div className="hub-card-tags">
              <span>{group.mode}</span>
              <span>{group.focus}</span>
              <span>{group.since}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="hub-desc" style={{ marginTop: 32 }}>
        문의:{" "}
        <a
          href="https://www.instagram.com/starlight_daddy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          인스타그램 DM
        </a>{" "}
        또는 <a href="mailto:h2g0614@gmail.com">h2g0614@gmail.com</a>
      </p>
    </div>
  );
}
