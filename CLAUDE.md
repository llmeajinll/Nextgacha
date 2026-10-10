# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js 16 (App Router) shopping mall ("Next Gacha") with a hard business rule: each user may
hold at most 5 units of the same product (cart + in-transit combined). See README.md for the
product/business background — it's accurate on domain rules but **stale on architecture**: it
still describes an Atomic Design component tree (`atoms/molecules/organisms`), which was fully
replaced by a Feature-Sliced Design (FSD) restructure (see git log `4cacb0d`..`2a3d26a`). Trust
the structure below, not the README's "아키텍처" section.

## Commands

- `pnpm dev` — dev server (webpack, not turbopack — `--webpack` is explicit in the script)
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — `eslint .` (flat config, `eslint-config-next` 16; `next lint` no longer exists)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — Node's built-in runner (`node --test --experimental-strip-types`) over
  `src/**/*.test.ts`. No Jest. Tests cover pure logic only; import siblings with an explicit
  `.ts` extension and relative paths (the `@/` alias doesn't resolve under plain Node).

## Architecture (Feature-Sliced Design)

```
src/
├── app/              # Next.js App Router: routes, API routes, root layout
├── views/            # Page-level composition (HomePage, DetailPage, SearchPage, NoticeDetailPage)
├── widgets/          # Large independent UI sections (Header, Footer, CartTemplate, OrderTemplate, ManagerMenu, ...)
├── features/         # User actions: cart, purchase, auth, search, address, qna, review-write, order-manage, product-manage
├── entities/         # Domain objects: product, order, user, review, qna, notice — each with api/model/ui(/lib)
├── shared/           # Framework-agnostic reusable code: api (mongodb client, baseUrl, QueryProviders), lib, hooks, ui, model
└── styles/           # Global theme / vanilla-extract variants
```

Import layering follows FSD: `app → views → widgets → features → entities → shared`. A layer
should only import from itself or layers below it (commit `6e5c8ce` fixed a violation of this —
don't reintroduce upward imports, e.g. an entity importing from a feature).

Within each entity/feature slice, the convention is `api/` (fetch functions calling internal API
routes), `model/` (types, jotai atoms/store), `ui/` (components + colocated `*.css.ts`), and
sometimes `lib/` (pure logic). `src/app/api/*/route.ts` handlers talk to MongoDB directly via
`@/shared/api/mongodb`; `entities/*/api` and `features/*/api` are the client-side fetchers that
call those routes — a request to "add an endpoint" touches both sides.

### Styling

Vanilla Extract (`*.css.ts`, compile-time, colocated next to the component it styles) is the
standard across the whole app after the `refactor: inline style -> css.ts 전환` migration series
(commits `8e85773`..`f1e8ca5`). Don't add inline `style={}` or a CSS-in-JS runtime library for new
components — follow the existing `Component.tsx` + `component.css.ts` pairing.

### Auth & access control

- NextAuth v5 (beta) with Kakao OAuth only. Base config in `src/auth.config.ts`
  (`authorized` callback gates `/api/protected/*` and `/mypage/*`), instantiated in `src/auth.ts`
  (adds the `signIn` callback that creates a `userColl` doc on first Kakao login; starting
  points are 0). Login is **refused if Kakao returns no email** — every collection keys users by
  email, so a missing email would merge users into one `email: null` doc.
- `src/proxy.ts` is the actual middleware entry (mapped via `matcher`) and layers on top of the
  NextAuth `authorized` callback:
  - `/api/protected/*` → 401 if not logged in.
  - A fixed `ADMIN_API_PATHS` list (postEditProduct, postEvent, postProduct,
    postCheckToSending, postSendingToFinish, getOrderSort, getError) → 403 unless
    `isAdminEmail(email)` (checked against the `ADMIN_EMAILS` env var, see
    `src/shared/lib/isAdmin.ts`).
  - `/manager/*` pages → redirect non-admins to `/`, except `/manager` itself and
    `/manager/statistics` which are public.
  - `/mypage/*` → redirect to `/signin` if not logged in.
  - Also POSTs a page view to `/api/track` (same origin as the request, kept alive with
    `event.waitUntil`) for non-static, non-API routes, skipping `<Link>` prefetches and
    stripping `_rsc`.
  - When adding a new admin-only or protected API route, register it in both `ADMIN_API_PATHS`/the
    relevant `if` block **and** the `matcher` array — the matcher decides whether the middleware
    even runs for that path.

### Data layer

- `src/shared/api/mongodb.ts` opens a single `MongoClient` at module load (top-level `await`) and
  exports one collection handle per collection (`productColl`, `cartColl`, `orderColl`,
  `userColl`, `reviewColl`, `qnaColl`, `errorColl`, `counterColl`, `pageViewsColl`). Import the
  specific collection you need rather than reaching into `gachaDB` directly.
- Payment confirmation (`src/app/api/postPaymentsConfirm/route.ts`) is the critical transactional
  path: re-validate stock (`validateStock`, which also prunes now-unavailable items from the
  user's cart) → `verifyOrder` (recomputes amount/points/cap from DB; **never trust client
  `amount`/`usedPoint`/prices** — `addPoint` is computed server-side) → call TossPayments confirm →
  on `DONE`, run `reducePoint` → `reduceStock` → `addOrder` → `resetCart` inside one
  `mongodbClient.startSession().withTransaction(...)` (all in `src/features/purchase/lib/`). Each
  step **throws** on failure (don't catch-and-return `{ok:false}` — that silently commits a
  partial order); if the transaction fails the route cancels the Toss payment, and logs to
  `errorColl` if the cancel itself fails. Pricing/shipping/point/cap rules live in the pure
  `orderPolicy.ts` (self-check: `node --experimental-strip-types src/features/purchase/lib/orderPolicy.check.ts`)
  and must stay in sync with `CartTemplate`/`InfoPanel`.
- Server components must **not** `fetch` this app's own `/api/*` routes: the request carries no
  session cookie, so the middleware returns 401/403 for protected/admin routes. Put the query in a
  shared server function (e.g. `features/order-manage/lib/findOrdersByStatus.ts`) used by both the
  route handler and the page. Client code calls `/api/...` with a relative URL (never `baseUrl`,
  which is the production domain and only for absolute URLs like sitemap/robots).
- Inside any `withTransaction(...)` callback, never `.catch()`/`try-catch` without rethrowing:
  the driver can't tell the transaction aborted and may retry it indefinitely. Don't wrap a
  single-document write or an external call (Blob upload, Toss) in a transaction at all.
- Order status transitions (`상품 확인중` → `배송중` → `배송 완료`, or `상품 확인중` → `환불`) are
  guarded by a `status` filter on the update so double-clicks/retries are no-ops. Finish
  (`postSendingToFinish`) and refund (`postCheckToSending` `send: 'refund'`) read
  email/list/points from the **order document, not the request body**, and adjust `user.keep`
  via `subtractKeep` inside a transaction. Refund cancels the Toss payment first (looked up by
  `orderId`), then restores stock/keep/`usedPoint`.
- Public read APIs (`getQna`, `getReview`) must not return raw emails — use
  `shared/lib/maskEmail`; QnA uses a server-computed `isMine` flag and blanks secret posts.
- Cart has two layers by design (not a bug to "fix"): Jotai in-memory atoms for in-progress
  quantity selection on a product detail page, vs. a `cartColl` document in MongoDB for the
  persisted cart (written on "add to cart"). The 5-per-user cap is enforced three times: client
  hook (immediate UX), the cart API routes (`checkCartLimit` in `postCart`/`updateCart`), and
  again during payment confirmation (`verifyOrder`, then atomically in `reducePoint`).

## Path alias

`@/*` → `src/*` (see `tsconfig.json`).
