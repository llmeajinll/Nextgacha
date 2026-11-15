# 면접 준비 노트

이 프로젝트(Next.js 16 App Router + TypeScript)로 면접을 볼 때 알아야 할 것을 모았다.
코드 예시는 전부 이 저장소의 실제 파일이다.

---

## 1. 렌더링 방식(SSR/CSR)은 어떻게 정하나

App Router에서 `page.tsx`는 기본이 **서버 컴포넌트**라서 아무것도 안 하면 서버에서 렌더링된다.
"SSR로 할까?"를 페이지마다 고르는 게 아니라, Next가 코드를 보고 자동으로 정한다.

- **정적(SSG)**: 요청마다 달라지는 게 없으면 빌드할 때 한 번 만들어 재사용한다.
- **동적(SSR)**: `cookies()`, `headers()`, `searchParams`, 세션을 쓰거나 `export const dynamic = 'force-dynamic'`이면 요청마다 새로 만든다.

실제로 정할 건 두 가지다.

1. **`'use client'`를 어디에 붙일까**: 페이지 맨 위에 붙이면 그 아래 전부가 브라우저에서 그려진다.
   첫 화면이 비고, 검색엔진도 빈 페이지를 본다. 기준은 *검색 노출과 첫 로딩이 중요한가*다.
   중요하면 서버에서 그리고, 상호작용하는 부분만 클라이언트 컴포넌트로 뗀다.
2. **매번 새로 만들까, 캐시할까**: 요청마다 DB를 조회할지, `revalidate`로 일정 시간 재사용할지.

### 이 프로젝트의 페이지

| 페이지 | 현재 | 이유 |
|---|---|---|
| 상품 상세 `[code]` | 서버에서 MongoDB 직접 조회 + `generateMetadata` | 검색·공유 미리보기가 중요한 핵심 페이지 |
| 홈, 검색, 공지 | 서버 렌더링 | 검색 노출, 첫 로딩 |
| 공지 `notice` | `force-dynamic` | 거의 안 바뀌어서 `revalidate`도 가능하지만 트래픽이 적어 그대로 둠 |
| 마이페이지, 장바구니, 결제 | `'use client'` | 로그인이 필요해서 검색 노출이 의미 없고, 상호작용이 많음 |
| 관리자 `/manager/*` | 동적 또는 클라이언트 | 관리자만 씀 |

**함정**: 서버 컴포넌트에서 이 앱의 `/api/*`를 `fetch`하면 안 된다. 요청에 세션 쿠키가 없어서
middleware가 401/403을 돌려준다. DB를 직접 조회하는 공용 함수를 만들어서 라우트와 페이지가 같이 쓴다
(예: `features/order-manage/lib/findOrdersByStatus.ts`).

**규칙**: 새 페이지는 서버 컴포넌트로 시작하고, `useState`나 `onClick`이 필요한 컴포넌트만 `'use client'`로 분리한다.

### 이건 정책인가?

서비스 정책(환불, 1인 5개 한도, 포인트처럼 고객에게 적용되는 규칙)은 아니다. 코드를 어떻게 짤지 정하는 개발 규칙이다.

- `docs/policies/engineering.md`: 선택지를 놓고 결정한 **개발 정책**(확정/제안/미정)
- `CLAUDE.md`, `.claude/rules/`: 작업할 때마다 지킬 **코딩 규칙**

렌더링은 코딩 규칙에 가깝다. 공지 페이지 캐시 여부처럼 실제로 골라야 할 상황이 생기면 그때 `engineering.md`에 남긴다.

---

## 2. 경력자 면접관이 보는 곳

면접관은 무엇을 만들었는지보다 *왜 그렇게 했는지, 깨지면 어떻게 되는지*를 본다.
기능 목록은 README로 알 수 있으니까, 직접 고민한 흔적이 있는지 한 군데를 깊게 파서 확인한다.

### 2-1. 결제 승인 흐름 (`src/app/api/postPaymentsConfirm/route.ts`)

예상 질문:
- 클라이언트가 보낸 금액을 왜 안 믿나? → `verifyOrder`가 DB 기준으로 금액, 포인트, 한도를 다시 계산한다.
- Toss 승인은 됐는데 DB 저장이 실패하면? → 트랜잭션이 롤백되고 결제를 취소한다. 취소마저 실패하면 `errorColl`에 기록한다.
- 트랜잭션 안에서 에러를 catch하면 왜 안 되나? → 일부만 처리된 주문이 커밋되거나, 드라이버가 중단을 몰라 무한 재시도할 수 있다.
- Toss 호출은 왜 트랜잭션 밖에 있나? → 외부 호출은 롤백할 수 없다. 대신 실패하면 결제 취소로 보상한다.

### 2-2. 동시성: 1인 5개 한도, 상태 전환

