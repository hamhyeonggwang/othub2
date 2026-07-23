# OTHub 정보구조 재설계 v1 — 분석 및 계획

> 2026-07-23 작성. 코드 수정 전 설계 문서.
> 기준: 실제 코드베이스 + Supabase 실데이터 + 작업공방.com 벤치마크 분석.

---

## A. Current State Audit — 현재 구조 분석

### Routes

| Route | 역할 | 인증 |
|---|---|---|
| `/` | 랜딩 (브랜드 + 기능 소개) | 공개 |
| `/hub` | 콘텐츠 허브 (영상·정보·도구 피드, 검색/필터) | 공개 |
| `/hub/apps` | 훈련 웹앱 목록 (카테고리 필터) | 공개 |
| `/hub/apps/[slug]` | 웹앱 실행 (iframe) + 좋아요/북마크/댓글 | 공개 (참여는 로그인) |
| `/assess` | 평가 세션 목록 | therapist/admin |
| `/assess/[sessionId]` | 세션 상세 + 결과 | therapist/admin |
| `/assess/hub.html` 외 | 정적 평가 도구 8종 + 보고서 | (정적) |
| `/login`, `/auth/callback` | Google OAuth | - |
| `/me` | 프로필, 치료사 인증 요청 | 로그인 |
| `/admin` | 콘텐츠 CRUD, 치료사 승인 | admin |

### Data Model (Supabase)

- `othub_content_items` — **이미 Object 체계의 씨앗이 있음**: `type`(app/video/book/tool/info), `category`, `tags[]`, `peo_tags[]`, `status`(draft/published), `app_path`/`external_url`
- `othub_likes` / `othub_comments` / `othub_bookmarks` — **Community Layer 이미 구현됨** (content 단위 연결)
- `othub_profiles` — role: member/therapist/admin
- `othub_assessment_sessions` / `othub_assessment_results` — 평가 데이터
- 정적 자산: `public/apps/*.html` 12종, `public/assess/*.html` 평가 8종 + hub + report

### 구조적 문제 (실코드 기준)

1. **글로벌 네비게이션 부재** — 헤더가 랜딩(`/`)에만 존재. `/hub`, `/assess` 등 내부 페이지는 "← 홈으로" 백링크뿐. 사이트가 아니라 페이지 모음처럼 동작. **이번 재설계의 최우선 실행 과제.**
2. **랜딩 = 기능 나열** — Quick Start(목적 진입점)가 없음. 히어로 → 소개 → 카드 나열.
3. **`tool` 타입 4종이 "준비 중" 잠금 카드** — GAS, ICF 분류기, MBI/FIM 기록, 보고서 생성. 사용 불가 자산이 사용 가능한 자산과 같은 피드에 섞임 (No Empty Architecture 위반). 실체는 "Concept 단계 Project".
4. **OTHub Assess 8종이 DB 레지스트리 밖에 있음** — content_items에 미등록(정적 HTML + 하드코딩 라벨). "도구" IA로 통합하려면 등록 또는 코드 레지스트리 필요.
5. **기술명이 마케팅 최상위에 노출** — 랜딩의 "AI Systems", "MediaPipe" 카드. 기술은 메타데이터여야 함.

### 재사용 가능 자산 (Existing Asset First)

- 카드/필터/검색 UI (`hub.css`, HubFeed) → Explore 경험의 뼈대
- engagement 3종 (likes/comments/bookmarks) → Community Layer, My Hub "저장한 자료"
- `peo_tags` → Collection 매핑 키로 재활용 가능 (신규 테이블 불필요)
- role 체계 → therapist 게이트 유지
- 디자인 토큰 (`--navy --blue --cyan`, Pretendard, glass card) → 유지

---

## B. Benchmark Extraction — 작업공방 분석

실측 (2026-07-23 접속):
- Hero: "작업치료사 5,000명이 함께 성장하는 곳" — 정체성 한 문장
- Trust: 5,000+ 회원 / 8년 / 300+ 특강 — 숫자 3개
- 콘텐츠 조직: 시리즈 단위 큐레이션 (감각통합, ADHD, 서류문제해결, 신경과학 … 20개+)
- 네비: 최대 4단계 깊이의 거대한 트리 (시리즈 → 연도 → 강사 → 차시)
- HOT 랭킹, 연회원 CTA, "걸어온 길" 연혁 페이지

