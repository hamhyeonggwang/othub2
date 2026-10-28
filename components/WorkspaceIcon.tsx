export type WorkspaceIconKind =
  | "kiosk"
  | "hand"
  | "gaze"
  | "assistive"
  | "content"
  | "assess"
  | "arrow"
  | "search";

export default function WorkspaceIcon({ kind }: { kind: WorkspaceIconKind }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {kind === "kiosk" && (
        <>
          <rect x="6" y="3" width="12" height="15" rx="2" />
          <path d="M9 7h6M9 11h3M9 21h6M12 18v3" />
        </>
      )}
      {kind === "hand" && (
        <>
          <path d="M8 13V7a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v5c0 4-3 6-6 6-3 0-4-1-6-3l-4-4a1.5 1.5 0 0 1 2-2l2 1Z" />
        </>
      )}
      {kind === "gaze" && (
        <>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
      {kind === "assistive" && (
        <>
          <circle cx="10" cy="5" r="1.8" />
          <path d="M10 8v6h5l3 5M10 11h5" />
          <path d="M8 21a5 5 0 1 1-3-9" />
        </>
      )}
      {kind === "content" && (
        <>
          <path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14" />
        </>
      )}
      {kind === "assess" && (
        <>
          <rect x="5" y="5" width="14" height="16" rx="2" />
          <rect x="9" y="2" width="6" height="5" rx="1" />
          <path d="m9 13 2 2 4-4M9 18h6" />
        </>
      )}
      {kind === "arrow" && <path d="M5 12h14m-6-6 6 6-6 6" />}
      {kind === "search" && (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </>
      )}
    </svg>
  );
}
