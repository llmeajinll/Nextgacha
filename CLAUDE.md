# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 안내서다.

## 프로젝트

Next.js 16(App Router) 쇼핑몰 "Next Gacha". 핵심 비즈니스 규칙: 한 사용자는 같은 상품을
최대 5개까지만 보유할 수 있다(장바구니 + 배송 중 합산). 상품/비즈니스 배경은 README.md 참고.
도메인 규칙은 정확하지만 **아키텍처 설명은 오래됐다**: 아직 Atomic Design 구조
(`atoms/molecules/organisms`)를 설명하는데, 이는 FSD(Feature-Sliced Design) 재구성으로 완전히
대체됐다(git log `4cacb0d`..`2a3d26a`). README의 "아키텍처" 섹션이 아니라 아래 구조를 따른다.

## 명령어

- `pnpm dev` — 개발 서버 (turbopack이 아니라 webpack, 스크립트에 `--webpack` 명시)
- `pnpm build` / `pnpm start` — 프로덕션 빌드 / 실행
- `pnpm lint` — `eslint .` (flat config, `eslint-config-next` 16; `next lint`는 더 이상 없음)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — Node 내장 러너(`node --test --experimental-strip-types`)로 `src/**/*.test.ts` 실행.
  Jest 없음. 테스트는 순수 로직만 다룬다. 옆 파일은 상대 경로 + `.ts` 확장자를 붙여 import한다
  (plain Node에서는 `@/` 별칭이 안 풀린다).
- `pnpm storybook` / `pnpm build-storybook` — Storybook 10 (`@storybook/nextjs-vite`). 스토리는
  컴포넌트 옆에 두지 **않고** 루트 `stories/`에 `src` 레이어 경로를 그대로 따라 둔다
  (`src/shared/ui/ImgBtn` → `stories/shared/ui/ImgBtn.stories.tsx`, title `shared/ImgBtn`).
  컴포넌트는 `@/`로 import한다. `.storybook/main.ts`가 vanilla-extract Vite 플러그인과 `@` 별칭을
  직접 추가한다(`*.css.ts` 컴파일러는 tsconfig paths를 읽지 않는다).

## 아키텍처 (Feature-Sliced Design)

```
src/
├── app/              # Next.js App Router: 라우트, API 라우트, 루트 layout
├── views/            # 페이지 단위 조합 (HomePage, DetailPage, SearchPage, NoticeDetailPage)
├── widgets/          # 독립적인 큰 UI 영역 (Header, Footer, CartTemplate, OrderTemplate, ManagerMenu, ...)
├── features/         # 사용자 행동: cart, purchase, auth, search, address, qna, review-write, order-manage, product-manage
├── entities/         # 도메인 객체: product, order, user, review, qna, notice — 각각 api/model/ui(/lib)
├── shared/           # 프레임워크 독립 재사용 코드: api (mongodb client, baseUrl, QueryProviders), lib, hooks, ui, model
└── styles/           # 전역 theme / vanilla-extract variants
```

import 방향은 FSD를 따른다: `app → views → widgets → features → entities → shared`. 각 레이어는
자기 자신이나 아래 레이어만 import한다(커밋 `6e5c8ce`가 이 위반을 고쳤다 — entity가 feature를
import하는 식의 위쪽 import를 되살리지 말 것).

entity/feature slice 내부 규칙: `api/`(내부 API 라우트를 호출하는 fetch 함수), `model/`(타입,
jotai atom/store), `ui/`(컴포넌트 + 옆에 둔 `*.css.ts`), 필요하면 `lib/`(순수 로직).
`src/app/api/*/route.ts` 핸들러는 `@/shared/api/mongodb`로 MongoDB를 직접 조회하고,
`entities/*/api`와 `features/*/api`는 그 라우트를 호출하는 클라이언트 fetcher다 — "엔드포인트
추가" 요청은 양쪽을 다 건드린다.

경로별 규칙은 `.claude/rules/`에 있고, 해당 파일을 작업할 때 로드된다:
`fsd.md`(레이어 규칙, `src/**`), `styling.md`(Vanilla Extract, theme 토큰, `*.tsx`/`*.css.ts`),
`api-routes.md`(라우트 등록, 신뢰할 수 없는 입력, 시크릿/로그; `src/app/api/**`, `src/proxy.ts`,
`features|entities/*/lib/**`).
`fsd-guard` 서브에이전트(`.claude/agents/`)가 변경분을 `fsd.md` 기준으로 검사한다.

### 인증 & 접근 제어

- NextAuth v5(beta), Kakao OAuth만 사용. 기본 설정은 `src/auth.config.ts`
  (`authorized` 콜백이 `/api/protected/*`와 `/mypage/*`를 막음), 인스턴스는 `src/auth.ts`
  (첫 Kakao 로그인 때 `userColl` 문서를 만드는 `signIn` 콜백 추가; 시작 포인트 0).
  **Kakao가 이메일을 주지 않으면 로그인을 거부한다** — 모든 컬렉션이 이메일로 사용자를 구분하므로,
  이메일이 없으면 여러 사용자가 `email: null` 문서 하나로 합쳐진다.