| 원리 | 판단 | OTHub 적용 방식 |
|---|---|---|
| 정체성 한 문장 + 숫자 신뢰 | **수용** | Hero에 통합. 12 훈련 앱 / 8종 평가 / 설치 0 (실데이터 일치 확인) |
| 시리즈 큐레이션으로 발견 | **재해석** | 강의 묶음 → **임상 문제 중심 Collection** (Tool+Content+Project 혼합) |
| 활동 축적 표시 ("걸어온 길") | **재해석** | History가 아니라 **Build Log** — "지금도 만들어지는 중" |
| 명확한 이중 CTA | **수용** | 도구 찾기 / OTHub 알아보기 |
| 브랜드 → 콘텐츠 연결 구조 | **수용** | 철학(About) → 도구(사용)로 이어지는 경로 |
| 쇼핑몰 UX, 장바구니, 상품 카탈로그 | **배제** | - |
| 4단계 메뉴 트리 | **배제** | 상단 메뉴 3~4개 고정, 깊이는 필터로 해결 |
| HOT/BEST 랭킹 | **배제** | - |
| 자유게시판 커뮤니티 | **배제** | Community Layer(콘텐츠 단위 참여)로 대체 — 이미 구현됨 |

---

## C. Asset Inventory — 실데이터 기준 (published 22건 + 정적 8건)

### Tool / Training — 12종 (DB 실측)
| 자산 | 카테고리 | 기술 | Collection 후보 |
|---|---|---|---|
| CU·빽다방·마라탕·홈플러스·코레일·하루필름·문구야놀자 키오스크 (7) | kiosk | Web | 지역사회 I-ADL |
| 에어드로잉, 풍선 탐험대, 색깔 공 받기, 누구나 쓰기게임 (4) | hand | MediaPipe | 상지·놀이 / 학령기 |
| GazePlay 별자리 그리기 (1) | gaze | Gaze | 상지·놀이 |

### Tool / Assessment — 8종 (정적, DB 미등록)
작업수행 프로파일링, OTIPM, JTHFT, MACS, HFT 임상관찰, 감각운동협응, K-MBI, K-IADL
→ **레지스트리 등록 필요** (Phase 3)

### Content — 6건
- info 5: 학회·협회 사이트 4 (KASI, KASDR, KSOTCS 등) + OT Hub 유튜브 채널
- video 1: 감각통합 EP1
→ **콘텐츠는 현재 매우 얇음.** Collection을 지탱하기엔 부족 — Collection 수를 늘리지 말아야 할 근거.

### Project (재분류 대상) — 4건
현재 `type: tool` "준비 중" 카드 = 실체는 Concept/Research 단계:
- GAS 목표 설정 (Concept)
- ICF 자동 분류기 (Research — ICF 시스템 프로젝트와 연결)
- MBI/FIM 평가기록 (Concept — Assess와 중복 가능성, 통합 검토)
- 보고서 자동 생성 (Concept)

### Collection 후보 — 근거 기반 판정

| 후보 | 구성 가능 자산 | 판정 |
|---|---|---|
| **지역사회 I-ADL** | Tool 7 (kiosk) + Assess 1 (K-IADL) | ✅ 즉시 성립 |
| **학령기 참여** | Tool 2 (문구야놀자, 쓰기게임) + Content 1 (KSOTCS) + Assess 1 (MACS) | ⚠️ 성립하나 얇음 |
| 감각통합 | Content 4 + Tool 0 | ❌ Collection 아님 → 태그 필터로 |
| ICF & 기록 | Project 1 + Tool 0 + Content 0 | ❌ 자산 없음 → Lab 항목으로 |

→ **시작은 1~2개만.** "지역사회 I-ADL" 확정, "학령기 참여" 선택적. 나머지는 자산이 쌓이면 승격.

---

## D. Proposed OTHub IA v1

### Object 체계 (데이터 레이어)

기존 `type` 필드를 재정의해 그대로 사용 — **마이그레이션 최소화**:

```
Tool     = type: app (training) | assess (assessment, 신규 등록)
Content  = type: video | info | book | guide
Project  = type: project (신규) — status 메타: available/beta/research/concept
Collection = 코드 정의 상수 + 태그 쿼리 (신규 테이블 없이 시작)
```

기술(MediaPipe, Gaze)은 `tags[]` 메타데이터로만. 상위 분류 금지.

### Global Navigation (제안 — 원안보다 축소)

