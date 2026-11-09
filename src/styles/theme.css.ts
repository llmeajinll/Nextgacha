import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    gray1: '#d9d9d9',
    black1: '#6F6F6F',
    black2: '#4C4C4C',
    black3: '#999999',
    blue1: '#75C3FE',
  },
  // blue1과 같은 색상(206°)에 회색/검정을 섞은 단계. 흰 글자 대비 4.5:1 이상은 600+ (ink는 500+)
  slate: {
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