- `src/proxy.ts`가 실제 middleware 진입점(`matcher`로 연결)이고, NextAuth `authorized` 콜백 위에
  다음을 더한다:
  - `/api/protected/*` → 미로그인 시 401.
  - 고정된 `ADMIN_API_PATHS` 목록(postEditProduct, postEvent, postProduct,
    postCheckToSending, postSendingToFinish, getOrderSort, getError) → `isAdminEmail(email)`이
    아니면 403 (`ADMIN_EMAILS` 환경변수와 비교, `src/shared/lib/isAdmin.ts` 참고).
  - `/manager/*` 페이지 → 관리자가 아니면 `/`로 리다이렉트. 단 `/manager`와
    `/manager/statistics`는 공개.
  - `/mypage/*` → 미로그인 시 `/signin`으로 리다이렉트.
  - 정적 파일·API가 아닌 라우트는 `/api/track`에 페이지 뷰를 POST한다(요청과 같은 origin,
    `event.waitUntil`로 유지). `<Link>` prefetch는 건너뛰고 `_rsc`는 제거한다.

### 데이터 레이어

- `src/shared/api/mongodb.ts`는 모듈 로드 시점(top-level `await`)에 `MongoClient` 하나를 열고
  컬렉션마다 handle을 export한다(`productColl`, `cartColl`, `orderColl`, `userColl`,
  `reviewColl`, `qnaColl`, `errorColl`, `counterColl`, `pageViewsColl`). `gachaDB`에 직접
  접근하지 말고 필요한 컬렉션을 import한다.
- 결제 승인(`src/app/api/postPaymentsConfirm/route.ts`)이 가장 중요한 트랜잭션 경로다:
  재고 재검증(`validateStock`, 구매 불가가 된 상품을 장바구니에서 정리도 함) → `verifyOrder`
  (금액/포인트/한도를 DB 기준으로 다시 계산; **클라이언트의 `amount`/`usedPoint`/가격은 절대 믿지
  않는다** — `addPoint`도 서버에서 계산) → TossPayments 승인 호출 → `DONE`이면
  `reducePoint` → `reduceStock` → `addOrder` → `resetCart`를 하나의
  `mongodbClient.startSession().withTransaction(...)` 안에서 실행(모두 `src/features/purchase/lib/`).
  각 단계는 실패 시 **throw**한다(catch해서 `{ok:false}`를 반환하면 일부만 처리된 주문이 조용히
  커밋된다). 트랜잭션이 실패하면 라우트가 Toss 결제를 취소하고, 취소마저 실패하면 `errorColl`에
  기록한다. 가격/배송비/포인트/한도 규칙은 순수 함수 `orderPolicy.ts`에 있으며
  (자체 검사: `node --experimental-strip-types src/features/purchase/lib/orderPolicy.check.ts`)
  `CartTemplate`/`InfoPanel`과 항상 맞춰야 한다.
- 서버 컴포넌트는 이 앱의 `/api/*` 라우트를 `fetch`하면 **안 된다**: 요청에 세션 쿠키가 없어서
  middleware가 protected/admin 라우트에 401/403을 돌려준다. 조회 로직은 공용 서버 함수
  (예: `features/order-manage/lib/findOrdersByStatus.ts`)로 만들어 라우트 핸들러와 페이지가 함께
  쓴다. 클라이언트 코드는 `/api/...`를 상대 URL로 호출한다(`baseUrl`은 프로덕션 도메인이라
  sitemap/robots 같은 절대 URL에만 쓴다).
- `withTransaction(...)` 콜백 안에서는 다시 throw하지 않는 `.catch()`/`try-catch`를 절대 쓰지
  않는다: 드라이버가 트랜잭션 중단을 알 수 없어 무한 재시도할 수 있다. 단일 문서 쓰기나 외부 호출
  (Blob 업로드, Toss)은 애초에 트랜잭션으로 감싸지 않는다.
- 주문 상태 전환(`상품 확인중` → `배송중` → `배송 완료`, 또는 `상품 확인중` → `환불`)은 update에
  `status` 필터를 걸어서 더블클릭/재시도가 아무 일도 하지 않게 한다. 배송 완료
  (`postSendingToFinish`)와 환불(`postCheckToSending` `send: 'refund'`)은 email/list/points를
  **요청 body가 아니라 주문 문서에서** 읽고, 트랜잭션 안에서 `subtractKeep`으로 `user.keep`을
  조정한다. 환불은 Toss 결제를 먼저 취소하고(`orderId`로 조회), 그다음 재고/keep/`usedPoint`를
  되돌린다.
- 장바구니가 두 층인 건 의도된 설계다(고칠 버그 아님): 상품 상세에서 수량을 고르는 중에는 Jotai
  메모리 atom, 확정된 장바구니는 MongoDB `cartColl` 문서("장바구니 담기" 때 저장). 1인 5개 한도는
  세 번 검사한다: 클라이언트 hook(즉각 UX), 장바구니 API(`postCart`/`updateCart`의
  `checkCartLimit`), 결제 승인 시 다시(`verifyOrder`, 이어서 `reducePoint`에서 원자적으로).

## 경로 별칭

`@/*` → `src/*` (`tsconfig.json` 참고).