```
OTHub   도구   콘텐츠   소개        [검색]  [My Hub / 로그인]
```

- **도구**: 전체 / 훈련 / 평가 (임상지원은 실자산 생기면 추가)
- **콘텐츠**: 전체 / 임상·근거 / 학회·자료 (현재 6건 — 하위 분류 최소화)
- **소개**: Why OTHub / How We Build / Build Log / 만든 사람
- **My Hub**: 저장한 자료(북마크 — 즉시 구현 가능) / 평가 세션(기존 /assess) / 내 활동 (향후)

**원안과의 차이 — "프로젝트"를 상위 메뉴에서 제외.**
사유: 현재 Project 실자산 4건이 전부 Concept/Research. 상위 메뉴로 만들면 빈 아키텍처가 됨.
→ 홈 섹션 "OTHub Lab" + `/lab` 단일 페이지로 시작. 프로젝트가 6개+ 사용 가능 단계에 도달하면 메뉴로 승격. (Scalable IA: 승격해도 메뉴 4개.)

### URL 전략 (기존 URL 보존)

| 기존 | 처리 |
|---|---|
| `/hub/apps`, `/hub/apps/[slug]` | **KEEP** (도구 메뉴가 가리키는 곳) — `/tools` 신설 대신 유지 |
| `/hub` | **KEEP + 역할 재정의** (콘텐츠 탐색) |
| `/assess` | **KEEP** |
| `/lab` | **신설** (Project 4건 이동) |
| `/about` | **신설** (철학·How We Build·Build Log — 랜딩에서 분리) |
| 정적 `/apps/*.html`, `/assess/*.html` | **불변** (외부 링크·SEO 보존) |

---

## E. Homepage v1 (제안 — 원안 9섹션 → 7섹션 압축)

| # | 섹션 | 내용 | 원안 대비 |
|---|---|---|---|
| 1 | **Hero + Trust** | 제품 정의 헤드라인 + 숫자 3개 + 이중 CTA | Trust Signal(S03)을 Hero에 통합 — 작업공방도 동일 패턴 |
| 2 | **Quick Start** | 훈련하기 / 평가하기 / 자료 찾기 | 원안 유지. 홈의 핵심 |
| 3 | **Featured Tools** | 도구 4~6개 카드 (수동 큐레이션) | 원안 유지 |
| 4 | **Collections** | 1~2개만 (지역사회 I-ADL 확정) | 원안 대비 축소 |
| 5 | **OTHub Lab** | Project 4건 + 상태 배지 | 원안 유지 (AI 카테고리 대체) |
| 6 | **How We Build + Build Log** | 철학 6단계(기존 자산) + 최근 이력 3건 | S07+S08 통합 |
| 7 | **Final CTA** | 도구 제안 → 기존 문의 메일 연결 (신기능 아님) | 원안 유지, 범위 축소 |

### Hero 문구 — 결정 필요 사항

현재 히어로는 오늘 확정한 브랜드 문구가 들어가 있음:
> 당신의 존재가 **작업**이 됩니다. 그리고 그 작업이 당신을 만듭니다. / 그렇게 함께합니다.

재설계 원칙(5초 이해, 제품 명료성)과 철학 문구는 긴장 관계. 제안:

- **1안 (권장)**: Hero는 제품 정의 — "치료실에서 만든 도구를, 누구나 바로 사용할 수 있게." / 철학 문구는 `/about` Why OTHub의 오프닝으로 이동 (브랜드 자산 보존·승격)
- **2안**: 철학 문구 유지 + Quick Start를 바로 아래 배치해 기능 진입 보완

### Trust 숫자 (실데이터 검증 완료)

```
12          8            0
훈련 웹앱    평가 도구      설치 필요
```

---

## F. Current → New Mapping

