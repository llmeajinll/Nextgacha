---
paths:
  - "src/app/api/**"
  - "src/proxy.ts"
  - "src/features/*/lib/**"
  - "src/entities/*/lib/**"
---

# API route 규칙

## 새 route 추가 시 등록 (`src/proxy.ts`)

- 로그인 필요 → `/api/protected/*` 아래에 둔다 (미로그인 401).
- 관리자 전용 → `ADMIN_API_PATHS`에 추가 (`isAdminEmail` 아니면 403).
- 어느 쪽이든 **`matcher` 배열에도 추가**한다. matcher에 없으면 middleware가 아예 실행되지 않아 무방비가 된다.
- route 하나 추가는 보통 양쪽을 다 건드린다: `src/app/api/*/route.ts`(MongoDB 직접 조회) + `entities|features/*/api`(클라이언트 fetcher, 상대 URL `/api/...`로 호출).

## 신뢰하지 말 것

- 클라이언트가 보낸 금액·포인트·가격·이메일은 믿지 않는다. 서버가 DB나 세션에서 다시 읽는다
  (결제는 `verifyOrder`, 주문 처리는 주문 문서에서 email/list/points를 읽는다).
- 공개 조회 API(`getQna`, `getReview`)는 원본 이메일을 돌려주지 않는다 → `shared/lib/maskEmail`.
  QnA는 서버가 계산한 `isMine` 플래그를 쓰고, 비밀글 내용은 비운다.
- `req.json()`·`searchParams`에서 꺼낸 값은 Mongo 필터, `$in`, `$pull`, `arrayFilters`에 넣기 전에 원시 타입인지 확인하고,
  아니면 DB에 접근하기 전에 400을 준다. 객체가 들어오면 `{ "$ne": "" }` 같은 연산자로 해석돼 엉뚱한 문서가 매칭된다.
  지금은 라우트마다 `typeof x === 'string'` / `Number.isInteger(x)`로 직접 검사한다
  (잘 된 예 `protected/postReview/route.ts`, 공용 방식은 `docs/policies/api.md` "입력 검증 방식"에서 미정).
- 사용자 데이터를 읽고 쓰는 쿼리에는 세션(`auth()`)의 email을 조건으로 넣는다. 요청에서 받은 `orderId`·`_id`만으로
  문서를 찾으면 남의 주문·장바구니에 닿는다 (관리자 route는 예외).

## 시크릿·로그

- 서버 전용 값(`TOSS_SECRET_KEY`, `MONGODB_URI`, `ADMIN_EMAILS`, `AUTH_*`)에는 `NEXT_PUBLIC_`을 붙이지 않는다. 붙이면 브라우저 번들에 들어간다.
  공개해도 되는 값은 `NEXT_PUBLIC_VERCEL_IMAGE_URL`, `NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY`(client key)뿐이다.
- `console.error`에는 `orderId`, 에러 코드, 메시지만 남긴다. 이메일·주소·`paymentKey`·외부 API 응답 전체는 남기지 않는다
  (운영 빌드에서 `console.log`만 지워지고 `console.error`는 남는다 — `next.config.ts`).
