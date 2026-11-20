import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const pageContainer = style({
  width: '900px',
  padding: '10px 30px 40px 30px',
  margin: '40px auto 0 auto',
  border: `4px solid ${vars.color.blue1}`,
});

export const heading = style({
  color: vars.color.blue2,
});

export const labelInline = style({
  display: 'inline-block',
  width: '100px',
});

export const fieldLabel = style([
  labelInline,
  {
    fontWeight: '500',
    color: vars.color.black2,
  },
]);

export const fieldValue = style({
  color: vars.color.black1,
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
  color: vars.color.blue1,
});

export const footerLinkMypage = style({
  fontFamily: 'silkscreen',
  color: vars.color.black3,
});

export const messageText = style([
  fieldValue,
  { fontSize: '18px', marginBottom: '40px' },
]);
