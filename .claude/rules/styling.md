---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css.ts"
---

# 스타일링 (Vanilla Extract)

- 모든 스타일은 컴포넌트 옆의 `*.css.ts` 파일에 둔다 (`Component.tsx` + `component.css.ts`).
  inline `style={}`나 런타임 CSS-in-JS 라이브러리는 새로 쓰지 않는다
  (`refactor: inline style -> css.ts 전환` 시리즈, 커밋 `8e85773`..`f1e8ca5`).
- 값에 따라 스타일이 바뀌면 inline style 대신 `styleVariants`를 쓴다
  (예: `widgets/ManagerMenu/managerMenu.css.ts`의 `tileTone`).
- 공용 variant(버튼 크기, 색, 폭, gap, flex 방향/정렬)는 `src/styles/variants.css.ts`에 이미 있으니 먼저 찾아본다.
- 관리자 화면의 버튼·탭·칩·태그는 `src/styles/ui.css.ts`(디자인 캔버스 "버튼 정리 · 탭 정리 · 태그 정리")를
  조합해서 쓴다: `style([btn, btnSize.s, btnKind.neutral])`, `style([tag, tagTone.warning])`, 탭은 `tab`/`utab`/`chip`/`ltab`.
  새 버튼 모양을 따로 만들지 않는다. `Btn`은 `kind`(+`scale`, `px`)를 주면 같은 규칙을 따른다.

## 토큰 (`src/styles/theme.css.ts`의 `vars`)

- 색 값은 디자인 캔버스 "컬러 팔레트"(tokens.css)와 같다. hex를 직접 쓰지 말고 토큰을 쓴다.
- `vars.color.*`: 브랜드 블루(blueBg, blueLight, blue0, blue1, blue2, blueInk, navy, blueTint, blueTint2, overlay)와
  쇼핑몰 회색(gray1, black1~3 — 값은 슬레이트로 바뀜). 상품 상태색: `vars.status.*`, 글꼴 프리셋: `vars.font.*`
- 상태색 `vars.tone.{info,success,warning,danger,soldout}.{bg,1,2}`: bg 배경 · 1 글자/아이콘/채움 · 2 테두리/hover
- 블루 그레이 `vars.slate[50~900]`, 블루 블랙 `vars.ink[50~900]`: 흰 글자를 올릴 배경은 slate 600 이상, ink 500 이상 (대비 4.5:1)
- 픽셀 폰트는 `fontFamily: 'silkscreen'` (`globals.css`의 @font-face)

## 함정

- theme에 `globalStyle('div', { color: vars.color.black2 })`가 있어서 **div는 부모의 color를 상속하지 않는다.**
  부모에 색을 주면 그 아래 div가 전부 black2로 덮인다. 컨테이너 단위로 상속을 되살린다:
  `globalStyle(\`${container} div\`, { color: 'inherit' })`
- `a`는 전역에서 `color: inherit`, 밑줄 없음.
