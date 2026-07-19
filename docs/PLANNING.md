# OTHub 기획 설계서

> **By OTs, For Everyone.** — 작업치료사가 만든 모두를 위한 플랫폼
> 버전 0.1 · 2026-07-19 · 작성: 기획 설계 단계 산출물

---

## 1. 비전과 포지셔닝

| 항목 | 내용 |
|---|---|
| 서비스명 | **OTHub** |
| 슬로건 | By OTs, For Everyone |
| 비전 | 작업치료사(OT)가 만든 치료 콘텐츠·훈련 웹앱·임상 도구를 한곳에 모아, 치료사·보호자·당사자 누구나 접근할 수 있는 플랫폼 |
| 핵심 가치 | ① 임상 근거 기반(Evidence-informed) ② 참여 중심(Participation-centered) ③ 사람이 주도하는 AI(Human-led AI) |

### 서비스 3대 축
1. **훈련 웹앱 (For Everyone)** — 키오스크 훈련, 손 인식 게임 등. 비회원도 즉시 사용 가능한 공개 영역
2. **콘텐츠 허브 (For Everyone)** — 영상·학회 정보·도서 등 큐레이션. 공개 열람, 좋아요·댓글·북마크는 회원 기능
3. **임상 평가 도구 (For OTs)** — OTHub Assess. 회원(치료사) 전용, 평가 세션·결과보고서 관리

---

## 2. 사용자·권한 모델

| 역할 | 설명 | 접근 범위 |
|---|---|---|
| 게스트 | 비로그인 방문자 | 랜딩, 콘텐츠 열람, 훈련 웹앱 실행 |
| 회원 (`member`) | 이메일/소셜 가입자 (보호자·학생·일반인 포함) | + 좋아요·댓글·북마크, 프로필, 훈련 기록 저장 |
| 치료사 회원 (`therapist`) | 면허 확인 또는 관리자 승인을 거친 회원 | + OTHub Assess 전체 (평가 세션, 결과보고서) |
| 관리자 (`admin`) | 운영자(함형광) | + 콘텐츠 등록·관리, 회원 승인, 통계 |

- 인증: Supabase Auth (이메일 매직링크 + Google OAuth 권장)
- 권한: `profiles.role` 컬럼 + Supabase RLS로 서버 측 강제
- 치료사 승인 플로우: 가입 → 프로필에서 "치료사 인증 요청"(면허번호/소속 입력) → 관리자 승인 → `therapist` 승격

---

## 3. 정보 구조 (IA) / 사이트맵

`ot-hub-preview.html`의 탭 구조(홈·탐색·웹앱·정보·임상도구·커뮤니티·북마크·프로필)를 계승하되, MVP 범위로 정리한다.

```
/                    랜딩 (index.html 디자인 뼈대 유지 + OTHub 브랜딩)
/hub                 앱 홈 — 피드 (추천 웹앱·영상·정보 큐레이션)
/hub/apps            훈련 웹앱 목록 (카테고리: 키오스크, 손 인식, 시지각, 쓰기, 시선)
/hub/apps/[slug]     웹앱 상세 (설명·대상·사용법·좋아요·댓글) → 실행
/apps/[slug]         실제 웹앱 실행 (정적 HTML, 전체화면)
/hub/videos          영상 콘텐츠 (YouTube 큐레이션)
/hub/info            정보 (학회·협회 링크, 도서)
/assess              OTHub Assess 허브 (치료사 전용)
/assess/session      평가 세션 (도구 선택 → 순차 진행 → 결과보고서)
/assess/[tool]       개별 평가 도구 8종 + report
/login, /signup      인증
/me                  프로필·북마크·훈련 기록·치료사 인증 요청
/admin               관리자 (콘텐츠·회원·승인 관리) — Phase 2
```

- PEO 필터(사람·환경·작업 기반 콘텐츠 탐색)는 preview의 차별화 아이디어이므로 유지 — `/hub` 탐색 필터로 구현
- 챗봇·커뮤니티 게시판은 Phase 2 이후로 연기 (MVP 범위 제외)

---

## 4. 기존 자산 분석 및 승계 전략

### 4.1 index.html + styles.css (디자인 뼈대 — 유지)
- 유지: Pretendard, 라이트 아이스블루 팔레트(`--navy #071b3f`, `--blue #1d6fdc`, `--cyan #21bff3`, `--ice #eef6ff`), 글래스모피즘 카드, 오로라 히어로, 패럴랙스 data-space, 섹션 구조(hero → about → work → approach → contact), `prefers-reduced-motion` 대응
- 변경: 개인 포트폴리오 콘텐츠 → OTHub 브랜딩(로고, 슬로건 "By OTs, For Everyone"), work 섹션 → 3대 축(웹앱·콘텐츠·Assess) 소개 카드, contact → 회원가입 CTA

