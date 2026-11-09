# 서버·배포 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고. DB 환경 분리는 [data.md](./data.md), 에러 응답은 [api.md](./api.md) 참고.

## 서버

### Node 버전 고정
- 상태: 제안
- 정책: Node 버전은 `package.json`의 `engines.node` 한 곳에 적는다. Vercel은 이 값을 읽고, CI는 `actions/setup-node`의 `node-version-file: package.json`으로 같은 값을 쓴다. `@types/node`도 같은 메이저로 맞춘다.
- 추천값: `24.x` (Vercel 현재 기본값. Node 20은 2026-10-01부터 Vercel에서 deprecated)
- 이유: 지금은 CI가 Node 22, `@types/node`가 20, Vercel은 프로젝트 설정값이라 세 곳이 다를 수 있다. CI에서 통과한 코드가 운영 런타임에서 다르게 동작할 수 있다.
- 코드: `.github/workflows/ci.yml:17`, `package.json` (`engines` 없음, `@types/node: ^20`)
- 변경 이력: 2026-11-09 신설

### 서버 전용 코드 경계
- 상태: 제안
- 정책: DB·시크릿을 쓰는 모듈은 첫 줄에 `import 'server-only'`를 둔다. 클라이언트 컴포넌트가 import하면 빌드가 실패한다(Next.js가 기본 지원, 별도 설치 불필요).
- 대상: `src/shared/api/mongodb.ts`, `src/features/purchase/lib/toss.ts`, 그 외 `lib/`의 서버 함수(`findOrdersByStatus`, `findProducts`, `findUserInfo`)
- 이유: 지금은 규칙(`.claude/rules/api-routes.md`)과 리뷰로만 막는다. `'use client'` 파일에서 실수로 import해도 경고가 없다.
- 변경 이력: 2026-11-09 신설

### 외부 호출 타임아웃
- 상태: 미정
- 정책: 외부 API(Toss 등) 호출에는 모두 타임아웃을 건다. 값과 타임아웃 후 처리는 [Toss 요청 타임아웃](./payments.md)에서 정한다.
- 변경 이력: 2026-11-09 신설

## 배포 파이프라인

### 배포 게이트
- 상태: 제안
- 정책: CI(`lint`, `typecheck`, `test`)가 실패한 커밋은 운영에 반영되지 않게 한다.
- 선택지:
  - A. Vercel 프로젝트 설정의 Deployment Checks에 GitHub Actions `check` job을 등록한다. 체크가 통과해야 운영 도메인이 새 배포로 바뀐다 (추천). 지금처럼 main에 바로 push하는 흐름을 바꾸지 않아도 된다. 설정 위치는 적용할 때 Vercel 문서로 확인한다.
  - B. main 브랜치 보호 + PR 필수. 가장 확실하지만 1인 개발에서는 모든 변경에 PR이 필요해서 번거롭다.
- 이유: 지금은 main에 push하면 Vercel 운영 배포와 CI가 따로 돈다. CI가 빨간불이어도 운영 배포는 그대로 나간다.
- 코드: `.github/workflows/ci.yml`
- 변경 이력: 2026-11-09 신설

### 브랜치와 미리보기
- 상태: 제안
- 정책: 기본은 main에 바로 push한다. 단, 돈·재고·포인트·주문 상태를 바꾸는 변경과 DB 스키마 변경은 브랜치를 만들어 Preview 배포(`gacha_dev`, Toss test 키)에서 결제·환불을 한 번 해 본 뒤 merge한다.
- 이유: 지금은 133개 커밋이 모두 main 직행이라, 결제 흐름을 바꿔도 운영에서 처음 실행된다. 이 위험한 변경에만 절차를 둔다.
- 관련: [환경 간 공유 자원](./data.md) — Preview가 운영 Blob을 쓰지 않게 먼저 분리해야 안전하다.
- 변경 이력: 2026-11-09 신설

