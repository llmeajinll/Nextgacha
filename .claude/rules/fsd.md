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

## 컴포넌트 재사용

- UI를 새로 만들기 전에 `src/shared/ui/index.ts`와 해당 도메인의 `entities/*/ui`를 먼저 찾는다. 있으면 그걸 쓴다
  (`Btn`, `ImgBtn`, `DropDown`, `Pagination`, `Range`, `EmptyCard`, `StarRating`, `Title` ...).
- 조금 안 맞으면 복사해서 새로 만들지 말고 기존 컴포넌트에 prop을 추가해 넓힌다.
- 같은 UI가 두 곳 이상에서 필요해지면 그 자리에서 복사하지 말고 공용으로 올린다: 도메인을 모르면 `shared/ui`,
  도메인을 알면 `entities/<도메인>/ui`.
- 외부 UI 라이브러리(`rc-pagination`, `react-slick` 등)는 페이지·위젯에서 직접 import하지 않고 `shared/ui` 래퍼로 쓴다.
  모양과 접근성을 래퍼 한 곳에서 맞추기 위해서다.
- `shared/ui`에 추가하면 `shared/ui/index.ts`에 등록하고 `stories/shared/ui/`에 스토리를 만든다
  ([design.md Storybook](../../docs/policies/design.md#storybook)).

## 기존 예외 (알고 있는 부채)

- `features/purchase` → `features/cart` import (TicketPanel, InfoPanel, ProductPurchasePanel).
  새로 늘리지 말고, 건드릴 일이 있으면 공용 부분을 entities/shared로 내리는 쪽으로.

## 어디에 둘까

| 레이어 | 담는 것 | 예 |
|---|---|---|
| `app/` | 라우트, `api/*/route.ts`, layout | `manager/layout.tsx` |
| `views/` | 페이지 단위 조합 | `HomePage`, `DetailPage` |
| `widgets/` | 독립적인 큰 UI 블록 (slice당 폴더 하나) | `Header`, `ManagerSideMenu` |
| `features/` | 사용자 행동 (장바구니 담기, 결제, 주문 처리) | `cart`, `purchase`, `order-manage` |
| `entities/` | 도메인 객체 표시/조회 | `product`, `order`, `user` |
| `shared/` | 도메인 모르는 재사용 코드 | `api/mongodb`, `lib/koreaTime`, `ui/Btn` |

- entities/features slice 내부: `api/`(클라이언트 fetcher → 내부 `/api/*`), `model/`(타입, jotai atom), `ui/`(컴포넌트 + `*.css.ts`), `lib/`(순수 로직·서버 함수).
- widgets: `widgets/<Name>/<Name>.tsx` + `<name>.css.ts`, 공개는 `widgets/index.ts` barrel에 등록.
- 특정 도메인(주문, 상품 등)을 아는 코드는 shared에 두지 않는다. 판단이 애매하면 "다른 쇼핑몰 프로젝트에 그대로 가져가도 되나?"로 판단.