| 현재 위치 | 현재 역할 | 문제 | 새 Object | 새 위치 | 처리 |
|---|---|---|---|---|---|
| `/` 랜딩 | 브랜드+기능 나열 | Quick Start 부재 | - | `/` 재구성 | **REBUILD** |
| `/hub/apps` | 훈련 웹앱 | 없음 | Tool/Training | 동일 | **KEEP** |
| `/hub` | 콘텐츠 피드 | 역할 모호 | Content Explore | 동일 | **KEEP+RENAME**(역할) |
| `/assess` | 평가 시스템 | 독립 사일로 | Tool/Assessment | 동일 + 도구 메뉴 통합 | **KEEP+LINK** |
| tool 4종 "준비 중" | 잠금 카드 | 빈 자산 노출 | Project | `/lab` | **MOVE** |
| 랜딩 "AI Systems" 카드 | 기술 자랑 | AI≠카테고리 | - | Lab 섹션으로 | **MERGE** |
| 랜딩 Approach 6단계 | 철학 | 위치만 조정 | Content | `/about` + 홈 중하단 | **MOVE** |
| 히어로 철학 문구 | 브랜드 | 제품 정의와 긴장 | Brand | `/about` 오프닝 (1안) | **MOVE**(결정 필요) |
| `/me` | 프로필 | 확장성 | My Hub 뼈대 | 동일 | **KEEP+EXTEND** |
| 헤더 (랜딩 전용) | 네비 | 전역 부재 | Global Nav | 전 페이지 | **REBUILD** |

기능 손실 없음: 인증·평가 데이터·정적 URL·engagement 전부 보존.

---

## G. Risks

| 리스크 | 내용 | 대응 |
|---|---|---|
| 빈 콘텐츠 | Content 6건으로 "콘텐츠" 메뉴가 얇음 | 하위 분류 최소화, 콘텐츠 등록이 늘 때 분류 확장 |
| 과도한 구조화 | Collection·Project 체계가 자산보다 앞서감 | Collection 1~2개, Lab 단일 페이지로 시작 |
| Assess 이중 등록 | 정적 8종을 DB 등록 시 하드코딩 라벨과 중복 | Phase 3에서 단일 소스(레지스트리) 정리 |
| MBI/FIM 프로젝트 중복 | Assess K-MBI와 기능 겹침 | Lab 이동 시 통합 여부 명시 |
| URL 변경 | `/tools` 신설 시 링크 파손 | 기존 `/hub/apps` 유지로 회피 |
| 유지보수 | Collection을 DB화하면 admin 확장 필요 | 코드 상수로 시작, 필요 시 DB 승격 |
| 범위 확장 | My Hub 6개 하위 메뉴 전부 구현 유혹 | 북마크·세션만 연결, 나머지 "향후" 명시 |

---

## H. Implementation Phases

```
Phase 1 — Global Nav + IA 골격          [기반, 최우선]
  공유 헤더/푸터 컴포넌트 신설 → 전 페이지 적용
  메뉴: 도구 / 콘텐츠 / 소개 / My Hub
  /about 신설 (철학 문구·How We Build 이동)

Phase 2 — Homepage 재구성
  7섹션 구조로 랜딩 재작성 (Hero 결정 반영)
  Featured Tools 수동 큐레이션

Phase 3 — Tool Registry 통합
  Assess 8종 레지스트리 등록 (코드 상수 or DB)
  status 메타 확장 (available/beta/research/concept)
  tool 4종 → project 타입 전환

Phase 4 — /lab (OTHub Lab)
  Project 목록 + 상태 배지 + 문제→실험 서사

Phase 5 — Collections
  코드 정의 Collection 1~2개 + 상세 페이지
  홈 Collections 섹션 연결

Phase 6 — My Hub
  /me 확장: 저장한 자료(북마크 즉시), 평가 세션 링크
  최근 사용·완료 훈련은 데이터 수집 설계 후
```

원안과의 차이: **Collections(P4)와 Lab(P5) 순서 교체** — Lab은 기존 4건을 옮기면 끝나 작고 확실하지만, Collection은 상세 페이지 UX 설계가 더 필요. 작은 것 먼저.

---

## 최종 판단 기준 자가 평가

1. 5초 이해 — Hero 1안 채택 시 YES (철학 문구 유지 시 부분적)
2. 2~3클릭 도달 — Quick Start로 1~2클릭. YES
3. Tool 50개 확장 — 메뉴 불변, 필터·Collection으로 흡수. YES
4. 신기술 등장 — tags 메타 + Lab. 메뉴 불변. YES
5. 기존 자산 재사용 — 카드·필터·engagement·디자인 토큰 전부 재사용. YES
6. 작업공방 복제 아님 — 도구 실행 플랫폼 vs 교육 커뮤니티. 구조적으로 다름. YES
7. 운영자 전 활동 불포함 — "다른 사람이 사용할 수 있는가" 기준 유지. 연구·강의는 미포함. YES
8. 문제→도구→사용 흐름 — Quick Start + Collection이 그 경로. YES