### 4.2 game/ot-hub-preview.html (앱 아이디어 — 채용)
채용할 아이디어:
- 탭 네비게이션 구조(모바일 하단바 + 데스크톱 사이드바)
- 콘텐츠 타입 체계: video / game / book / tool / info
- PEO 모델 기반 필터
- 좋아요·댓글 + Supabase Auth 연동 설계 (현재 주석으로 숨김 처리된 engagement 기능)
- 검색(전 타입 통합)

### 4.3 game/ 훈련 웹앱 14종 (콘텐츠 자산 — 채용)

| 분류 | 파일 | 기술 |
|---|---|---|
| 키오스크 훈련 (7) | cu, paik, maratang, munggu, homeplus, photobooth(하루필름), korail | 순수 HTML/JS (일부 QRCode.js) |
| 손 인식 (4) | airdrawing, balloon-adventure, color-tray, writing-game | MediaPipe Hands |
| 시선 추적 (1) | gazeplay_v1 | 자체 구현 |

- **korail-kiosk-trainer**는 preview의 GAMES 목록에 누락 → 재구현 시 포함
- 정적 HTML 그대로 `/public/apps/`에 배치하고 Next.js에서 목록·상세만 관리 (재작성 비용 최소화)
- 실행 완료 시 `postMessage`로 결과를 부모(Next.js)에 전달 → 회원 훈련 기록 저장 (Phase 2, 게임별 점진 적용)

### 4.4 otassess-main (평가 도구 — 회원 전용으로 편입)
- 도구 8종: 작업수행 프로파일링, OTIPM 수행분석, JTHFT, MACS, HFT 임상관찰, 감각운동협응, K-MBI, K-IADL + 종합 결과보고서(report.html)
- 세션 관리: `session-sidebar.js` + sessionStorage 기반 → Supabase `assessment_sessions` 테이블로 이전
- `sms-main`(사회성숙도 검사, React+Vite)은 독립 앱 — Phase 2에서 Assess에 9번째 도구로 통합 검토

### 4.5 발견된 오류 (재구현 시 수정 목록)

| # | 위치 | 오류 | 수정 방침 |
|---|---|---|---|
| E1 | ot-hub-preview.html:883 | `supabase-config.js` 참조하나 파일 부재 → 로그인·댓글 전체 불능 | 환경변수 기반 Supabase 클라이언트로 대체 |
| E2 | ot-hub-preview.html:90-91 | 좋아요·댓글 UI를 `display:none!important`로 강제 숨김 (임시 조치) | 정식 engagement 기능으로 구현 |
| E3 | ot-hub-preview.html | 714KB 단일 파일 — 썸네일 base64 인라인 포함 | 이미지 파일 분리, 컴포넌트화 |
| E4 | ot-hub-preview.html GAMES | g2~g5는 placeholder(picsum) 가짜 항목, 조회수 하드코딩, korail 누락 | DB 기반 실데이터로 교체 |
| E5 | session-sidebar.js:14 | `assess-fim.html` 라우트 등록되어 있으나 파일 부재 → 세션에 FIM 포함 시 404 | FIM 도구 신규 구현 또는 라우트 제거 |
| E6 | airdrawing 등 | MediaPipe CDN 버전 미고정(`@mediapipe/hands/hands.js`) — 파일별 버전 불일치(무버전/@0.3/@0.4) | 전 게임 동일 버전 고정 |
| E7 | otassess 전반 | sessionStorage 기반 → 탭 닫으면 평가 데이터 유실, 인증 없음 | Supabase 저장 + RLS |
| E8 | index.html:300 | `hello@example.com` placeholder 이메일 | 실제 연락처로 교체 |
| E9 | 전반 | 환자 이름 등 개인정보를 클라이언트 저장소에 평문 저장 | 개인정보 최소 수집 원칙 + Supabase RLS, 이니셜/코드화 입력 권장 |

> 개별 게임 파일 내부의 로직 버그는 구현 단계에서 게임별 스모크 테스트로 검출·수정한다 (기획 단계에서는 구조적 오류만 목록화).

---

## 5. 기술 아키텍처

