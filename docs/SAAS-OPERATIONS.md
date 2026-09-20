# OTHub 공개 SaaS 개선·운영 계획

## 기준과 소유권

- 운영 소스: `hamhyeonggwang/othub2`, 기준 커밋 `fc0a57c105b55fe9f858da394e47c1da9d3c0d02`.
- 서비스 진입 도메인: `othub.kr` (현재 `www.othub.kr`로 이동).
- 운영 담당 계정: `h2g0614@gmail.com`. 이메일을 코드에 하드코딩해 권한을 부여하지 않는다. 기존 `othub_profiles.role = admin`과 서버/RLS 검증을 유지한다.
- 1차 개선은 보호된 읽기 전용 Preview에 배포했다. 운영 배포·DNS·OAuth 설정·운영 DB 변경은 실행하지 않았다. 아래 Preview 검증 기록을 참고한다.
- 이전에 조사한 별도 정적 저장소 `othub 2`의 파일·SQL은 이 운영 저장소에 적용하지 않는다.

## 1차 변경: 이동 경험과 통계 정확성

- 공통 사이드바를 프로필 조회의 Suspense 경계 밖으로 분리했다.
- 현재 메뉴 강조, 이동 중 상태, 모바일 버튼의 키보드 지원·닫기 동작, 로딩/오류 화면을 추가했다.
- 공개 페이지 6곳에서 사용하지 않는 프로필 조회 대기를 제거했다.
- 프록시의 동기 방문 기록을 제거했다. 프록시는 세션 검증과 기존 Assess/Admin 권한 제한을 계속 수행한다.
- 브라우저가 경로 변경 후 `/api/page-view`로 보내며 실패해도 화면 흐름은 유지된다. 메뉴 prefetch와 쿼리 필터 변경은 조회수에 포함하지 않는다.
- 기존 `othub_page_views(path, visitor_id)`와 관리자 통계 RPC를 그대로 사용한다. 새 테이블이나 서비스 역할 키를 요구하지 않는다.
- 관리자 인기 페이지에 7일/30일 선택을 추가했다. 조회 실패와 실제 0건을 구분한다.

### 지표 해석과 수집 경계

- 조회수는 브라우저에서 확정된 경로 이동 횟수다. 페이지 체류시간·도구 실행 완료·실제 사용자 수를 뜻하지 않는다.
- 고유 브라우저는 기존 `othub_vid` UUID 쿠키 기준이다. 새 쿠키는 HttpOnly, HTTPS에서 Secure, SameSite=Lax이며 기존과 같은 최대 1년이다. 무작위 식별자도 추적 식별자로 취급한다.
- 검색어·쿼리·해시·평가 세션 ID를 저장하지 않는다. 평가 세션은 `/assess/session`으로 묶는다. 이름, 이메일, 평가 결과, 자유입력값을 수집하지 않는다.
- Admin, 로그인/OAuth, API, 독립 HTML 도구 내부는 제외한다. iframe 내부 활동과 평가 HTML 사용량은 이 통계만으로 판단할 수 없다.
- DNT=1, JavaScript 비활성화, 숨겨진 탭, 네트워크 차단 등은 집계 누락 요인이다. 재시도하지 않아 과다 집계를 줄이지만 전달 보장 지표는 아니다.
- 전환 이전 데이터에는 prefetch/서버 요청이 섞여 있다. **실제 배포 일시**를 기록하고 전후 조회수의 단순 증감을 성과로 해석하지 않는다.
- 동일 출처·JSON 타입·512바이트 제한·경로 검증을 적용했다. 이는 자동화된 허위 요청을 막는 완전한 봇/속도 제한이 아니다.

## 배포 전 체크리스트

