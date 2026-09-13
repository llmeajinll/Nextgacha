import { style } from '@vanilla-extract/css';

export const pageContainer = style({
  width: '900px',
  padding: '10px 30px 40px 30px',
  margin: '40px auto 0 auto',
  border: '4px solid #75C3FE',
});

export const heading = style({
  color: '#3AAAFF',
});

export const labelInline = style({
  display: 'inline-block',
  width: '100px',
});

export const fieldLabel = style([
  labelInline,
  {
    fontWeight: '500',
    color: '#4C4C4C',
  },
]);

export const fieldValue = style({
  color: '#6F6F6F',
});

export const productItem = style({
  marginRight: '15px',
  fontSize: '14px',
});

export const footerRow = style({
  margin: '30px auto 0 auto',
});

export const footerLinkHome = style({
  fontFamily: 'silkscreen',
  color: '#75C3FE',
});

export const footerLinkMypage = style({
  fontFamily: 'silkscreen',
  color: '#999999',
});
