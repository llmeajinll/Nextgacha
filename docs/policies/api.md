# API 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고.

## 응답 형식
- 상태: 제안
- 정책: 모든 API는 성공이면 2xx + `{ ok: true, ... }`, 실패면 4xx/5xx + `{ ok: false, message }`로 응답한다. 실패를 HTTP 200으로 돌려주지 않고, 본문에 `status`를 넣지 않는다. 에러 키는 `message` 하나만 쓴다.
- 이유: 지금은 실패인데 200을 주는 곳, 본문에 `status`를 넣는 곳이 섞여 있고, 에러 키도 `message`와 `error`가 섞여 있다. 클라이언트가 실패를 `res.ok`로 판단할 수 없다.
- 코드: 실패인데 200 `src/app/api/postEvent/route.ts:30`, `src/app/api/postEditProduct/route.ts:36`, `src/app/api/getOneHistory/route.ts:22` / 본문 `status` `src/app/api/protected/getHistory/route.ts:25`
- 변경 이력: 2026-11-09 신설

## 에러 상태 코드
- 상태: 제안
- 정책: 실패 이유에 따라 상태 코드를 나눈다.
  - 400: 요청 형식이 틀림 (필드 누락, 타입 오류, 깨진 JSON). 고쳐서 다시 보내야 한다.
  - 401: 로그인 안 됨 / 403: 권한 없음 (관리자 아님, 남의 데이터) / 404: 대상이 없음
  - 409: 요청은 맞지만 지금 상태로는 처리할 수 없음 (재고 부족, 1인 한도 초과, 포인트 부족, 이미 배송중·환불된 주문)
  - 500: 서버 쪽 실패 (DB 오류, 외부 API 장애, 예상 못 한 예외)
- 선택지:
  - A. 위 구분 (추천). 로그만 봐도 사용자 실수(4xx)와 서버 장애(5xx)가 갈리고, [에러 알림](./engineering.md)은 5xx만 보내면 된다.
  - B. 400/401/403/500만 쓴다. 단순하지만 "재고 부족"과 "깨진 요청"이 같은 400이라 구분이 안 된다.