1. 별도 Preview 환경에서 아래 로컬 검증과 스테이징 로그인 검증을 완료한다.
2. Supabase URL/공개 키가 기존 운영 프로젝트와 일치하는지 확인한다. 비밀 키나 환자 데이터는 로그/PR에 넣지 않는다.
3. 스테이징 DB에서 기존 익명 page-view INSERT 정책과 관리자 전용 통계 RPC/RLS를 확인한다. 로컬 가짜 DB 테스트는 실제 RLS 검증을 대체하지 않는다.
4. Google 로그인 → `/me`, 일반회원 Assess/Admin 차단, 치료사 Assess 허용·Admin 차단, 관리자 통계 접근을 계정별로 확인한다. OAuth 허용 URL은 기존 설정을 유지한다.
5. 도구 3종과 평가 1종을 직접 확인한다. 평가 결과·저장 정책은 이번 변경 범위 밖이며 변경하지 않았다.
6. 수집 목적·쿠키 기간·사용자 선택과 삭제/보관 정책을 확정하고 공개 안내를 검토한다. 현재 기록을 무기한 보관해도 된다고 가정하지 않는다.
7. 공개 telemetry에 대한 플랫폼 속도 제한/봇 차단, 비용 경보를 운영 환경에서 설정·검증한다. 런타임 인메모리 제한만으로 분산 환경을 보호하지 않는다.
8. 담당자가 Preview 승인 후 배포한다. 배포 시각·커밋·회귀 테스트 결과와 통계 기준 변경을 릴리스 기록에 남긴다.

## 정기 업데이트 리듬 (제안, 자동 실행 미등록)

| 주기 | 작업 | 확인할 결과 |
| --- | --- | --- |
| 매주 | 인기 페이지, 통계 전송 오류율, 로그인/도구 오류 확인 | 우선순위 이슈 1~3건 |
| 격주 | 개선 묶음 → 테스트 → Preview → 담당자 승인 → 배포 | 짧은 공개 변경 내역과 되돌리기 대상 |
| 매월 | 의존성/보안 점검, 권한·백업 복구·쿠키 보관 정책 점검 | 점검 날짜와 후속 담당 기록 |

### 다음 개선 순서

1. 운영 측정: 동일 네트워크·로그인 조건에서 cold/warm 경로 이동 20회 이상 측정. 클릭→피드백과 클릭→콘텐츠 표시의 p50/p95를 따로 기록한다. 로컬 테스트 수치를 운영 성능으로 표현하지 않는다.
2. 관리자 이용 패턴: 목적을 합의한 뒤 도구 실행·오류·완료 이벤트를 최소 필드로 설계한다. 평가 데이터와 연결하지 않는다. 보관·사용자 선택·속도 제한을 먼저 갖춘다.
3. 페이지 디자인: 기존 브랜드·URL·게임을 유지하며 홈/목록/상세/계정의 간격, 타이포, 빈 상태, 모바일 접근성을 순서대로 정리한다. 임상 기능을 임의로 재설계하지 않는다.
4. 공개 업데이트 안내: 운영자가 실제 배포한 내용만 공개하고, 계획과 출시 완료를 구분한다.

## 로컬 검증

```sh
npm ci
npm test
npm run typecheck
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:4181 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=local-test-only-not-a-real-key npm run build -- --webpack
npx playwright install chromium
npm run test:e2e
```

브라우저 테스트는 4180(앱), 4181(가짜 Supabase)을 직접 시작한다. 실제 계정·운영 DB를 사용하지 않는다. `test-results`는 로컬 검증 산출물이며 커밋하지 않는다.

### 2026-09-20 로컬 검증 결과

- 단위 테스트 45개 통과: 수집 경로 최소화, 요청 검증, INSERT 실패, 세션·역할 가드, 관리자 통계 실패 처리.
- 타입 검사 및 Next.js 16.2.10 프로덕션 빌드(webpack) 통과.
- Chromium 브라우저 테스트 5개 통과: 느린 조회 중 피드백, prefetch 제외·통계 오류 중 이동, 모바일 메뉴, 비로그인 보호 경로, 로컬 DB 수집 계약.
- 모바일 390px와 데스크톱 화면 캡처를 확인했다. 도구 목록은 가짜 DB의 빈 상태로 검증했으며 운영 콘텐츠의 시각 검증은 아직 아니다.
- 기존 lockfile에 있던 의존성의 버전은 바꾸지 않고 검증 도구를 추가했다. Next.js가 상위 디렉터리의 lockfile을 작업 루트로 오인하지 않도록 프로젝트 루트를 지정했다.
- 실제 Google OAuth·운영 RLS·운영 p95 응답속도·Vercel Preview 배포는 아직 검증하지 않았다.

