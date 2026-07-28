# OTHub 프로젝트 작업물 정리

> 작성: 2026-07-28 · 대상: [othub.kr](https://othub.kr) · 저장소: `github.com/hamhyeonggwang/othub2`
> 관련 문서: [PLANNING.md](PLANNING.md)(초기 기획) · [PHASE2-PLAN.md](PHASE2-PLAN.md)(Phase 2 로드맵) · [othub-ia-redesign-v1.md](othub-ia-redesign-v1.md)(IA 재설계)

이 문서는 OTHub 홈페이지 프로젝트의 현재 상태를 한 번에 파악할 수 있도록 정리한 작업 요약본이다.
개별 결정의 배경·논의 과정은 위 관련 문서에 더 자세히 남아 있다.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 서비스명 | **OTHub** — By OTs, For Everyone |
| 비전 | 작업치료사가 만든 훈련 웹앱·치료 콘텐츠·임상 평가 도구를 한곳에 모아, 치료사·보호자·당사자 누구나 접근할 수 있는 플랫폼 |
| 도메인 | https://othub.kr (Vercel 배포) |
| 기술 스택 | Next.js 16 (App Router, TypeScript, Server Component 기본) · Supabase(Auth + Postgres + RLS) · Vercel |
| 저장소 구조 | `Design/projects/clinical-system-portfolio` (이 문서가 위치한 프로젝트) |
| 개발 기간 | 2026-07-19 (MVP 최초 커밋) ~ 현재, 커밋 35개 |

### 서비스 3대 축
1. **훈련 웹앱 (For Everyone)** — 키오스크 훈련, 손 인식 게임 등 14종. 비회원도 즉시 실행 가능
2. **콘텐츠 허브 (For Everyone)** — 영상·정보·프로젝트 큐레이션. 좋아요·댓글·북마크는 회원 기능
3. **OTHub Assess (For OTs)** — 임상 평가 도구 8종. 치료사 인증 회원 전용

### 사용자·권한 모델
| 역할 | 접근 범위 |
|---|---|
| 게스트(비로그인) | 랜딩, 콘텐츠 열람, 훈련 웹앱 실행 |
| 회원(`member`) | + 좋아요·댓글·북마크, 프로필 |
| 치료사 회원(`therapist`) | + OTHub Assess (면허번호 등록 → 관리자 승인) |
| 관리자(`admin`) | + 콘텐츠 관리, 회원 승인, 통계 (운영자: h2g0614@gmail.com) |

---

## 2. 완료된 마일스톤

`PLANNING.md`의 로드맵(M0~M5) 기준 진행 현황:

| 마일스톤 | 범위 | 상태 |
|---|---|---|
| M0 기획 확정 | 기획서 리뷰, Supabase 프로젝트 생성 | ✅ 완료 |
| M1 셸 구축 | Next.js 스캐폴드, 랜딩, 정적 게임 14종 서빙 | ✅ 완료 |
| M2 회원제 | Supabase Auth(Google), profiles, 치료사 인증 요청 플로우 | ✅ 완료 |
| M3 콘텐츠 허브 | content_items DB화, 피드·검색, 좋아요·댓글·북마크 | ✅ 완료 |
| M4 Assess 편입 | 평가 도구 8종 + 종합보고서, Supabase 세션 저장, 치료사 가드 | ✅ 완료 |
| M5 마감 | 모바일 QA, SEO/OG, 배포 | ✅ 완료 (2026-07-28) |
| **P2-1 관리자 대시보드** | 치료사 인증 승인, 콘텐츠 CRUD, 회원/참여 현황, 방문자 통계 | ✅ 완료 |
| P2-2 훈련 기록 | `app_play_logs` — 게임 완료 시 결과를 회원 기록으로 저장 | ⬜ 미착수 |
| P2-3 sms-main 통합 | 사회성숙도 검사(117문항)를 Assess 9번째 도구로 편입 | ⬜ 미착수 |
| P2-4 커뮤니티 | 질문·답변 / 사례·노하우 / 공지 게시판 | ⬜ 미착수 |
| P2-5 신규 평가도구 | CDT(시계그리기), WHODAS 2.0 | ⬜ 미착수 |

> P2-2~P2-5의 상세 스키마·실행안은 [PHASE2-PLAN.md](PHASE2-PLAN.md)에 이미 설계되어 있음 — 착수 시 바로 참조 가능.

---

## 3. 사이트 구조 (현재 라우트)

```
/                     랜딩 — 히어로, 3대 축 소개, 퀵스타트, Organization/WebSite JSON-LD
/hub                  콘텐츠 허브 (영상·정보·프로젝트 피드)
/hub/apps             훈련 웹앱 목록 (카테고리: 키오스크/손인식/시선추적)
/hub/apps/[slug]      웹앱 실행 + 좋아요·댓글·북마크
/links                관련협회·학회·커뮤니티 링크 모음
/groups               회원 소모임 (RTL, Ctrl+AI, The들썩)
/lab                  진행 중인 프로젝트(Project) — concept/research/beta/available 상태 표기
/collections/[slug]   목적 기반 콘텐츠 묶음 (예: 지역사회 I-ADL)
/about                OTHub 소개
/assess               OTHub Assess 허브 — 치료사/관리자 전용, 사이드바에서 바로 진입 가능
/assess/[sessionId]   평가 세션 상세 + 결과보고서
/assess/hub.html 외   정적 평가 도구 8종 (public/assess/)
/login, /auth/callback  Google OAuth 로그인 (next 파라미터로 원래 목적지 복귀)
/me                   프로필 · 저장한 자료 · 치료사 인증 요청 · 평가 세션 (데스크톱 2컬럼 레이아웃)
/admin                관리자 대시보드 — 인증 요청/콘텐츠/회원/참여/방문자 통계
/l/[slug]             캠페인 전용 랜딩페이지 (SNS 광고 등 외부 유입용, 사이트맵 제외)
/robots.txt, /sitemap.xml, /manifest.webmanifest  SEO 인프라
```

전역 사이드바 내비게이션(`components/SiteHeader.tsx`): **Tool · Assess · Content · Link · Project · Group · 소개**

---

## 4. 데이터 모델 (Supabase, `othub_` 접두사)

| 테이블 | 용도 |
|---|---|
| `othub_profiles` | 회원 프로필, role(member/therapist/admin), 치료사 인증 요청 상태 |
| `othub_content_items` | 콘텐츠 통합 테이블 — type(app/video/book/tool/info/project), tags, peo_tags, status |
| `othub_likes` / `othub_comments` / `othub_bookmarks` | 콘텐츠 참여(engagement) |
| `othub_assessment_sessions` / `othub_assessment_results` | 평가 세션·결과 |
| `othub_page_views` | 방문자 통계 (관리자 대시보드) |

RLS는 전 테이블에 기본 적용. 현재 발행 콘텐츠 기준(2026-07-28): **app 14 · info 9 · project 3 · video 1**, 소모임 2건, 관리자 계정 1건(h2g0614@gmail.com).

---

## 5. 최근 작업 이력 (커밋 기준, 최신순 요약)

### 2026-07-28 — SEO 정비 · UX 갭 메꾸기
- 사이드바에 빠져 있던 **Assess 링크 추가** — 홈에서만 노출되고 다른 페이지로 이동하면 접근 경로가 없던 문제 해소
- `/assess` 진입 시 비로그인·미인증 사용자에게 "작업치료사 인증 신청 → 관리자 승인" 절차 안내 문구 추가
- 로그인 후 원래 목적지로 복귀하지 않던 `next` 파라미터 버그 수정 (OAuth redirectTo에 실어 보내도록 배선)
- **SEO 기반 정비**: `robots.txt`/`sitemap.xml`(동적, Supabase 콘텐츠 반영) 신설, OG/Twitter 카드 이미지(next/og), 파비콘·PWA manifest, 정적/동적 페이지 canonical 지정, 비공개 페이지(`/me` `/admin` `/assess` `/login`) noindex, 홈페이지 Organization/WebSite JSON-LD
- 소모임 **The들썩**(건강증진프로그램, 여의도 해오름장애인자립생활센터, 2019년~) 등록
- `/me` 페이지를 데스크톱에서 사이드바+메인 2컬럼 그리드로 재구성 (기존 640px 단일 컬럼이 넓은 화면에서 과도하게 좁던 문제)
- 헤더 계정 배지 옆에 로그아웃 버튼을 바로 노출 (기존엔 `/me`까지 들어가야 로그아웃 가능)
- 대한감각통합치료학회 등 `/links` 사이트 설명 문구 수정

### 2026-07-27 — 운영 편의
- 관리자 대시보드에 방문자 통계 추가
- 모바일 세로모드 햄버거 메뉴 빈 공간 버그 수정

### 2026-07-23~26 — 콘텐츠·개인 페이지 확장
- About 페이지 개편(로고·비전·미션), 개인 포트폴리오 페이지 추가
- 히어로 카피/비주얼 다듬기, 소모임 카테고리(`/groups`) 신설
- 훈련 웹앱 신규 추가로 14종 갱신(I Can Do ADL, 물고기 잡기 등), 목적별 랜딩페이지 인프라(`app/(landing)`) 도입

### 2026-07-20~24 — 정보구조(IA) 재설계
- 전역 네비게이션을 상단바 → **좌측 사이드바**로 전환 (재설계의 최우선 과제였음, [othub-ia-redesign-v1.md](othub-ia-redesign-v1.md) 참조)
- Google 로그인 전환, 콘텐츠 허브 중복 정리, Lab/Collections 독립 페이지, My Hub 확장
- **P2-1 관리자 대시보드** 구현 (치료사 인증 승인 등 운영 블로커 해소) + 라이선스 이슈 평가도구(FIM·MMSE-K·MMSE-DS·MoCA·COPM) 삭제
- Next.js 16 업그레이드 대응 (`middleware.ts` → `proxy.ts`)

### 2026-07-19 — MVP 최초 구현
- 랜딩 + 훈련 웹앱 + 콘텐츠 허브 + 회원제 + OTHub Assess를 한 번에 구현한 최초 커밋

---

## 6. 알려진 오픈 이슈 / 남은 작업

1. **Phase 2 미착수 항목** — 훈련 기록(P2-2), sms-main 통합(P2-3), 커뮤니티(P2-4), 신규 평가도구 CDT·WHODAS(P2-5). 상세 실행안은 `PHASE2-PLAN.md`에 이미 있음.
2. **OG 이미지에 한글 미사용** — next/og 기본 폰트에 한글 글리프가 없어 공유 카드 이미지(`opengraph-image.tsx`)는 로고+영문 워드마크만 사용 중. 한글을 넣으려면 폰트 파일을 별도로 임베드해야 함.
3. **apple-touch-icon 미분리** — 현재 파비콘(`app/icon.png`)이 투명 배경 PNG라 iOS 홈 화면 아이콘으로는 배경이 검게 보일 수 있음. 불투명 배경의 별도 apple-icon 에셋이 있으면 좋음.
4. **평가도구 라이선스** — FIM·MMSE-K·MMSE-DS·MoCA·COPM은 저작권 기관 허가 필요로 목록에서 제거된 상태(확정 결정). 추후 허가 확보 시 재검토.
5. **`/l/[slug]` 랜딩페이지** — 캠페인 종료 후 정리 필요 (설계상 "수명이 있는" 페이지로, 현재 `icandoadl` 1건 운영 중).

---

## 7. 디자인 시스템 요지

- 팔레트: `--navy #071b3f` · `--blue #1d6fdc` · `--cyan #21bff3` · `--ice #eef6ff`
- 타이포: Pretendard
- 톤: 라이트 아이스블루 + 글래스모피즘 카드, 캐주얼 브랜드 카피
- 반응형 분기: 1080px(사이드바 ↔ 상단바), 760px(모바일 햄버거 메뉴)