- 탭 두 개로 동시에 결제하면 6개를 살 수 있지 않나? → 왜 세 번 검사하는지(클라이언트 hook, 장바구니 API, 결제 승인), 마지막 검사가 왜 원자적이어야 하는지.
- 배송 처리 버튼을 두 번 누르면? → update에 `status` 필터를 걸어서 두 번째 요청은 아무 일도 안 한다(멱등성).
- 환불 금액을 왜 요청 body가 아니라 주문 문서에서 읽나?

### 2-3. 구조 변경: Atomic Design → FSD

- 혼자 하는 프로젝트에 FSD가 필요했나?
- 바꾸기 전에 실제로 무엇이 불편했나? 바꾼 대가는 무엇이었나?

정답이 있는 질문이 아니다. 본인 말로 이유와 대가를 설명할 수 있는지를 본다.

### 2-4. 렌더링 (1장)

- 이 페이지는 왜 클라이언트 컴포넌트인가?
- 서버 컴포넌트에서 자기 API를 fetch하면 왜 안 되나?

### 2-5. 성능 개선을 숫자로

홈 화면 Lighthouse 모바일 성능 점수가 73에서 80으로 올랐다. 개선 전 LCP는 4.1초, CLS는 0.13이었다.
*측정 → 원인 → 수정 → 재측정* 순서로 말한다. "병목을 어떻게 찾았나", "무엇이 가장 효과가 컸나"가 나온다.

### 2-6. 코드를 정말 이해하고 있는가

AI 도구를 썼다는 것 자체는 감점이 아니다. 다만 "이 줄은 왜 있어요?"에 막히면 다른 부분까지 의심받는다.
**2-1부터 2-4까지는 코드를 안 보고 화이트보드에 그릴 수 있을 정도로 준비한다.**

---

## 3. Next.js + TypeScript 필수 지식

### 3-1. `params`, `searchParams`는 Promise다 (Next 15부터)

```tsx
// src/app/(router)/notice/[num]/page.tsx
export default async function Page({ params }: { params: Promise<{ num: string }> }) {
  const num = Number((await params).num);
```

- 값은 항상 `string`이다(검색 파라미터는 `string | string[] | undefined`). URL은 사용자가 마음대로 바꾸는 입력이라 `Number.isInteger` 같은 검사가 필요하다.
- Next 15.5부터는 전역 헬퍼 `PageProps<'/notice/[num]'>`, `LayoutProps<...>`, `RouteContext<...>`가 경로 문자열에서 타입을 만들어 준다. 손으로 쓴 타입은 폴더 이름을 바꾸면 조용히 틀리지만, 헬퍼는 컴파일 에러를 낸다.

### 3-2. `notFound()`, `redirect()`의 반환 타입은 `never`

```tsx
const found = ... ? await findLiveNotice(num) : null;
if (!found) notFound();
return <NoticeDetailPage {...found} />;  // 여기서 found는 null이 아니다
```

`never`를 반환하는 함수를 부르면 TS가 그 뒤 코드에서 `found`가 null이 아니라고 좁혀 준다(control flow narrowing). `return`이 없어도 되는 이유다.

### 3-3. 서버 → 클라이언트 props는 직렬화할 수 있어야 한다

서버 컴포넌트가 클라이언트 컴포넌트에 넘기는 값은 JSON처럼 변환돼서 전달된다.
`ObjectId`, 함수, 클래스 인스턴스는 넘길 수 없고, `Date`는 넘어가지만 타입 설계에 주의해야 한다.

- 이 프로젝트의 `CardProps._id: string`(`src/entities/product/model/types.ts`)은 MongoDB가 주는 실제 타입(`ObjectId`)과 다르다. **경계에서 변환하지 않으면 타입은 string인데 실제 값은 ObjectId**가 되어 TS가 오류를 못 잡는다.
- 원칙: DB 문서 타입과 화면용 타입을 나누고, 서버 쪽에서 `_id.toString()`으로 바꿔 넘긴다.

### 3-4. `'use client'`와 `'use server'`는 짝이 아니다 ⚠️

자주 헷갈리는 부분이고, 면접 단골 질문이다.

| 지시어 | 의미 |
|---|---|
| (없음) | 서버 컴포넌트. **기본값이라 표시할 필요가 없다** |
| `'use client'` | 여기서부터 클라이언트 번들에 들어간다 |
| `'use server'` | 이 파일의 export 함수가 전부 **Server Action**이 된다. 브라우저에서 POST로 부를 수 있는 **공개 엔드포인트**다 |

`'use server'`는 "서버 컴포넌트"라는 뜻이 아니다. 이 프로젝트에 잘못 쓴 곳이 있다.

- `src/widgets/Header/Header.tsx`, `src/app/(router)/mypage/page.tsx`: 서버 컴포넌트인데 `'use server'`가 붙어 있었다. 지시어를 지웠다.
  - 주의: `Header`는 지시어만 지우면 빌드가 깨진다. 클라이언트 컴포넌트(`SiteFrame`)가 `@/widgets` barrel을 import하는데 barrel이 `Header`를 내보내서, `Header` → `auth` → `mongodb`가 브라우저 번들에 들어간다. `'use server'` 파일은 클라이언트에 참조만 넘어가서 우연히 가려져 있었다. `Header`를 barrel에서 빼고 layout이 `@/widgets/Header/Header`로 직접 import하게 고쳤다.
