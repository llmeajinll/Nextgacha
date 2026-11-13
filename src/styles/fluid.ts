// 모바일 글자 크기 (디자인 type-mobile.css): 390px 화면에서 n px, 화면 폭 따라 n±1px 안에서 늘고 준다
// *.css.ts는 함수를 export할 수 없어서 따로 둔다
export const fluid = (n: number) => `clamp(${n - 1}px, ${+(n / 3.9).toFixed(3)}vw, ${n + 1}px)`;
