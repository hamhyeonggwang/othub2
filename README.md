# OTHub

작업치료 훈련 도구, 콘텐츠, 임상 평가를 제공하는 Next.js 서비스입니다.

- 운영: https://othub.kr (www 도메인으로 이동)
- 운영 소스: `hamhyeonggwang/othub2`
- 스택: Next.js App Router · React · Supabase Auth/Postgres · Vercel
- [공개 SaaS 개선 및 운영 절차](docs/SAAS-OPERATIONS.md)
- [변경 기록](CHANGELOG.md)

## 개발

Node.js 22와 npm을 사용합니다. Supabase 공개 연결 정보는 로컬 `.env.local`에 설정하고 커밋하지 않습니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_KEY
```

```sh
npm ci
npm run dev
```

사이트는 `http://localhost:3000`에서 실행됩니다. Google 로그인은 기존 Supabase OAuth 설정 및 허용된 콜백 주소가 필요합니다. 서비스 역할 키를 프런트엔드에 넣지 않습니다.

## 검증

```sh
npm test
npm run typecheck
npm run build
```

실제 계정이나 운영 데이터 없이 실행하는 브라우저 검증 방법은 [운영 문서](docs/SAAS-OPERATIONS.md#로컬-검증)에 있습니다. PR 검증 워크플로도 같은 로컬 가짜 DB를 사용합니다.

## 구조

- `app/(hub)`: 공통 내비게이션과 홈페이지·도구·콘텐츠·관리자 화면
- `app/api`: 평가 저장 및 방문 수집 API
- `components`: 공유 UI
- `lib/supabase`: 기존 인증, 콘텐츠, 관리자 데이터 접근
- `public/apps`, `public/assess`: 기존 독립 실행 도구
- `docs`: 설계 및 운영 기록

관리자 권한은 이메일 문자열이 아니라 기존 프로필의 역할과 서버/RLS로 검증합니다. 평가 도구와 계정·운영 DB를 새로운 정적 사이트로 교체하지 않습니다.
