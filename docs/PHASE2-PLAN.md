# OTHub Phase 2 기획서

> 버전 0.1 · 2026-07-19 · 전제: MVP(M1~M4) 완료, [PLANNING.md](PLANNING.md) 참조
> 저장소: github.com/hamhyeonggwang/othub2 · Supabase: hamhyeonggwang's Project (`othub_` 접두사)

---

## 0. Phase 2 범위와 우선순위

| 순위 | 마일스톤 | 핵심 가치 | 의존성 |
|---|---|---|---|
| **P2-1** | 관리자 대시보드 | **운영 블로커 해소** — 현재 치료사 승인 수단이 SQL뿐 | 없음 |
| **P2-2** | 훈련 기록 (app_play_logs) | 게임을 "놀이"에서 "데이터가 쌓이는 훈련"으로 | 없음 |
| **P2-3** | sms-main 통합 | Assess 9번째 도구 (사회성숙도 검사 117문항) | 없음 |
| **P2-4** | 커뮤니티 | 회원 락인, "By OTs" 정체성 강화 | P2-1 (모더레이션) |
| **P2-5** | 신규 평가도구 | Assess 확장 (현재 ready:false 7종) | **라이선스 검토 선행** |

> 권장 진행 순서 = 표 순서. P2-1이 최우선인 이유: 지금은 치료사 인증 요청이 들어와도
> 관리자가 DB 콘솔 없이는 승인할 수 없다. 실사용자를 받는 순간 바로 필요해진다.

---

## P2-1. 관리자 대시보드 (`/admin`)

### 기능
1. **치료사 인증 관리** — 요청 목록(면허번호·소속·요청일), 승인/반려 버튼. 승인 시 `role='therapist'`, `approved_at=now()`
2. **콘텐츠 관리** — `othub_content_items` CRUD (등록/수정/게시·비공개 전환). MVP에서 시딩으로만 넣던 콘텐츠를 UI로 관리
3. **회원 현황** — 가입자 수, 역할별 분포, 최근 가입 목록
4. **참여 현황** — 콘텐츠별 좋아요·댓글 수, 최근 댓글 목록(부적절 댓글 삭제)
5. **Assess 현황** — 세션 수 통계(개인 평가 내용은 열람하지 않음 — 개인정보 원칙)

### 스키마·RLS 변경 (필수)
현재 `othub_profiles`는 본인 행만 읽기/수정 가능 → admin 정책 추가 필요:

```sql
-- admin은 전체 프로필 조회·역할 변경 가능
create policy othub_profiles_select_admin on public.othub_profiles
  for select using (exists (select 1 from public.othub_profiles p
                            where p.id = auth.uid() and p.role = 'admin'));
create policy othub_profiles_update_admin on public.othub_profiles
  for update using (exists (...role = 'admin'));
-- 주의: 같은 테이블 참조 정책은 무한재귀 위험 → security definer 함수
-- othub_is_admin()으로 분리 구현 (기존 othub_get_public_profiles 패턴 재사용)
```

- admin 계정 지정: 운영자 본인 계정(h2g0614@gmail.com) 가입 후 1회 SQL로 `role='admin'` 부여
- 댓글 삭제: admin용 delete 정책 추가 (`othub_comments`)

### 화면
- `/admin` — 탭형 대시보드 (인증 요청 / 콘텐츠 / 회원 / 참여). 미들웨어에 `/admin` → admin 전용 가드 추가 (기존 `/assess` 가드 패턴 재사용)

### 완료 기준
회원가입 → 치료사 인증 요청 → **admin이 UI에서 승인** → 해당 회원이 `/assess` 접근 가능 (E2E)

---

## P2-2. 훈련 기록 (app_play_logs)

### 개념
게임(iframe) → 부모 페이지로 `postMessage` → 서버 액션이 `othub_app_play_logs`에 저장.
게임 원본은 최소 수정 원칙 — 결과 화면에 3~5줄의 표준 전송 코드만 삽입.