```
Next.js 15 (App Router, TypeScript, Tailwind)  ← Vercel 배포
├─ app/(marketing)/          랜딩 (Server Component, index 디자인 이식)
├─ app/(hub)/hub/...         콘텐츠 허브 (피드·목록·상세)
├─ app/(assess)/assess/...   평가 도구 (therapist 전용, middleware 가드)
├─ app/(auth)/login·signup   Supabase Auth
├─ public/apps/*.html        기존 정적 게임 (그대로 서빙)
└─ Supabase
   ├─ Auth (이메일 매직링크 + Google)
   ├─ Postgres + RLS
   └─ Storage (썸네일, 보고서 PDF)
```

원칙 (글로벌 코딩 표준 준수):
- Server Component 기본, `'use client'`는 상태 필요 시만
- `any` 금지 — `ContentItem`, `AssessmentSession`, `AssessmentResult` 등 도메인 타입 명시
- RLS 기본 활성화, supabase-js v2 체이닝
- 게임 재작성은 하지 않음 — 정적 자산으로 유지하고 셸(목록·상세·기록)만 Next.js가 담당

## 6. DB 스키마 (초안)

```sql
profiles            (id → auth.users, display_name, role member|therapist|admin,
                     license_no, org, therapist_requested_at, approved_at)
content_items       (id, slug, type video|app|book|tool|info, title, description,
                     thumb_url, external_url, app_path, tags text[], peo_tags text[],
                     status draft|published, view_count)
likes               (user_id, content_id)  -- PK 복합
comments            (id, content_id, user_id, body, created_at)
bookmarks           (user_id, content_id)
app_play_logs       (id, user_id null허용, content_id, score jsonb, played_at)  -- Phase 2
assessment_sessions (id, therapist_id, client_code, client_meta jsonb,
                     tools text[], status in_progress|done, created_at)
assessment_results  (id, session_id, tool_id, raw jsonb, summary jsonb, created_at)
```

RLS 요지:
- `content_items`: published는 전체 읽기, 쓰기는 admin
- `likes/comments/bookmarks`: 본인 행만 쓰기·삭제
- `assessment_*`: `therapist_id = auth.uid()`인 행만 CRUD, role이 therapist/admin일 때만

## 7. 디자인 시스템

- 토큰: styles.css의 `:root` 그대로 Tailwind theme로 이식 (`navy/blue/cyan/ice/line/muted`)
- 타이포: Pretendard 유지
- 컴포넌트: glass-card, eyebrow, section-label, button-primary/secondary 등 index.html 클래스 체계를 React 컴포넌트로 변환
- preview의 navy+teal 팔레트는 폐기하고 index 팔레트로 통일 (뼈대 유지 원칙)
- 모바일: 하단 탭바(preview 아이디어), 데스크톱: 사이드바 — 반응형 분기 1024px

## 8. 로드맵

| Phase | 범위 | 완료 기준 |
|---|---|---|
| **M0 기획 확정** | 본 문서 리뷰·확정, Supabase 프로젝트 생성 | 스키마 승인 |
| **M1 셸 구축** | Next.js 스캐폴드, 랜딩(index 이식), 디자인 토큰, 정적 게임 14종 `/public/apps` 서빙 + 목록 페이지 | 전 게임 실행 확인 |
| **M2 회원제** | Supabase Auth, profiles, 로그인/프로필, 치료사 인증 요청 플로우 | 가입→승인→역할 분기 동작 |
| **M3 콘텐츠 허브** | content_items DB화, 피드·검색·PEO 필터, 좋아요·댓글·북마크 (E1·E2·E4 해소) | 회원 engagement 동작 |
| **M4 Assess 편입** | otassess 8종 + report 이식, Supabase 세션 저장, therapist 가드 (E5·E7 해소) | 세션 생성→평가→보고서 저장 |
| **M5 마감** | 게임별 오류 수정(E6 포함), 모바일 QA, SEO/OG, 배포 | Vercel 프로덕션 |
| Phase 2 | 훈련 기록(app_play_logs), sms-main 통합, FIM 신규, 커뮤니티, 관리자 대시보드, 챗봇 | — |

## 9. 결정 필요 사항 (오픈 이슈)

1. **치료사 인증 방식** — 면허번호 자율 입력+관리자 승인(권장) vs 증빙 업로드
2. **도메인·배포 대상** — Vercel 프로젝트명, 커스텀 도메인 여부
3. **비회원 게임 실행 허용 범위** — 전면 공개(권장) vs 일부 회원 전용
4. **sms-main 통합 시점** — Phase 2 권장 (React 앱이라 iframe 또는 재작성 필요)
5. **기존 저장소 구조** — 현 폴더에 Next.js 신설(`app/` 루트 재구성) vs 별도 저장소
