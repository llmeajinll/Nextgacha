import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    gray1: '#d9d9d9',
    black1: '#6F6F6F',
    black2: '#4C4C4C',
    black3: '#999999',
    blue1: '#75C3FE',
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