- 이유: 지금은 상태 때문에 거절한 경우와 서버 실패가 400으로 섞여 있다. 결제 트랜잭션은 재고 부족이든 DB 장애든 전부 400을 돌려준다.
- 코드: 한도 초과 400 `src/app/api/protected/postCart/route.ts:17`, `src/app/api/updateCart/route.ts:22` / 이미 처리된 주문 400 `src/app/api/postCheckToSending/route.ts:97` / 트랜잭션 실패 전부 400 `src/app/api/postPaymentsConfirm/route.ts:105`
- 구현 시 바뀌는 곳: 위 라우트의 status 값, 클라이언트는 [응답 형식](#응답-형식)대로 `res.ok`로만 판단하면 되므로 변경 없음
- 변경 이력: 2026-11-09 신설

## 에러 메시지 노출
- 상태: 제안
- 정책: 사용자에게 보여줄 문구로 **의도해서 던진 에러**만 `message`를 그대로 내보낸다. 그 외 에러(Mongo 드라이버, Toss 응답, 런타임 예외)는 서버 로그에만 남기고, 응답은 500 + `'일시적인 오류입니다. 잠시 후 다시 시도해주세요.'`로 통일한다.
- 선택지:
  - A. `shared/lib`에 `class AppError extends Error { status }` 하나를 두고, 사용자용 에러는 `throw new AppError('재고가 부족한 상품이 있습니다.', 409)`로 던진다. catch에서는 `err instanceof AppError`일 때만 메시지와 status를 쓴다 (추천). 지금 `throw new Error('...')`를 `AppError`로 바꾸는 정도라 변경이 작다.
  - B. 응답에 `code`(예: `OUT_OF_STOCK`)만 보내고 문구는 클라이언트가 고른다. 다국어나 문구 관리에는 좋지만, 클라이언트에 코드→문구 표가 하나 더 생긴다. 지금 규모에는 과하다.
- 이유: 지금은 트랜잭션 catch가 `err.message`를 그대로 응답에 넣는다. purchase lib가 던진 문구라면 괜찮지만, 같은 경로로 Mongo 드라이버 에러 원문(내부 구조, 컬렉션 이름)도 사용자 화면에 나간다. `toss.ts`는 실패 시 Toss 응답 전체를 `JSON.stringify`해서 에러 메시지로 만든다.
- 코드: `src/app/api/postPaymentsConfirm/route.ts:102`, 의도한 에러 `src/features/purchase/lib/reduceStock.ts:30`, `reducePoint.ts:23-28` / 응답 원문을 메시지로 만듦 `src/features/purchase/lib/toss.ts:34`, `:43`
- 구현 시 바뀌는 곳: `shared/lib/AppError.ts` 신설, `features/purchase/lib/{reduceStock,reducePoint}.ts`의 throw, `postPaymentsConfirm`·`postCheckToSending`의 catch
- 변경 이력: 2026-11-09 신설

## 예상 못 한 예외 처리
- 상태: 제안
- 정책: 어떤 예외가 나도 API는 JSON(`{ ok: false, message }`)으로 응답한다. 라우트 핸들러를 공용 래퍼 하나(`shared/lib` `withApiError(handler)`)로 감싸서, 래퍼가 [에러 메시지 노출](#에러-메시지-노출) 규칙대로 응답을 만들고 5xx는 `console.error`로 남긴다 ([로그 개인정보](./engineering.md) 규칙을 따른다).
- 선택지:
  - A. 공용 래퍼 (추천). Next.js route handler에는 전역 에러 핸들러가 없어서(`error.tsx`는 페이지 전용) 래퍼가 가장 작은 공통 지점이다. 새 라우트에서 빠뜨리기 어렵다.
  - B. 라우트마다 try/catch. 지금 방식인데, 이미 15개 라우트가 빠져 있다.
- 예외: 트랜잭션 안의 catch는 다시 throw해야 하므로 래퍼와 별개다 (`CLAUDE.md` Data layer). 결제 승인 후 실패처럼 **응답 전에 보상 작업(결제 취소)이 필요한** 라우트는 지금처럼 직접 catch하고, 보상 후 `AppError`를 던지거나 응답한다.
- 이유: try/catch가 없는 라우트에서 DB 오류가 나거나 본문이 깨진 JSON이면(`await req.json()`이 throw), Next가 JSON이 아닌 500을 돌려준다. 그러면 클라이언트의 `await res.json()`까지 같이 터져서 사용자는 아무 안내도 못 본다.
- 코드: try/catch 없음 `src/app/api/{getProduct,getOneProduct,getCart,postCheckStock,getOrderSort,getQna,updateCart}/route.ts`, `src/app/api/protected/{deleteQuestion,getLike,getHistory,postRequestQna,postQna,updateQna,updateLike}/route.ts` / Toss 승인 fetch 자체가 실패하면 catch 없이 터짐 `src/app/api/postPaymentsConfirm/route.ts:56`
- 구현 시 바뀌는 곳: `shared/lib/withApiError.ts` 신설, 모든 `route.ts`의 `export async function` → `export const POST = withApiError(async (req) => ...)`
- 변경 이력: 2026-11-09 신설

## 입력 검증 방식
- 상태: 미정
- 정책: 미정. 요청 본문은 라우트 첫 줄에서 검증하고, 실패하면 DB에 접근하기 전에 400을 준다. Mongo 쿼리에 들어가는 값은 반드시 원시 타입(`Number.isInteger`, `typeof === 'string'`)인지 확인한다. 객체가 들어오면 `{ "$gt": 0 }` 같은 연산자로 해석된다.
- 결정할 것: 지금처럼 라우트마다 `typeof` 검사를 직접 쓸지, 공용 검증 유틸(`shared/lib`)이나 스키마 라이브러리를 도입할지. 지금 의존성에는 검증 라이브러리가 없다.
- 이유: 라우트마다 검사 방식이 달라서, 새 라우트에서 검증을 빠뜨리기 쉽다 (예: [관리자 입력값 검증](./admin.md), [결제 시 배송지 검증](./payments.md)).
- 코드: 잘 된 예 `src/app/api/protected/postReview/route.ts`, `src/features/purchase/lib/orderPolicy.ts` `isValidOrderList`
- 변경 이력: 2026-11-09 신설

## 인증 위치
- 상태: 제안
- 정책: 로그인이 필요한 API는 `/api/protected/` 아래에 둔다. 라우트 안에서도 `auth()`로 이메일을 확인한다(이메일이 쿼리 조건에 들어가므로 어차피 필요).
- 이유: 지금은 로그인이 필요한 API 중 일부(`getCart`, `updateCart`, `updateAddress`, `getOneHistory`, `postCheckStock`)가 `/api/protected/` 밖에 있어서, 경로만 보고 보호 여부를 알 수 없다.
- 코드: `src/proxy.ts`, 위치가 어긋난 라우트 `src/app/api/{getCart,updateCart,updateAddress,getOneHistory,postCheckStock}`
- 변경 이력: 2026-11-09 신설

## 관리자 권한 이중 확인
- 상태: 제안
- 정책: 관리자 API는 미들웨어와 별개로, 라우트 안에서도 `isAdminEmail`을 확인한다. 공용 헬퍼(예: `requireAdmin()`) 하나를 모든 관리자 라우트 첫 줄에서 부른다.
- 이유: 지금은 미들웨어의 `ADMIN_API_PATHS`와 `matcher`에서만 확인한다. 둘 중 한 곳에서 경로 하나만 빠져도 그 관리자 API가 누구에게나 열린다.
- 코드: `src/proxy.ts:9`(`ADMIN_API_PATHS`), `src/proxy.ts:109`(`matcher`), `src/shared/lib/isAdmin.ts`
- 변경 이력: 2026-11-09 신설

## 공개 API 남용 방지
- 상태: 제안
- 정책: 비로그인으로 호출할 수 있는 쓰기·대량 조회 API에 요청 제한을 둔다.
  - `/api/track`: 저장하는 `tag` 값을 실제 존재하는 태그로 제한해서 임의 값 upsert를 막는다
  - `/api/postCartProduct`: 요청 배열 길이 상한 (예: 50)
  - `/api/postError`: IP당 요청 수 제한
- 이유: 지금은 스팸 요청만으로 `pageViewsColl`과 `errorColl`을 계속 키우거나, DB 조회를 무제한으로 일으킬 수 있다.
- 코드: `src/app/api/track/route.ts:77`, `src/app/api/postCartProduct/route.ts:9`, `src/app/api/postError/route.ts`
- 변경 이력: 2026-11-09 신설
