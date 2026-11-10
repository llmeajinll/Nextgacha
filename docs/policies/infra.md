# 서버 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고. DB 환경 분리는 [data.md](./data.md), 에러 응답은 [api.md](./api.md), 배포·CI·환경변수는 [deploy.md](./deploy.md) 참고.


## Node 버전 고정
- 상태: 확정
- 정책: Node 버전은 `package.json`의 `engines.node` 한 곳에 적는다. Vercel은 이 값을 읽고, CI는 `actions/setup-node`의 `node-version-file: package.json`으로 같은 값을 쓴다. `@types/node`도 같은 메이저로 맞춘다.
- 추천값: `24.x` (Vercel 현재 기본값. Node 20은 2026-10-01부터 Vercel에서 deprecated)
- 이유: 지금은 CI가 Node 22, `@types/node`가 20, Vercel은 프로젝트 설정값이라 세 곳이 다를 수 있다. CI에서 통과한 코드가 운영 런타임에서 다르게 동작할 수 있다.
- 코드: `.github/workflows/ci.yml:17`, `package.json` (`engines` 없음, `@types/node: ^20`)
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정

## 서버 전용 코드 경계
- 상태: 확정
- 정책: DB·시크릿을 쓰는 모듈은 첫 줄에 `import 'server-only'`를 둔다. 클라이언트 컴포넌트가 import하면 빌드가 실패한다(Next.js가 기본 지원, 별도 설치 불필요).
- 대상: `src/shared/api/mongodb.ts`, `src/features/purchase/lib/toss.ts`, 그 외 `lib/`의 서버 함수(`findOrdersByStatus`, `findProducts`, `findUserInfo`)
- 이유: 지금은 규칙(`.claude/rules/api-routes.md`)과 리뷰로만 막는다. `'use client'` 파일에서 실수로 import해도 경고가 없다.
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정

## 외부 호출 타임아웃
- 상태: 확정
- 정책: 외부 API 호출에는 모두 타임아웃을 건다. 기본 10초. Toss는 타임아웃 후 처리까지 [Toss 요청 타임아웃](./payments.md#toss-요청-타임아웃)을 따른다.
- 변경 이력: 2026-11-09 신설, 2026-11-10 확정