## 롤백

문제가 생기면 이번 배포 직전의 검증된 Vercel 배포로 되돌린다. 스키마 변경이 없으므로 역방향 SQL은 없다. 이전 코드로 되돌리면 서버 요청 기반 통계 수집도 돌아오므로 롤백 시각을 기록한다. 인증 오류, Assess 접근 제한 회귀, 페이지 오류 증가가 발생하면 기능 확장보다 롤백을 우선한다.

## 2차 진행: 보호된 Preview 배포

- Preview: https://othub2-81mv8w5yd-starlight-papas-projects.vercel.app
- 배포 상세: https://vercel.com/starlight-papas-projects/othub2/B1H4uzCJLwduDLRBLxNgatUDifC5
- 배포 ID: `dpl_B1H4uzCJLwduDLRBLxNgatUDifC5`, 상태 `READY`.
- 로컬 소스 커밋: `a43c558e9c5edb5ff31469e12d014eb6b5184ad2`, 브랜치 `codex/saas-preview-20260920`. GitHub push/PR/merge는 실행하지 않았다.
- 배포 후 확인한 운영 ID는 기존 `dpl_4VR63rjLBbWHjbVsXb44g8tYsi7d`, 커밋은 `fc0a57c105b55fe9f858da394e47c1da9d3c0d02` 그대로다. Preview에 운영 도메인을 연결하지 않았다.
- 기존 Vercel 보호 설정 `all_except_custom_domains`를 유지했다. 검토자는 Vercel 계정 접근 권한이 필요하다. 우회 토큰은 생성하지 않았다.
- Preview 환경변수 2개와 Production 환경변수 2개는 각각 존재하지만 민감 변수로 설정되어 있어 DB 분리 여부는 검증하지 못했다.

### Preview 안전장치 및 로그인 보완

- `VERCEL_ENV=preview`에서 데이터 변경을 기본 차단한다. 관리자 액션, 댓글·북마크·좋아요, 프로필 변경, 평가 저장, 방문 기록 모두 차단한다. 로그인·세션 갱신·조회는 허용된다. 이는 DB 자체의 읽기 전용 계정을 의미하지는 않는다.
- 이번 배포는 빌드·실행 환경 모두 `OTHUB_PREVIEW_ALLOW_WRITES=false`로 지정했다. 이 변수는 **분리된 스테이징 DB를 확인하고 담당자가 승인한 경우에만** `true`로 변경할 수 있다.
- 화면에 검토 환경 배너를 표시하며 Preview에서는 방문 트래커를 렌더링하지 않는다.
- OAuth 콜백에 직접 주어진 복귀 경로도 검증한다. `@다른호스트`, `//다른호스트`, 역슬래시·제어문자 등이 포함된 경로는 `/me`로 돌린다.
- 추가 후 단위 테스트 70개, 브라우저 테스트 5개, 타입 검사, 로컬 webpack 빌드가 통과했다. Vercel Node 24 환경의 Turbopack 빌드도 성공했다.

### 당시 남은 검증 / 재개 지점 (이력)

사용자 요청에 따라 아래 실제 계정 검증은 보류 상태다. 다음 작업으로 홈·목록 디자인을 개선했으며 변경 범위와 로컬 확인 결과는 `docs/DESIGN-NOTES.md`에 기록한다.