### CI 범위
- 상태: 제안
- 정책: CI는 지금처럼 `lint`, `typecheck`, `test`만 돌린다. 빌드 확인은 Vercel 빌드에 맡긴다. 의존성 취약점은 GitHub Dependabot security alerts(설정만 켜면 됨)로 받는다.
- 이유: `pnpm build`를 CI에 넣으면, 빌드 중 MongoDB에 접속하는 코드(`mongodb.ts` 최상위 `await connect`, sitemap·홈 SSR) 때문에 CI에 DB 접속 정보가 필요해진다. Vercel이 이미 같은 빌드를 하므로 중복이다. `pnpm audit`을 CI에 넣으면 관계없는 취약점 공지 때문에 CI가 실패하기 쉽다.
- 변경 이력: 2026-11-09 신설

### 배포 확인과 롤백
- 상태: 제안
- 정책:
  - push 후 운영 배포가 `Ready`가 됐는지 확인한다 (`vercel ls --prod` 또는 대시보드).
  - 문제가 생기면 Vercel Instant Rollback으로 이전 배포로 되돌린다.
  - 롤백해도 DB는 되돌아가지 않는다. 그래서 필드 이름 변경·삭제는 "새 필드 추가 → 코드 전환 배포 → 옛 필드 정리" 순서로 나눠서, 바로 이전 코드도 새 데이터를 읽을 수 있게 한다 ([스키마와 마이그레이션](./data.md)).
- 이유: 2026-10-10에 운영 배포가 `git_info_fail`(Vercel↔GitHub 연동 오류)로 실패했는데 알아채지 못했고, 운영은 26일 전 배포에 머물러 있었다.
- 변경 이력: 2026-11-09 신설

### 빌드 캐시 비활성화
- 상태: 미정
- 정책: 미정. `vercel.json`의 `NEXT_PRIVATE_SKIP_CACHE=1`과 Vercel 환경변수 `VERCEL_FORCE_NO_CACHE`가 빌드 캐시를 끄고 있다. 이유를 확인하고, 필요 없으면 지워서 빌드 시간을 줄인다.
- 결정할 것: 캐시를 끈 원래 이유 (vanilla-extract 스타일이 갱신되지 않던 문제 등)가 아직 재현되는지
- 이유: 이유가 기록되어 있지 않아서, 지울 수도 남길 수도 없는 상태다.
- 코드: `vercel.json:4`
- 변경 이력: 2026-11-09 신설

## 환경변수

### 환경변수 관리
- 상태: 제안
- 정책:
  - 변수 목록과 용도(값 제외)를 레포의 `.env.example`에 적는다. 새 변수를 추가하면 여기와 Vercel 세 환경에 같이 넣는다.
  - 환경마다 값이 달라야 하는 변수: `MONGODB_DB`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_VERCEL_IMAGE_URL`, Toss 키 두 개 ([환경 간 공유 자원](./data.md)).
  - 시크릿은 Vercel에서 `sensitive` 타입으로 둔다.
  - 코드에서 안 쓰는 변수는 지운다.
- 이유: Vercel에 지금 안 쓰는 변수가 남아 있다. 이전 시크릿 이름인 `NEXT_PUBLIC_TOSSPAYMENTS_SECRET_KEY`는 `NEXT_PUBLIC_`이 붙은 시크릿이라, 코드가 다시 참조하는 순간 브라우저 번들에 들어간다. 그 외 미사용: `NEXT_PUBLIC_TOSSPAYMENTS_SECURITY_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_URL`, `DATA_API_KEY`, `DATA_API_URL`, `AUTH_SECERT`(오타). 또 `MONGODB_URI`, `KAKAO_*`, `NEXTAUTH_SECRET`이 `encrypted`라서 대시보드 권한만 있으면 값을 볼 수 있다.
- 코드: 레포에 `.env.example` 없음
- 변경 이력: 2026-11-09 신설
