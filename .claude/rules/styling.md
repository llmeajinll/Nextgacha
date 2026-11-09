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

## 토큰 (`src/styles/theme.css.ts`의 `vars`)

- 기존 색: `vars.color.*` (gray1, black1~3, blue1), 상품 상태색: `vars.status.*`, 글꼴 프리셋: `vars.font.*`
- 블루 그레이 `vars.slate[50~900]`, 블루 블랙 `vars.ink[50~900]`: 흰 글자를 올릴 배경은 slate 600 이상, ink 500 이상 (대비 4.5:1)
- 픽셀 폰트는 `fontFamily: 'silkscreen'` (`globals.css`의 @font-face)

## 함정

- theme에 `globalStyle('div', { color: vars.color.black2 })`가 있어서 **div는 부모의 color를 상속하지 않는다.**
  부모에 색을 주면 그 아래 div가 전부 black2로 덮인다. 컨테이너 단위로 상속을 되살린다:
  `globalStyle(\`${container} div\`, { color: 'inherit' })`
- `a`는 전역에서 `color: inherit`, 밑줄 없음.