1. Mac 잠금 해제 후 열어 둔 Google 로그인 화면에서 관리자가 직접 로그인한다. 비밀번호·OTP는 채팅이나 파일로 전달하지 않는다.
2. 기존 서비스의 `/admin?tab=visits`에서 관리자 권한·통계 조회를 확인한다. 환자 기록·회원 목록은 검증을 위해 내려받지 않는다.
3. Vercel 계정으로 보호된 Preview를 열고 Tool/Content/소개 화면과 실제 공개 콘텐츠를 검토한다. Preview Google OAuth 복귀 URL의 허용 여부도 확인해야 한다.
4. 일반회원/치료사 계정의 실제 RLS 및 스테이징 INSERT 검증은 아직 미완료다. 자동 테스트의 가짜 DB 결과를 실제 RLS 검증으로 간주하지 않는다.
5. 운영 반영은 이 검증과 사용자의 Preview 승인 이후 별도 진행한다.

브라우저가 Google 계정 입력 단계까지 도달한 것은 확인했으나 로그인 완료는 확인하지 못했다. 이후 기존 브라우저 세션을 확인하려다 Mac 잠금 때문에 중단됐다. 보호된 Preview의 실제 UI·관리자 통계가 검증 완료됐다고 표현하지 않는다.

참고: [Vercel Preview 배포 옵션](https://vercel.com/docs/cli/deploy), [CLI 검증이 보호 우회 토큰을 생성할 수 있는 동작](https://vercel.com/docs/cli/curl#how-it-works). 후자는 이번에 실행하지 않았다.

## 3차 진행: 홈·목록 디자인 Preview 배포

- 소스·빌드 데이터의 Vercel 업로드에 대한 사용자 승인 후 기존 `othub2` 프로젝트에 Preview로 배포했다.
- Preview: https://othub2-rf9gy3r4v-starlight-papas-projects.vercel.app
- 배포 상세: https://vercel.com/starlight-papas-projects/othub2/2RHcFAgtaMeXRc8Bi133nBKoYh1K
- 배포 ID: `dpl_2RHcFAgtaMeXRc8Bi133nBKoYh1K`, 상태 `READY`, 운영 도메인 별칭 없음.
- 소스 커밋: `ac47960` (`Refresh home and catalogs with instant accessible filtering`). GitHub push/PR/merge는 실행하지 않았다.
- 홈·훈련 도구·콘텐츠 목록 디자인과 즉시 검색/필터를 포함한다. 상세 범위는 `docs/DESIGN-NOTES.md`를 참고한다.
- 빌드·실행 환경 모두 `OTHUB_PREVIEW_ALLOW_WRITES=false`로 배포했다. 기존 애플리케이션의 Preview 데이터 변경 차단을 유지한다.
- Vercel의 프로덕션 빌드와 타입 검사가 완료됐다. 실제 Preview UI, Google 로그인, 관리자 권한 및 RLS 검증은 사용자 요청대로 보류한다.
- 배포 후 API 조회에서 기존 보호 설정 `all_except_custom_domains`와 운영 배포 `dpl_4VR63rjLBbWHjbVsXb44g8tYsi7d` / 소스 `fc0a57c105b55fe9f858da394e47c1da9d3c0d02`가 유지됨을 확인했다. 보호 우회 토큰은 생성하지 않았다.

## 4차 진행: 사용자 검증 완료 확인 및 상세·My Hub 개선

- 사용자가 대화에서 “검증 완료. 다음작업진행”으로 기존 검증 완료를 확인했다. 앞의 보류 기록은 당시 이력으로 보존하며 동일한 로그인 절차를 다시 요구하지 않는다.
- 항목별 측정값·DB 정책 결과는 별도로 전달받지 않았으므로 에이전트가 직접 OAuth/RLS·운영 성능을 재검증한 것으로 기록하지 않는다.
- 다음 디자인 범위인 도구 상세(`/hub/apps/[slug]`)와 My Hub(`/me`)를 개선했다. UI 변경 외 인증·서버 액션·DB 스키마·평가 저장 방식·Preview 쓰기 차단은 유지한다.
- 이 단계의 코드 변경은 로컬 작업이다. 앞의 3차 Preview는 홈·목록 디자인 배포본이며, 새 상세·My Hub 변경이 포함됐다고 간주하지 않는다. 운영 승격·GitHub push는 실행하지 않았다.
