---
paths:
  - "src/**"
---

# FSD 규칙 (Feature-Sliced Design)

## 레이어와 import 방향

`app → views → widgets → features → entities → shared` (+ `styles`는 어디서나 import 가능)

- 자기 레이어 또는 **아래** 레이어만 import한다. 위로 올라가는 import 금지
  (예: entity가 feature를, shared가 entity를 import). 커밋 `6e5c8ce`가 고친 위반을 되살리지 말 것.
- **같은 레이어의 다른 slice import 금지** (widgets ↔ widgets, features ↔ features, entities ↔ entities).
  두 slice가 같은 데이터/컴포넌트가 필요하면 아래 레이어로 내린다
  (예: ManagerSideMenu·ManagerMenu가 공유하는 메뉴 목록 → `shared/model/managerMenus.ts`).
- 아이콘은 `pixelarticons/react`를 직접 import한다 (별도 아이콘 래퍼를 만들지 않음). 클릭되는 아이콘은 `shared/ui` `ImgBtn`.
- 같은 slice 안에서는 상대 경로(`./`, `../`), slice 밖은 `@/` 별칭.
- `src/app/`은 라우팅 전용: 페이지는 views/widgets를 조합만 하고, 서버 데이터 조회는 slice의 `lib/` 서버 함수를 호출한다.
  `page.tsx` 안에 폼·테이블·상태 로직을 쓰지 않는다 — 그건 `features/*/ui`나 `widgets/`로 만들고 페이지는 import만 한다.
- 위 import 방향은 `pnpm lint`가 막는다(`eslint.config.mjs`의 `no-restricted-imports`). 규칙을 끄거나 예외를 늘려서
  통과시키지 말고 코드를 옮긴다.

## 파일 크기: 한 파일 300줄 이하

- `src/`의 모든 `.ts/.tsx/.js`(`*.css.ts` 포함)는 **300줄을 넘기지 않는다**(빈 줄·주석 제외, `max-lines` lint error).
- 넘을 것 같으면 쓰기 전에 나눈다:
  - 반복되는 JSX 블록(행, 카드, 폼 필드 묶음) → 하위 컴포넌트로 분리. 두 곳 이상 쓰이면 아래 "컴포넌트 재사용"대로 공용으로.
  - 상태·이벤트 로직 → 같은 slice의 `model/useXxx.ts` 훅
  - 계산·변환·검증 → 같은 slice의 `lib/` 순수 함수(테스트하기도 쉬워진다)
  - 큰 `*.css.ts` → 하위 컴포넌트 옆으로 스타일을 같이 옮긴다. 공용 모양은 `styles/ui.css.ts`·`variants.css.ts`를 조합한다.
- 이미 넘는 파일은 `eslint.config.mjs` 마지막 블록에 경고로 묶여 있다(부채). 건드릴 때 300줄 아래로 나누고 목록에서 지운다.
  **목록에 새 파일을 추가하지 않는다.**

## 컴포넌트 재사용

- UI를 새로 만들기 전에 `src/shared/ui/index.ts`와 해당 도메인의 `entities/*/ui`를 먼저 찾는다. 있으면 그걸 쓴다
  (`Btn`, `ImgBtn`, `DropDown`, `Pagination`, `Range`, `EmptyCard`, `StarRating`, `Title` ...).
- 조금 안 맞으면 복사해서 새로 만들지 말고 기존 컴포넌트에 prop을 추가해 넓힌다.
- 비슷한 JSX·스타일을 복사-붙여넣기해서 만들지 않는다. 복사하려는 순간이 공용 컴포넌트로 뽑을 때다.
- 같은 UI가 두 곳 이상에서 필요해지면 그 자리에서 복사하지 말고 공용으로 올린다: 도메인을 모르면 `shared/ui`,
  도메인을 알면 `entities/<도메인>/ui`.
- 외부 UI 라이브러리(`rc-pagination`, `react-slick` 등)는 페이지·위젯에서 직접 import하지 않고 `shared/ui` 래퍼로 쓴다.
  모양과 접근성을 래퍼 한 곳에서 맞추기 위해서다.
- `shared/ui`에 추가하면 `shared/ui/index.ts`에 등록하고 `stories/shared/ui/`에 스토리를 만든다
  ([design.md Storybook](../../docs/policies/design.md#storybook)).

## 두 feature를 같이 쓰는 UI

- feature 두 개를 조합해야 하면(예: 상품 상세 패널 = 옵션 고르기 `cart` + 구매·재입고 `purchase`) feature 안에 두지 않고
  `widgets/`로 올린다 (`widgets/ProductPurchasePanel`). feature끼리 import하는 예외는 없다.

## 어디에 둘까

| 레이어 | 담는 것 | 예 |
|---|---|---|
| `app/` | 라우트, `api/*/route.ts`, layout | `manager/layout.tsx` |
| `views/` | 페이지 단위 조합 | `HomePage`, `DetailPage` |
| `widgets/` | 여러 feature·entity를 조합한 큰 UI 블록 (slice당 폴더 하나) | `Header`, `CartCheckout`, `ProductReviews` |
| `features/` | 사용자 행동 (장바구니 담기, 결제, 주문 처리) | `cart`, `purchase`, `order-manage` |
| `entities/` | 도메인 객체 표시/조회 | `product`, `order`, `user` |
| `shared/` | 도메인 모르는 재사용 코드 | `api/mongodb`, `lib/koreaTime`, `ui/Btn` |

- entities/features slice 내부: `api/`(클라이언트 fetcher → 내부 `/api/*`), `model/`(타입, jotai atom), `ui/`(컴포넌트 + `*.css.ts`), `lib/`(순수 로직·서버 함수).
- widgets: `widgets/<Name>/<Name>.tsx` + `<name>.css.ts`, 공개는 `widgets/index.ts` barrel에 등록.
  - widget은 **조합만** 한다: 데이터 요청은 `entities|features/*/api` 함수로 (직접 `fetch`는 lint error),
    쓰기·제출 같은 사용자 행동은 feature UI로 (예: Q&A 질문 쓰기 = `features/qna/ui/QnaWriteForm`, 오류 신고 = `features/error-report`).
  - feature 하나만 감싸는 화면이면 widget이 아니라 그 feature의 `ui/`에 둔다 (예: `features/order-manage/ui/OrderBoard`).
  - 상태·계산이 길어지면 같은 widget 폴더에 `use<Name>.ts` 훅으로 뺀다 (예: `widgets/CartCheckout/useCartCheckout.ts`).
  - 이름은 하는 일로 짓는다(`CartCheckout`, `OrderHistory`). Atomic Design 시절의 `*Template`은 쓰지 않는다.
  단 서버 전용 위젯(`auth()`·DB를 읽는 `Header`)은 barrel에 넣지 않고 파일 경로로 직접 import한다
  (클라이언트 컴포넌트가 barrel을 import하면 mongodb가 브라우저 번들에 들어가 빌드가 깨진다).
- 특정 도메인(주문, 상품 등)을 아는 코드는 shared에 두지 않는다. 판단이 애매하면 "다른 쇼핑몰 프로젝트에 그대로 가져가도 되나?"로 판단.
