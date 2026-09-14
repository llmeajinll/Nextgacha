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
- `pnpm lint` — `next lint`
- `pnpm typecheck` — `tsc --noEmit`

There is no `test` script. Jest is a dependency and two spec files exist
(`src/__tests__/shared.test.ts`, `src/__tests__/components.test.tsx`), but `jest.config.ts` and
`jest.setup.ts` are entirely commented out and `@testing-library/react`/`jest-dom` are not in
`package.json`. Treat the test suite as **not currently runnable** — if asked to add or fix tests,
you'll need to restore jest config and add the missing testing-library deps first.

## Architecture (Feature-Sliced Design)

```
src/
├── app/              # Next.js App Router: routes, API routes, root layout
├── views/            # Page-level composition (HomePage, DetailPage, SearchPage, NoticeDetailPage)
├── widgets/          # Large independent UI sections (Header, Footer, CartTemplate, OrderTemplate, ManagerMenu, ...)
├── features/         # User actions: cart, purchase, auth, search, address, qna, review-write, order-manage, product-manage
├── entities/         # Domain objects: product, order, user, review, qna, notice — each with api/model/ui(/lib)
├── shared/           # Framework-agnostic reusable code: api (mongodb client, baseUrl, QueryProviders), lib, hooks, ui, model
├── mocks/            # MSW handlers for mocking API routes in dev/tests
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
  (adds the `signIn` callback that creates a `userColl` doc + grants starting points on first
  Kakao login).
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
  - Also fires a fire-and-forget POST to `/api/track` for page-view analytics on non-static,
    non-API routes.
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
  user's cart) → call TossPayments confirm → on `DONE`, run
  `reducePoint` → `reduceStock` → `addOrder` → `resetCart` inside one
  `mongodbClient.startSession().withTransaction(...)` (all in
  `src/features/purchase/lib/`), so a failure at any step rolls back the whole order. Follow this
  pattern for any new flow that must debit points/stock and record an order atomically.
- Cart has two layers by design (not a bug to "fix"): Jotai in-memory atoms for in-progress
  quantity selection on a product detail page, vs. a `cartColl` document in MongoDB for the
  persisted cart (written on "add to cart"). The 5-per-user cap is enforced three times: client
  hook (immediate UX), the cart/purchase API routes, and again during payment confirmation.

### MSW

`src/mocks/` (handlers, browser + node setup, `MSWComponent.tsx`) mocks API routes for local
dev/testing; `package.json`'s `msw.workerDirectory` points at `public`.

## Path alias

`@/*` → `src/*` (see `tsconfig.json`).
