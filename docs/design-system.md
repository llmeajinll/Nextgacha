# NextGacha 디자인 시스템

> 기준: `main` @ `eb96ad8` (2026-11-09). 코드에서 추출한 현재 상태를 기록한 문서다. 이상적인 규칙이 아니라 **지금 실제로 쓰이는 값**이며, 규칙과 어긋나는 부분은 마지막 [알려진 불일치](#알려진-불일치)에 따로 모았다.

## 한눈에 보기

- **콘셉트**: 가챠(캡슐토이) 기계. 픽셀 폰트(Silkscreen), 블러 없는 하드 그림자, 1px 회색 테두리, 하늘색 포인트 컬러. 메인 배너에는 가챠 레버 모양 슬라이드 컨트롤이 있다.
- **기술**: [Vanilla Extract](https://vanilla-extract.style/)(`*.css.ts`, 빌드 타임 CSS). 컴포넌트마다 `Component.tsx` + `component.css.ts`를 나란히 둔다. 인라인 `style={}`과 런타임 CSS-in-JS는 쓰지 않는다. MUI는 관리자 통계 차트(`@mui/x-charts`)에만 쓴다.
- **레이아웃**: 지금은 데스크톱 고정폭(1314px)이고 미디어 쿼리 0개, 다크 모드 없음. **모바일 버전을 고려하고 있다** → [3.4 모바일 대응](#34-모바일-대응-계획).

| 파일 | 역할 |
|---|---|
| `src/styles/theme.css.ts` | 전역 토큰 `vars` (`createGlobalTheme(':root')`) + `a`, `div` 전역 스타일 |
| `src/styles/variants.css.ts` | 공용 `styleVariants` (Btn 크기·색, Range 레이아웃, LabelTitle, Category, ReactSlick, TicketContainer) |
| `src/app/globals.css` | body 리셋, Silkscreen `@font-face` |
| `src/app/layout.tsx` | Noto Sans KR(`next/font/google`)을 `body`에 적용 |
| `src/app/layout.css.ts` | 페이지 컨테이너(1314px) |

---

## 1. 컬러

### 1.1 토큰 (`vars`)

```ts
import { vars } from '@/styles/theme.css';
```

| 토큰 | 값 | 용도 | 사용 횟수 |
|---|---|---|---|
| `vars.color.blue1` | `#75C3FE` | **브랜드/포인트.** 기본 버튼 배경, 강조 테두리, 할인율, 슬라이드 활성 점 | 40 |
| `vars.color.gray1` | `#D9D9D9` | **기본 테두리/구분선.** 카드 이미지, Title 하단선, 헤더 하단선, 배너 테두리 | 33 |
| `vars.color.black1` | `#6F6F6F` | 보조 텍스트. Title, 헤더 메뉴, LabelTitle 값 | 22 |
| `vars.color.black2` | `#4C4C4C` | **본문 텍스트 기본값** (전역 `div { color }`), 더보기 버튼 | 8 |
| `vars.color.black3` | `#999999` | 흐린 텍스트 | 2 |
| `vars.status.new` | `#FFDFAB` | NEW 태그 | 0 ⚠️ |
| `vars.status.hot` | `#FFA5A5` | HOT 태그 | 0 ⚠️ |
| `vars.status.reserve` | `#BCE2FF` | 예약 태그 | 0 ⚠️ |
| `vars.status.soldout` | `#DCDCDC` | 품절 태그 | 0 ⚠️ |

> ⚠️ `status` 토큰은 정의만 돼 있고, `TagContainer`는 같은 hex 값을 직접 넘긴다.

### 1.2 토큰에 없지만 쓰이는 색

새 코드에서는 아래 값이 필요하면 **토큰부터 추가**한다.

| 값 | 역할 (실제 사용처) | 토큰 후보 |
|---|---|---|
| `#3AAAFF` | 하드 그림자·진한 파랑 (AlertModal, ReviewModal, checkout, addressTruck) | `blue2` |
| `#99D3FF` | 모달 버튼 배경 (AlertModal) | `blue0` |
| `#BFE3FF` | 버튼 베벨·프로필 테두리 (AlertModal, QnaTemplate) | `blueLight1` |
| `#DDF0FD`, `#D3EEFF` | 연한 하늘색 배경 (헤더 제보창, QnA) | `blueBg` |
| `#FDFDFD`, `#EFEFEF`, `#F1F1F1` | 레버 배경·핸들, 드롭다운 배경 | `gray0` |
| `white` | 배경 (34회) | `bg` |
| `lightgray`(`#D3D3D3`) | 테두리 `1px solid lightgray` 25회, 원가 취소선 | → `gray1`로 통일 대상 |
| `gray`(`#808080`) | 작성자/빈 상태 텍스트 | → `black3`로 통일 대상 |
| `red` | 폼 에러 텍스트 (상품 등록) | `danger` |
| `#5BDB44` | 주문 상태 강조 (OrderTemplate) | `success` |
| `#8E75FE`, `#0070F3`, `#4CAF50`, `#2196F3` | 관리자 이벤트/통계 화면 전용 | 관리자 전용으로 유지 |

**오버레이**: 모달 배경 `rgba(0,0,0,0.5)`, 검색 오버레이 `rgba(0,0,0,0.4)`.

---

## 2. 타이포그래피

### 2.1 폰트

| 폰트 | 로드 방식 | 쓰는 곳 |
|---|---|---|
| **Noto Sans KR** | `next/font/google`, variable font, `subsets: ['latin']`, `display: 'swap'`, `body`에 className으로 적용 | 기본 본문 전체 (한글) |
| **Silkscreen** | `globals.css` `@font-face 'silkscreen'` → `/fonts/Silkscreen-Regular.woff2` | 영문 디스플레이: 로고, 헤더 메뉴, 버튼, 모달 제목, 빈 상태, 작성자 (43회) |
| Silkscreen Bold | `'silkscreen_bold'` → `/fonts/Silkscreen-Bold.ttf` | 2회 |

```ts
fontFamily: 'silkscreen', // 픽셀 폰트가 필요할 때만. 한글에는 쓰지 않는다 (글리프 없음 → 대체 폰트)
```

> Noto Sans KR은 상속으로 받는다. 문자열로 `'notosans'`·`'Noto Sans Kr'`를 지정하면 next/font가 만든 해시 이름과 맞지 않아 **시스템 폰트로 떨어진다**. 3곳에서 이런 일이 있다(아래 불일치 참고).

### 2.2 크기 스케일

자간은 **음수, 대체로 font-size × −0.05**이고 줄높이는 `120%`가 기본이다.

| 크기 | 자간 | 쓰는 곳 | 사용 횟수 |
|---|---|---|---|
| 12px | — | 작성자(`Writer`) | 5 |
| 13px | −0.7px | 태그 (`vars.font.tagFont`, 줄높이 10px) | 3 |
| 14px | −0.7px | 헤더 메뉴, 카테고리, LabelTitle small | 25 |
| 16px | — | 본문 보조 | 12 |
| **18px** | −0.9px | 카드 제목 (`vars.font.cardTitle`, 줄높이 120%), 모달 본문, 가격 단위 | **32** |
| 20px | −1px | 버튼(medium/extra), 더보기, LabelTitle large, 할인가 | 25 |
| 22px | −1.1px | 버튼 big | 1 |
| 24px | −1.2px | 섹션 Title, 로고, 카드 가격, 버튼 small(기호) | 8 |
| 30px | — | 빈 상태(`EmptyCard`) | 3 |

그 외에 15px(3회)·40px(1회)이 한 번씩 쓰였다.

**굵기**: 기본 400, 강조 `500`(11회), 모달 제목 `bold`/`700`.

---

## 3. 레이아웃 & 간격

### 3.1 고정 폭

| 폭 | 대상 |
|---|---|
| **1314px** | 페이지 컨테이너 `layoutContainer` (`min-width` 동일, 가운데 정렬, 하단 패딩 50px), 헤더, 카테고리 메뉴 |
| 1312px × 437px | 메인 배너 슬라이드 (`reactSlickVariant.banner`) |
| 1272px + 좌우 패딩 20px | 홈 섹션 (`homePage.css.ts`) |
| 980px × 60px | 헤더 메뉴 바 |
| 960px | 상세 페이지 본문, 티켓 컨테이너 |
| 300px × 422px | 상품 카드 (이미지 300×300) |

### 3.2 간격 (`gapVariant`)

`Range`의 `gap` prop으로 고른다. 값: `none` `4` `5` `8` `10` `15` `30` `50` `'4 10'` `'10 30'` `'10 0'`.
자주 쓰는 리듬은 **10 / 15 / 20 / 30px**이다. Title 아래 20px, 섹션 아래 10px, EmptyCard 위 15px.

### 3.3 높이 리듬

**60px**가 기본 행 높이다: 헤더, Title, 더보기 버튼, 버튼 big.

### 3.4 모바일 대응 (계획)

모바일 버전을 고려하고 있다. 아직 구현 전이며, 현재는 1314px 레이아웃이 모바일 화면에서 축소되어 보인다(모바일 Lighthouse 성능 80점의 주 원인).

진행 방향:

- **브레이크포인트 토큰부터** 만든다. 컴포넌트마다 px 값을 직접 쓰지 않고 공용 상수로 둔 뒤 Vanilla Extract `style({ '@media': { … } })`에서 참조한다.
- **고정 `width` → `max-width` + `width: 100%`**로 바꾼다. 3.1 표의 폭(1314, 1312, 1272, 980, 960px)이 대상이고, 데스크톱에서는 지금과 같은 모습을 유지한다.
- **상품 카드 그리드**는 화면 폭에 따라 열 수를 줄인다. 카드(300×422px)는 비율을 유지하며 줄어들게 한다.
- **헤더 메뉴 바(980px)와 카테고리 드롭다운**은 모바일에서 접는 메뉴로 바꾼다.
- 새 컴포넌트를 만들 때는 고정 폭을 피하고 `Range`의 width/gap 변형으로 유연하게 조합한다(6장 작성 규칙 4번).

---

## 4. 모양 (테두리 · 모서리 · 그림자)

| 요소 | 값 |
|---|---|
| 기본 테두리 | `1px solid vars.color.gray1` |
| 강조 테두리 | `3px`~`4px solid vars.color.blue1` (모달, 결제창, QnA 작성) |
| 모서리 | 기본 **0 (각진 픽셀 느낌)**. 태그 `15px`, 검색창 `35px`, 알약형 `50px`, 원형 `50%` |
| **그림자** | 블러 없는 픽셀 그림자만 쓴다: `5px 5px 0 0 #3AAAFF`(모달), `4px 4px 0 0 vars.color.blue1`(모달 버튼) |
| 베벨 버튼 | 위·왼쪽 `4px solid #BFE3FF` + 오른쪽·아래 하드 그림자 (AlertModal 버튼) |

**z-index**: 슬라이드 레버 핸들 5, 헤더 카테고리·장바구니 드롭다운·구매 패널 10, 카테고리 목록 12, 제보창 20, 리뷰 모달 50, AlertModal 1000.
**모션**: `transform 0.3s ease`, `opacity 0.3s ease`, 레버 회전 `transform 0.4s ease-in-out`.

---

## 5. 컴포넌트

`@/shared/ui`에서 import한다 (`index.ts` 배럴).

### Btn

```tsx
<Btn size='medium' color='primary' onClick={...}>BUY</Btn>   // 기본값: medium, primary
<Btn type='more' href='search' query={{ type: 'main', tag: '인기 상품' }} />  // "더보기 ⟩" 링크 버튼
```

| size | 크기 | 글자 |
|---|---|---|
| `small` | 30×30 | 24px / −1.2px |
| `medium` | 180×50 | 20px / −1px |
| `big` | 320×60 | 22px / −1.1px |
| `extra` | 350×50 | 20px / −1px |

| color | 배경 / 글자 |
|---|---|
| `primary` | `blue1` / white |
| `reversePrimary` | white / `blue1` — 탭에서 선택 안 된 쪽 (관리자 주문·통계 탭) |

공통으로 `1px solid blue1` 테두리와 Silkscreen 폰트를 쓴다. `type='more'`는 폭 100%, 높이 60px, 20px, 위쪽 회색 구분선이다.

### CountBtn

`<CountBtn type='minus' | 'plus' />`: 30×30, `blue1` 배경, 흰 `-`/`+` 24px. 수량 조절용.

### Tag

```tsx
<Tag word='NEW' color={vars.status.new} />
```

높이 22px, 패딩 `4px 8px 5px`, 모서리 15px, `tagFont`(13px). 배경색은 `createVar`로 넘긴다. 상품 태그는 `entities/product/ui/TagContainer`가 묶는다: NEW·HOT(`create`가 있을 때), `YYYY년 MM월 예약`(KST 기준, `toKoreaTime`).

### Title

`<Title text='인기 상품' />`: 폭 100%, 높이 60px, 24px / −1.2px, `black1`, 아래 `gray1` 구분선. 섹션 제목.

### Range (레이아웃 프리미티브)

flex 박스 래퍼다. 레이아웃은 직접 flex를 쓰기보다 이걸로 조합한다.

```tsx
<Range width='full' gap='10' preset='between'>…</Range>
```

| prop | 값 | 기본 |
|---|---|---|
| `width` | `fit` `full` `320` `340` `960` | `fit` |
| `height` | `fit` `full` `45` `70` `450` | `fit` |
| `gap` | 3.2 참고 | `none` |
| `preset` | `center` `left` `right` `between` `alignCenter` `bottom` `column` `columnCenter` `columnBetween` `columnAlignCenter` | `center` |

### LabelTitle

`<LabelTitle label='이름' content='…' status='small' | 'large' />`: 라벨(60px 고정폭, 14px)과 값(`black1`)을 한 줄로 놓는다. `large`는 80px, 20px Silkscreen이다.

### ImgBtn · ToggleBtn · StarBtn · StarRating

| 컴포넌트 | 설명 |
|---|---|
| `ImgBtn` | 이미지 아이콘 버튼. `img`: `share` `dropdown` `close` `post` `report` (`/public/images`), `size` 또는 `width`/`height` |
| `ToggleBtn` | 이미지 토글 26×48. `rotate='vertical'`이면 90° 회전해 48×26 |
| `StarBtn` | 별 아이콘 25px(`medium`)·40px(`big`), `star_fill`/`star_empty` 이미지 |
| `StarRating` | `StarBtn` 5개 + gap 4. `disabled`면 읽기 전용 |

### Writer · EmptyCard

| 컴포넌트 | 설명 |
|---|---|
| `Writer` | 작성자 표시. 12px, gray, Silkscreen. `writerRight`는 오른쪽 정렬 |
| `EmptyCard` | 빈 상태 박스. 폭 100%, 높이 130px, `1px solid lightgray`, 30px gray Silkscreen. `noSpacing`이면 위 여백 없음 |

### AlertModal (전역)

`useModal().openModal(message)`로 연다. `layout.tsx`에 한 번만 마운트돼 있다.

- 컨테이너: 흰 배경, `3px solid blue1`, 하드 그림자 `5px 5px 0 #3AAAFF`, 화면 위에서 170px, 최소 폭 300px
- 헤더 바: `blue1` 배경, 흰 18px bold Silkscreen 제목, 닫기 이미지 버튼 35px
- 버튼: `#99D3FF` 배경, 베벨(`#BFE3FF`) + 그림자, 20px 700 Silkscreen

### ReactSlick

`react-slick` 래퍼다.

- `preset='banner'`: 1312×437, autoplay, 하단에 **가챠 레버** 컨트롤(151px 원, 회전 핸들, `blue1` 활성 점)이 붙는다. 첫 장은 `priority`(LCP 최적화).
- `preset='small'`(기본): 450×450 상품 이미지 슬라이드, 점 내비게이션.

### 상품 Card (`entities/product/ui/Card`)

| 부분 | 스타일 |
|---|---|
| 카드 | 300×422 |
| 이미지 | 300×300, `1px solid gray1`, 흰 배경 |
| 태그 | 이미지 아래, `TagContainer` |
| 제목 | `cardTitle` 18px, **2줄 말줄임** (`WebkitLineClamp: 2`), 높이 42px |
| 가격 | 24px / −1.2px |
| 할인 | 할인율 `blue1` 20px 500 → 원가 `lightgray` 취소선 → 할인가 |
| 단위·좋아요 | 단위 "원" 18px, 오른쪽에 `HeartBtn`(28px) |

---

## 6. 작성 규칙

1. **스타일은 `*.css.ts`에** 둔다. 컴포넌트 옆에 소문자 파일명으로 둔다(`Card.tsx` ↔ `card.css.ts`). 인라인 `style={}` 금지. 런타임 값은 `createVar` + `assignInlineVars`(`@vanilla-extract/dynamic`)로 넘긴다(Tag, ReactSlick 레버처럼).
2. **색·폰트 토큰은 `vars`에서.** hex를 새로 쓰기 전에 1.2 표를 확인하고, 반복되면 `theme.css.ts`에 토큰을 추가한다.
3. **변형(variant)은 `styleVariants`로** 만든다. 여러 곳에서 쓰면 `src/styles/variants.css.ts`, 한 컴포넌트 전용이면 그 컴포넌트의 `css.ts`에 둔다.
4. **레이아웃은 `Range`로** 조합한다. 필요한 width/gap 값이 없으면 `variants.css.ts`에 추가한다.
5. **픽셀 콘셉트 유지**: 그림자는 블러 0, 모서리는 기본 직각, 포인트 컬러는 `blue1` 계열 하나.
6. **한글에 Silkscreen을 쓰지 않는다.** Noto Sans KR은 상속으로 받고, `fontFamily`로 다시 지정하지 않는다.
7. FSD 레이어를 지킨다: 범용 UI는 `shared/ui`, 도메인 UI(Card, TagContainer)는 `entities/*/ui`.

---

## 7. 성능 (Lighthouse 개선기)

홈을 서버 렌더링으로 바꾼 뒤 운영 기준 성능 점수가 모바일 73 → 80, 데스크톱 90 → 99로 올랐다(2026-10-10, Lighthouse 13.5.0, 각 3회 중앙값). 전체 과정은 [NextGacha 홈 Lighthouse 성능 개선기](https://claude.ai/artifact/AJwELvDd4CfWtdDK121yNe)에 있다.

| 지표 | 모바일 전 | 모바일 후 | 데스크톱 전 | 데스크톱 후 |
|---|---|---|---|---|
| 성능 점수 | 73 | **80** (78~91) | 90 | **99** (98~100) |
| LCP (시뮬레이션) | 4.1s | 3.6s | 0.8s | 0.6s |
| LCP (실측) | 3.28s | **1.78s** | 0.89s | 0.98s |
| CLS | 0.13 | **0.001** | 0.152 | **0.007** |
| Speed Index | 7.9s | 7.0s | 1.8s | 1.0s |

### 7.1 바꾼 것

| 원인 | 수정 | 위치 |
|---|---|---|
| 홈이 클라이언트 컴포넌트라 JS 실행 후 `/api/getProduct`를 직렬 3회 호출 → LCP의 3.1s가 요청 전 대기 | 서버 컴포넌트로 전환, 세 섹션을 `Promise.all`로 동시 조회 | `views/HomePage.tsx`, `entities/product/lib/findProducts.ts` |
| 상품이 늦게 들어오며 "더보기" 버튼이 밀림 (CLS 0.13) | 서버 렌더링으로 첫 HTML에 상품 포함 | 위와 같음 |
| 배너 첫 장까지 `loading="lazy"` | 배너 프리셋 첫 장만 `priority` (preload) | `shared/ui/ReactSlick` |
| Noto Sans KR 400/500/700 세 벌 → `@font-face` 376개, CSS 73KB | `weight` 생략 = variable font 한 벌 → 128개, 24KB | `app/layout.tsx` |
| 예약 태그 월을 서버(UTC)와 브라우저(KST)가 다르게 그림 → hydration 에러 #418 | `toKoreaTime`으로 양쪽 KST 기준 | `shared/lib/koreaTime.ts`, `TagContainer` |

### 7.2 UI를 만들 때 지킬 것

1. **첫 화면 목록은 서버에서 그린다.** 클라이언트 `useEffect` fetch로 채우면 LCP와 CLS가 같이 나빠진다. 조회는 공용 서버 함수로 둔다(서버 컴포넌트에서 자기 `/api`를 fetch하지 않는다).
2. **첫 화면 대표 이미지 하나만 `priority`.** 나머지는 lazy 그대로 둔다.
3. **Noto Sans KR에 `weight` 배열을 넣지 않는다.** 굵기는 variable font로 `fontWeight`만 바꾼다.
4. **날짜 표시는 `toKoreaTime`으로.** 서버와 브라우저 시간대가 달라 `dayjs(date).format()`을 바로 쓰면 hydration 불일치가 난다.
5. **늦게 들어오는 콘텐츠 아래 요소는 자리를 미리 잡는다.** 버튼·섹션이 밀리면 CLS가 된다.

### 7.3 시도했다가 되돌린 것

- `experimental.inlineCss`: 폰트 `@font-face` 231KB가 HTML에 들어가고 RSC payload에 한 번 더 실려 HTML이 583KB가 됐다. 모바일 LCP 8s대.
- `images.formats`에 AVIF 추가: 로컬 이미지 최적화기가 인코딩을 끝내지 못해 Lighthouse가 45초 타임아웃.

### 7.4 남은 한계

모바일 점수는 코드보다 레이아웃에 막혀 있다. 1312px 고정폭이 모바일에서 축소되어 상품 이미지 약 17장과 배너 4장이 모두 첫 화면으로 계산되고, LCP 요소가 아래쪽 lazy 상품 카드가 된다. 그래서 모바일 버전을 고려하고 있다([3.4 모바일 대응](#34-모바일-대응-계획)).

---

## 알려진 불일치

정리 우선순위가 높은 순서다. 모두 동작에는 문제가 없거나 사소한 시각 차이만 있다.

| # | 내용 | 위치 | 제안 |
|---|---|---|---|
| 1 | `fontFamily: 'notosans'` / `'Noto Sans Kr'`가 next/font 해시 이름과 달라 **시스템 폰트로 렌더**됨 | `features/review-write/ui/reviewModal.css.ts:12`, `features/search/ui/search.css.ts:13`, `widgets/QnaTemplate/qnaTemplate.css.ts:24` | 해당 줄 삭제 (상속) |
| 2 | `vars.status.*` 미사용, 태그 색이 `TagContainer`에 hex로 하드코딩 | `entities/product/ui/TagContainer.tsx` | `vars.status.new` 등으로 교체 |
| 3 | `#75C3FE`가 토큰 대신 hex로 11회 쓰임 | event, checkout, buyBtn, card, qnaTemplate, productManageCard | `vars.color.blue1` |
| 4 | 테두리 `1px solid lightgray` 25회 (`gray1`=`#D9D9D9`와 거의 같은 `#D3D3D3`) | 다수 | `vars.color.gray1`로 통일 |
| 5 | 파랑 보조색 5종(`#3AAAFF` `#99D3FF` `#BFE3FF` `#DDF0FD` `#D3EEFF`)이 토큰 없이 흩어짐 | 1.2 참고 | `blue0`/`blue2`/`blueLight`/`blueBg` 토큰화 |
| 6 | `fontFamily: 'silkScreen'` 대소문자 표기 다름 (CSS상 동작은 같음) | `shared/ui/Btn/btn.css.ts:10` | `'silkscreen'`로 통일 |
| 7 | `globals.css`의 `--border-color` 미사용 | `src/app/globals.css` | 삭제 |
| 8 | 반응형 없음: 1314px 고정, 모바일에서 축소 표시 (모바일 Lighthouse 80점의 주 원인) | 전역 | 모바일 버전 고려 중. [3.4](#34-모바일-대응-계획) 순서로 진행 |
| 9 | Silkscreen Bold가 `.ttf` (Regular는 woff2) | `public/fonts/Silkscreen-Bold.ttf` | woff2로 변환 |