- `src/shared/hooks/useCookie.ts`: hook이 아닌데 이름이 `use`로 시작하고, `'use server'` 때문에 외부에서 호출할 수 있는 action이 됐다. 지금은 호출한 사람 자기 쿠키만 읽어서 피해는 없다. 하지만 action 안에서 DB를 쓰면 **함수마다 인증과 입력 검증을 직접 해야 한다.** middleware의 `/api/protected` 가드는 action에 적용되지 않는다.

DB 모듈이 실수로 클라이언트에 import되지 않게 하려면 파일 맨 위에 `import 'server-only'`를 둔다.

### 3-5. Route Handler의 `req.json()`은 `any`다

```ts
// src/app/api/postErrorStatus/route.ts
if (typeof id !== 'string' || !ObjectId.isValid(id) || ...) {
```

`await req.json()`의 타입은 `any`라서 아무 검사 없이 통과한다. `unknown`으로 받고 `typeof`로 좁히거나 스키마 검증(zod 등)을 거친다.
이 프로젝트는 `typeof` 검사를 직접 한다. 신뢰할 수 없는 입력(`{ "$gt": "" }` 같은 NoSQL 연산자 주입)을 막는 이유까지 설명할 수 있어야 한다.

### 3-6. `any`를 줄이고 `unknown`, 제네릭을 쓴다

- `src`의 `any`는 전부 없앴다(주석 제외). `any`는 면접관이 코드를 열면 가장 먼저 보이는 신호 중 하나라서 먼저 치웠다.
- 컬렉션에 제네릭을 줬다(`src/shared/api/docs.ts`의 `CartDoc`, `UserDoc`, `QnaDoc`, `OrderDoc`, `ReviewDoc`, `CategoryDoc`). `collection<CartDoc>('cart')`처럼 주면 `findOne` 결과와 `$pull`/`$push`가 타입 검사돼서 `as any`가 필요 없다. 아직 타입이 없는 컬렉션은 `product`, `banner`, `notice`, `counter`, `error`다.
- `any`는 검사를 끄고, `unknown`은 쓰기 전에 좁히라고 강제한다.

### 3-7. `satisfies` vs 타입 표기

```ts
// src/auth.config.ts
export default { ... } satisfies NextAuthConfig;
```

- `const x: T = ...`는 값을 `T`로 넓혀서 구체적인 정보(리터럴 타입 등)를 잃는다.
- `satisfies T`는 `T`에 맞는지만 검사하고 추론된 구체 타입은 유지한다. 설정 객체에 잘 맞는다.

### 3-8. NextAuth 세션 타입 확장

`session.user`에 기본 필드(name, email, image) 말고 다른 값을 넣으면 module augmentation으로 타입을 늘린다.

```ts
declare module 'next-auth' {
  interface Session { user: { role?: string } & DefaultSession['user'] }
}
```

### 3-9. 환경변수

- `process.env.X`의 타입은 `string | undefined`다. `!`(non-null 단언)는 검사가 아니다. `src/shared/api/mongodb.ts`처럼 시작할 때 없으면 throw한다.
- `NEXT_PUBLIC_`으로 시작하는 변수는 **빌드할 때 클라이언트 번들에 문자열로 박힌다.** 시크릿에 절대 붙이지 않는다.

### 3-10. 캐시와 요청 중복 제거

- Next 15부터 `fetch`는 기본으로 캐시하지 않는다(14와 다름).
- 같은 요청 안에서 같은 조회를 두 번 하지 않으려면 React `cache()`로 감싼다. `src/app/(router)/[code]/layout.tsx`는 `generateMetadata`와 layout이 상품을 한 번만 조회하게 한다.
- 오래 재사용하는 캐시는 `revalidate`나 `unstable_cache`/`'use cache'`를 쓴다. 이 둘은 다른 문제를 푼다.

### 3-11. 특수 파일

- `error.tsx`는 반드시 클라이언트 컴포넌트다(`'use client'`). 에러 경계는 브라우저에서 동작하는 React 기능이기 때문이다.
- `loading.tsx`는 자동으로 `<Suspense>` 경계가 된다.
- `@tab`, `@menu` 같은 폴더는 **parallel route**, `(.)review`는 **intercepting route**다(마이페이지 리뷰 모달). 왜 썼는지 물어볼 수 있다.

---

## 바로 고칠 수 있는 것 (완료)

1. `Header.tsx`, `mypage/page.tsx`에서 `'use server'` 지움, `Header`를 widgets barrel에서 뺌 (3-4)
2. `useCookie.ts` 지움 (3-4)
3. `src/app/(router)/main/page.tsx` 지움
4. `any` 제거와 컬렉션 제네릭 (3-6). 남은 일: `product` 등 나머지 컬렉션에 타입, 3-3의 `_id` 타입 경계 정리
