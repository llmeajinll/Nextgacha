import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

// 색 토큰은 디자인 캔버스 "컬러 팔레트"(tokens.css)와 같은 값. 바꿀 때는 캔버스도 같이
export const vars = createGlobalTheme(':root', {
  color: {
    // 쇼핑몰 회색은 슬레이트 값으로 대체 (gray1=slate200, black1=slate600, black2=slate800, black3=slate400)
    gray1: '#D3DCE4',
    black1: '#546878',
    black2: '#2A3A47',
    black3: '#8EA0AF',
    // 브랜드 블루
    blueBg: '#DDF0FD', // 선택 메뉴·칩 배경, 아이콘 타일
    blueLight: '#BFE3FF', // 베벨 하이라이트, 포커스 그림자
    blue0: '#99D3FF',
    blue1: '#75C3FE', // 브랜드, 기본 버튼, 선택 테두리
    blue2: '#5BB8FE', // 하드 그림자, hover
    blueInk: '#1C6FB0', // 파란 글자
    navy: '#0E3A5C',
    blueTint: '#F2F9FF', // 선택된 행 배경
    blueTint2: '#F0F8FF', // 안내 박스 배경
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  // 상태색: bg(배경) · 1(글자·아이콘·채움) · 2(테두리·hover)
  tone: {
    info: { bg: '#EEF7FE', 1: '#75C3FE', 2: '#5BB8FE' },
    success: { bg: '#E3F8EA', 1: '#5ED98A', 2: '#45CF76' },
    warning: { bg: '#FFF6E5', 1: '#FFB547', 2: '#FFA62B' },
    danger: { bg: '#FFE5E7', 1: '#FE7680', 2: '#FE5B67' },
    soldout: { bg: '#E8EEF2', 1: '#A3B2BF', 2: '#8EA0AF' },
  },
  // blue1과 같은 색상(206°)에 회색/검정을 섞은 단계. 흰 글자 대비 4.5:1 이상은 600+ (ink는 500+)
  slate: {
    25: '#FAFBFC', // 페이지 바탕(50)보다 연한 hover 배경 (캔버스 팔레트에는 없음)
    50: '#F5F8FA',
    100: '#E8EEF2',
    200: '#D3DCE4',
    300: '#B6C3CE',
    400: '#8EA0AF',
    500: '#6B8294',
    600: '#546878',
    700: '#3E5160',
    800: '#2A3A47',
    900: '#19252E',
  },
  ink: {
    50: '#E8F4FC',
    100: '#C9E3F7',
    200: '#97C8ED',
    300: '#5FA6DD',
    400: '#3184C4',
    500: '#25699D',
    600: '#1C537D',
    700: '#133D5D',
    800: '#0B2A41',
    900: '#061928',
  },
  status: {
    soldout: '#DCDCDC',
    new: '#FFDFAB',
    hot: '#FFA5A5',
    reserve: '#BCE2FF',
    event: '#B9F0AE',
  },
  font: {
    cardTitle: {
      fontSize: '18px',
      letterSpacing: '-0.9px',
      lineHeight: '120%',
    },
    tagFont: {
      fontSize: '13px',
      letterSpacing: '-0.7px',
      lineHeight: '10px',
    },
  },
});

globalStyle('a', {
  textDecoration: 'none',
  color: 'inherit',
});

globalStyle('div', {
  color: `${vars.color.black2}`,
});
