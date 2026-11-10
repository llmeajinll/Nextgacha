# 배포·릴리스 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 배포 환경
- 상태: 확정
- 정책: Vercel 프로젝트 `nextgacha`. `main`에 push하면 Production(https://nextgacha.vercel.app), PR 브랜치는 Preview로 배포된다. Production은 DB `gacha`, Preview·로컬은 `MONGODB_DB=gacha_dev`를 쓴다(같은 Atlas 클러스터).
- 결정할 것: Preview의 `TOSS_SECRET_KEY`가 Toss **테스트 키**인지 확인. 라이브 키라면 Preview에서 테스트 결제를 해도 실제 결제가 된다.
- 코드: `src/shared/api/mongodb.ts`, `src/shared/api/baseUrl.ts`, `vercel.json`
- 변경 이력: 2026-11-10 신설

## 브랜치 전략
- 상태: 확정
- 정책: `main`에 바로 push해도 된다. PR은 원할 때만 쓴다.
- 이유: 1인 프로젝트라 매번 PR을 거치는 비용이 크다.
- 참고: `main` push는 곧 Production 배포다. CI(`ci.yml`)는 push 후에 돌기 때문에 실패해도 배포는 이미 나간 뒤다. Claude 리뷰(`claude-review.yml`)는 PR에서만 돈다. 결제·주문·포인트 코드는 PR로 올리는 것을 추천한다.
- 코드: `main` 브랜치 보호 없음 (GitHub 설정)
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (main 직접 push, PR은 선택)

## PR 머지 조건
- 상태: 확정
- 정책: PR을 쓸 때는 아래를 확인하고 머지한다. GitHub branch protection으로 강제하지는 않는다.
  - CI 통과: lint, typecheck, test (`.github/workflows/ci.yml`)
  - Vercel Preview 빌드 성공 (CI에는 `next build`가 없어서 Preview가 빌드 확인을 대신함)
  - Claude 리뷰의 `[높음]` 지적 해결 또는 반박 코멘트 (`.github/workflows/claude-review.yml`)
  - 결제·주문·포인트 코드를 바꿨다면 Preview에서 테스트 결제 1회 ([배포 환경](#배포-환경)의 테스트 키 확인 후)
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (강제하지 않음)

## CI 범위
- 상태: 확정
- 정책: CI는 `lint`, `typecheck`, `test`만 돌린다. 빌드 확인은 Vercel Preview 빌드에 맡긴다([PR 머지 조건](#pr-머지-조건)). 의존성 취약점은 GitHub Dependabot security alerts(설정만 켜면 됨)로 받는다.
- 이유: `pnpm build`를 CI에 넣으면, 빌드 중 MongoDB에 접속하는 코드(`mongodb.ts` 최상위 `await connect`, sitemap·홈 SSR) 때문에 CI에 DB 접속 정보가 필요해진다. Vercel이 이미 같은 빌드를 하므로 중복이다. `pnpm audit`을 CI에 넣으면 관계없는 취약점 공지 때문에 CI가 실패하기 쉽다.
- 변경 이력: 2026-11-09 신설(`infra.md`), 2026-11-10 확정, `deploy.md`로 이동

## 환경변수 변경
- 상태: 확정
- 정책:
  - 새 변수는 Production·Preview 둘 다 등록하고, 로컬 `.env.local`도 같이 맞춘다.
  - 이름을 바꿀 때는 새 이름 추가 → 새 이름을 읽는 코드 배포 → 옛 이름 삭제 순서로 한다. 한 번에 바꾸면 배포 사이에 값이 비는 구간이 생긴다.
  - 서버 전용 값에는 `NEXT_PUBLIC_`을 붙이지 않는다 (`.claude/rules/api-routes.md`).
  - 변수 목록과 용도(값 제외)를 레포의 `.env.example`에 적는다.
  - 환경마다 값이 달라야 하는 변수: `MONGODB_DB`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_VERCEL_IMAGE_URL`, Toss 키 두 개 ([환경 간 공유 자원](./data.md#환경-간-공유-자원-blob결제-키)).
  - 시크릿은 Vercel에서 `sensitive` 타입으로 두고, 코드에서 안 쓰는 변수는 지운다.
- 이유: `TOSS_SECRET_KEY` 이름 변경 때 이 순서로 진행했다. 옛 이름 `NEXT_PUBLIC_TOSSPAYMENTS_SECRET_KEY`는 아직 Vercel에 남아 있고, `NEXT_PUBLIC_`이 붙은 시크릿이라 코드가 다시 참조하는 순간 브라우저 번들에 들어간다. 그 외 미사용: `NEXT_PUBLIC_TOSSPAYMENTS_SECURITY_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_URL`, `DATA_API_KEY`, `DATA_API_URL`, `AUTH_SECERT`(오타). `MONGODB_URI`, `KAKAO_*`, `NEXTAUTH_SECRET`은 `encrypted`라 대시보드에서 값이 보인다.
- 코드: 레포에 `.env.example` 없음
- 변경 이력: 2026-11-10 신설, 2026-11-10 확정 (`infra.md` 환경변수 관리 병합)

## DB 변경이 있는 배포
- 상태: 확정
- 정책: 스키마나 데이터 형식이 바뀌면 "확장 → 이전 → 정리" 순서로 나눠 배포한다.
  1. 새 필드/형식을 읽고 쓸 수 있는 코드 배포 (옛 형식도 읽을 수 있게)
  2. 기존 데이터 마이그레이션
  3. 옛 형식을 읽는 코드 제거
- 이유: 코드는 Vercel에서 되돌릴 수 있지만 DB는 되돌릴 수 없다. 한 번에 바꾸면 롤백한 코드가 새 형식 데이터를 못 읽는다. 마이그레이션 방식은 [데이터 정책](./data.md)의 "스키마와 마이그레이션"을 따른다.
- 변경 이력: 2026-11-10 신설, 2026-11-10 확정

## 롤백
- 상태: 확정
- 정책:
  - 머지 후 Production 배포가 `Ready`가 됐는지 확인한다 (`vercel ls --prod` 또는 대시보드).
  - 배포 후 문제가 생기면 원인을 찾기 전에 먼저 Vercel에서 직전 Production 배포로 되돌린다(대시보드 Instant Rollback 또는 `vercel rollback`). 고친 코드는 그다음 PR로 다시 배포한다.
- 예외: DB 변경이 같이 나간 배포는 [DB 변경이 있는 배포](#db-변경이-있는-배포) 순서를 지켰는지 먼저 확인한다.
- 이유: 2026-10-10에 Production 배포가 `git_info_fail`(Vercel↔GitHub 연동 오류)로 실패했는데 알아채지 못했고, 운영은 26일 전 배포에 머물러 있었다.
- 변경 이력: 2026-11-10 신설, 2026-11-10 확정

## 배포 금지 시간
- 상태: 확정
- 정책: 주문이 몰리는 시간(매월 이벤트 초기화 Atlas Trigger, 신규 상품 오픈 매월 1일·15일) 전후에는 Production 배포를 하지 않는다.
- 결정할 것: 전후 몇 시간인지 (예: 2시간)
- 변경 이력: 2026-11-10 신설, 2026-11-11 확정 (몰리는 시간 전후 배포 금지)

## 빌드 캐시 비활성화
- 상태: 확정
- 정책: 빌드 캐시는 계속 끈다. `vercel.json`의 `NEXT_PRIVATE_SKIP_CACHE=1`과 Vercel 환경변수 `VERCEL_FORCE_NO_CACHE`를 지우지 않는다.
- 이유: 캐시를 켜면 vanilla-extract가 옛날 CSS 파일로 적용되는 문제가 있었다.
- 다시 볼 때: Next.js나 `@vanilla-extract/next-plugin`을 올린 뒤 빌드 시간이 문제가 되면, Preview에서 캐시를 켜고 스타일이 제대로 나오는지 확인한다.
- 코드: `vercel.json:4`
- 변경 이력: 2026-11-09 신설(`infra.md`), 2026-11-10 `deploy.md`로 이동, 2026-11-11 확정 (유지, 이유 기록)
