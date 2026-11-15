# TypeScript 정책

상태 표기와 문서 규칙은 [README](./README.md) 참고. 입력 검증의 런타임 쪽은 [API 규약 · 입력 검증 방식](./api.md#입력-검증-방식), DB 문서 타입은 [데이터 · 스키마와 마이그레이션](./data.md#스키마와-마이그레이션)과 같이 본다.

## strict 모드
- 상태: 확정
- 정책: `tsconfig.json`의 `strict: true`를 끄지 않는다. 개별 옵션(`strictNullChecks` 등)을 파일·폴더 단위로 풀지 않는다. `pnpm typecheck`(`tsc --noEmit`)가 CI에서 통과해야 머지한다.
- 이유: 결제·포인트 계산에서 `undefined`가 숫자 연산에 섞이면 `NaN`이 저장된다. strict가 이를 컴파일 때 막는다.
- 코드: `tsconfig.json`, `.github/workflows/ci.yml`
- 변경 이력: 2026-11-15 신설

## any 금지
- 상태: 확정
- 정책: `any`를 쓰지 않는다. 모르는 값은 `unknown`으로 받고 타입 가드로 좁힌다. `@ts-ignore`도 쓰지 않는다. 정말 필요하면 `@ts-expect-error 이유`를 쓴다(고쳐지면 에러가 나서 남지 않는다).
- 이유: 코드의 `any`는 이미 0개다(주석에만 남음). 린트 규칙이 꺼져 있어서 다시 들어와도 막을 수 없었다.
- 코드: `eslint.config.mjs` `@typescript-eslint/no-explicit-any: 'error'`
- 변경 이력: 2026-11-15 신설 (린트 규칙 off → error)

## 외부 입력의 타입
- 상태: 확정
- 정책: `req.json()`, `searchParams`, `formData`, `localStorage`, 외부 API 응답은 타입이 없는 값(`unknown`)으로 본다. 라우트에서 바로 `as Foo`로 단언하지 않고, 검사 함수(`parseXxx(v: unknown): Foo | null`, `isXxx(v): v is Foo`)를 거친 뒤에 쓴다.
  - 검사 함수는 `entities|features/*/lib`에 두고 `*.test.ts`를 같이 쓴다 (예: 잘못된 값, Mongo 연산자 객체 `{ $gt: 0 }`가 `null`로 걸러지는지).
- 이유: TypeScript 타입은 런타임에 없다. 단언한 타입을 믿고 Mongo 필터에 넣으면 객체가 연산자로 해석된다([API 규약](./api.md#입력-검증-방식)).
- 코드: `src/entities/product/lib/parseProductForm.ts`, `src/features/purchase/lib/orderPolicy.ts` `isValidOrderList`
- 변경 이력: 2026-11-15 신설

## 타입 단언(as)과 non-null(!)
- 상태: 확정
- 정책:
  - `as`는 검증을 마친 값의 타입을 좁힐 때, `as const`, JSON 직렬화 결과(`JSON.parse(JSON.stringify(x)) as T`)에만 쓴다. 검증 없이 `as`로 맞추지 않는다.
  - `!`(non-null 단언)는 새로 쓰지 않는다. 환경변수는 읽고 없으면 throw하는 방식으로 쓴다 (`toss.ts`의 `tossHeaders`처럼).
- 현황: `as` 약 90곳, `!` 11곳이 있다. 그중 `process.env.X!`가 `src/auth.config.ts:7-8`, `src/shared/api/mongodb.ts:5`에 있다.
- 이유: `as`와 `!`는 컴파일러 검사를 끈다. 틀리면 타입은 맞는데 런타임에 깨진다.
- 코드: 잘 된 예 `src/features/purchase/lib/toss.ts` `tossHeaders`
- 변경 이력: 2026-11-15 신설 (기존 코드는 건드릴 때 고침)

## 타입을 두는 곳
- 상태: 확정
- 정책:
  - 화면·API가 주고받는 도메인 타입은 `entities/<도메인>/model/types.ts`, 기능 전용 타입은 `features/<기능>/model/types.ts`에 둔다.
  - MongoDB 문서 타입은 `src/shared/api/docs.ts`에 두고 컬렉션 제네릭으로 준다(`mongodb.ts`가 shared라 entities를 import할 수 없음).
  - 컴포넌트 props 타입은 컴포넌트 파일 안에 둔다. 다른 파일이 쓰기 시작하면 그때 `model/types.ts`로 옮긴다.
  - `interface` 대신 `type`을 쓴다 (지금 `type` 104곳, `interface` 4곳).
- 이유: FSD import 방향([fsd 규칙](../../.claude/rules/fsd.md))을 지키면서 같은 타입을 한 곳에서 고치기 위해서다.
- 코드: `src/shared/api/docs.ts`, `src/entities/order/model/types.ts`
- 변경 이력: 2026-11-15 신설

## 고정 값은 리터럴 유니온
- 상태: 제안
- 정책: 정해진 몇 개 값만 갖는 필드(주문 상태, 에러 종류, 숨김 사유)는 `string` 대신 리터럴 유니온 타입으로 둔다. 값 목록이 런타임에도 필요하면 `as const` 배열에서 타입을 만든다.
  ```ts
  export const ORDER_STATUS = ['상품 확인중', '배송중', '배송 완료', '환불'] as const;
  export type OrderStatus = (typeof ORDER_STATUS)[number];
  ```
- 추천: 주문 상태부터 한다. 지금 `OrderDoc.status`는 `string`이고 상태 문자열이 15곳 이상에 직접 적혀 있어서, 오타(`'배송완료'`)가 나도 컴파일러가 못 잡는다.
- 이유: 상태 전이 가드(`status` 필터)가 이 문자열에 의존한다.
- 코드: 잘 된 예 `src/shared/model/reviewHideReasons.ts`, 대상 `src/shared/api/docs.ts` `OrderDoc.status`
- 변경 이력: 2026-11-15 신설

## JS 파일
- 상태: 제안
- 정책: 새 파일은 `.ts`/`.tsx`로만 만든다. 남은 JS 파일(`src/entities/product/lib/category.js`, `getStandardCategory.js`)을 TS로 옮긴 뒤 `allowJs`를 끈다.
- 이유: JS 파일은 타입 검사를 받지 않아서, 검색 페이지(`SearchPage.tsx`)가 받는 카테고리 값의 형태를 보장하지 못한다.
- 코드: `tsconfig.json` `allowJs: true`
- 변경 이력: 2026-11-15 신설

## 테스트 파일 import
- 상태: 확정
- 정책: `*.test.ts`는 Node 내장 러너로 돌리므로 옆 파일을 상대 경로 + `.ts` 확장자로 import한다(`./orderPolicy.ts`). 그래서 테스트 대상 순수 함수 파일은 `@/` 별칭 import를 쓰지 않는다. 별칭이 필요한 로직(DB 접근 등)은 순수 부분을 따로 빼서 테스트한다.
- 이유: plain Node는 tsconfig `paths`를 읽지 않는다.
- 코드: `tsconfig.json` `allowImportingTsExtensions`, `src/entities/product/lib/salePolicy.test.ts`
- 변경 이력: 2026-11-15 신설