### 표준 메시지 스키마 (게임 → 부모)
```ts
interface OTHubPlayResult {
  source: "othub-app";        // 식별자 (다른 postMessage와 구분)
  version: 1;
  slug: string;               // "cu-kiosk-trainer" 등
  completed: boolean;
  durationSec: number;
  score?: number;             // 게임별 점수 (없으면 생략)
  detail?: Record<string, number | string>; // 단계별 기록 등 자유 필드
}
```

### 스키마
```sql
create table public.othub_app_play_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null 허용: 비로그인 플레이
  content_id uuid not null references public.othub_content_items(id) on delete cascade,
  completed boolean not null default false,
  duration_sec integer,
  score jsonb not null default '{}'::jsonb,
  played_at timestamptz not null default now()
);
-- RLS: 본인 행만 읽기, insert는 로그인 사용자 본인 것만.
-- 비로그인 기록은 저장하지 않음(개인정보·어뷰징 리스크 회피, 단순화) ← 결정 필요 #2
```

### 단계별 적용
1. 인프라: 상세 페이지에 message 리스너 + 저장 서버 액션 + `/me` "내 훈련 기록" 탭 (완료 횟수·최근 기록·게임별 추이)
2. 파일럿 게임 2종 계측: `cu-kiosk-trainer`(단계 완료 시점 명확), `color-tray-game`(점수 존재)
3. 나머지 10종 순차 계측 — 게임별 결과 화면 위치 파악 필요, 1~2종씩 배치 진행

### 완료 기준
로그인 상태로 파일럿 게임 완주 → `/me`에서 기록 확인. 비로그인 플레이는 저장 없이 정상 동작

---

## P2-3. sms-main 통합 (사회성숙도 검사)

### 현황 분석 (2026-07-19 코드 확인)
- React 19 + Vite + Tailwind v3 독립 앱. 117문항 데이터(`testItems.js` 666줄)·채점 로직(`scoring.js`)은 온전
- **빌드 산출물(`sms-assets/assess-sms-*.js/css`)은 있으나 이를 로드하는 `assess-sms.html`이 없음** (sms-main/hub.html은 `ready:true`로 참조하지만 파일 부재 — 깨진 상태)
- `ot_session` 세션 체계와 **완전히 미연동** (sessionStorage 사용 없음)
- 결과 저장이 Google Apps Script 웹훅(no-cors GET)으로 나감 — OTHub 체계 밖

### 통합 전략 (재작성 없이 편입)
1. Vite 빌드를 재실행해 `public/assess/assess-sms.html` + 에셋 생성 (`vite.config.js`에 `base` 경로와 output 파일명 고정 추가)
2. 세션 글루 코드 주입: 빌드된 HTML에 `window._TOOL_ID='sms'` + `persistToolReport()`(SMS 결과 요약 HTML 생성) + `goNextTool()` + `session-sidebar.js` — 기존 8종과 동일 패턴
3. React 앱 소폭 수정 (통합 지점 2곳):
   - 시작 화면: `ot_session.info`에서 이름·생년월일 자동 채움
   - 결과 화면: GAS 웹훅 저장 → **제거**하고 결과를 `window.__SMS_RESULT`로 노출 (글루 코드가 reportByTool로 수집)
4. `public/assess/hub.html`의 TOOLS에서 `sms`를 `ready:true`로 전환
5. `/api/assess/save-session`은 수정 불필요 (reportByTool에 실리므로 자동 저장됨)

### 완료 기준
허브에서 SMS 포함 세션 시작 → 117문항 채점 → SA/SQ 산출 → 종합 보고서에 SMS 섹션 포함 → 클라우드 저장 확인

---

## P2-4. 커뮤니티 (`/community`)

### 컨셉
"By OTs, For Everyone" — 치료사·보호자가 함께 쓰는 게시판. MVP 게시판 3분류:

| 카테고리 | 쓰기 권한 | 예시 |
|---|---|---|
| 질문·답변 | 회원 | "감각추구 아동 가정 활동 추천해주세요" |
| 사례·노하우 | 치료사 회원 | 중재 아이디어, 도구 활용 팁 |
| 공지 | admin | 플랫폼 소식 |

### 스키마
```sql
create table public.othub_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('qna','case','notice')),
  title text not null,
  body text not null,
  is_deleted boolean not null default false, -- soft delete (admin 모더레이션)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- 댓글·좋아요는 기존 othub_comments/othub_likes를 content 전용에서
-- 대상 다형(polymorphic)으로 확장하지 않고, othub_post_comments 별도 테이블로 단순 유지
-- RLS: 읽기 전체 공개(비회원 열람 가능), 쓰기 회원, case는 therapist+, notice는 admin
```

### 규칙 (임상 커뮤니티 특성)
- 글쓰기 폼에 개인정보 주의 문구 고정 노출 ("환자 실명·사진·식별 가능 정보 금지")
- 신고 기능은 Phase 3로 미룸 — 초기엔 admin 직접 모더레이션(P2-1 의존)
- 의학적 조언 면책 문구: 커뮤니티 답변은 참고용, 진단·치료 판단 대체 불가

### 완료 기준
회원이 질문 작성 → 다른 회원 댓글 → admin이 대시보드에서 soft delete 가능

---

## P2-5. 신규 평가도구

**결정(2026-07-19): 라이선스 이슈가 있는 도구는 목록에서 삭제한다.**
FIM, MMSE-K, MMSE-DS, MoCA, COPM은 저작권 기관의 전산화 허가가 필요하므로
Assess 허브의 "준비중" 목록에서 제거 완료. 추후 허가를 확보하면 그때 재추가한다.

남은 구현 대상 2종:

| 도구 | 라이선스 상태 | 구현 난이도 | 순서 |
|---|---|---|---|
| CDT (시계그리기) | ✅ 채점법 다수 공개(예: Shulman) | 하 | **1순위** |
| WHODAS 2.0 | ✅ WHO 공개 — 한국어판 사용 조건 확인만 | 중 | **2순위** |

### 실행안
1. CDT·WHODAS 2.0을 기존 assess-*.html 패턴(단일 HTML + `_TOOL_ID` 글루)으로 구현
2. 신규 도구마다: 문항·채점 구현 → hub.html TOOLS `ready:true` → 종합보고서 섹션 확인

### 완료 기준 (1차)
CDT + WHODAS 2.0이 세션 플로우·클라우드 저장에 완전 편입

---

## 공통: 스키마 변경 요약

| 마일스톤 | 신규 테이블 | 정책 변경 |
|---|---|---|
| P2-1 | 없음 | `othub_profiles` admin select/update, `othub_comments` admin delete, `othub_is_admin()` 함수 |
| P2-2 | `othub_app_play_logs` | 본인 행 RLS |
| P2-3 | 없음 | 없음 (기존 assess 테이블 재사용) |
| P2-4 | `othub_posts`, `othub_post_comments`, `othub_post_likes` | 카테고리별 쓰기 권한 |
| P2-5 | 없음 | 없음 |

모든 마이그레이션은 기존 원칙 유지: `othub_` 접두사, RLS 기본 활성화, 적용 후 `get_advisors` 보안 점검.

## 확정된 결정 사항 (2026-07-19)

1. **admin 계정** — h2g0614@gmail.com에 admin 역할 부여 ✅
2. **비로그인 훈련 기록** — 저장하지 않음 ✅
3. **커뮤니티 열람 범위** — 비회원 열람 허용 ✅
4. **평가도구 라이선스** — 이슈 있는 도구(FIM·MMSE-K·MMSE-DS·MoCA·COPM)는 목록에서 삭제 ✅
5. **배포 시점** — P2-1 완료 후 1차 배포 ✅
