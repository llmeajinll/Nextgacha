import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const btnWidthVar = createVar();

export const wrapper = style({
  position: 'relative',
  width: '100%',
});

export const blockBtn = style({ display: 'flex', width: '100%' });

export const dynamicWidthBtn = style({
  width: fallbackVar(btnWidthVar, '100%'),
});

export const tooltipWrap = style({
  position: 'absolute',
  left: '50%',
  paddingTop: '6px',
  transform: 'translate(-50%, 0)',
  zIndex: 10,
});

export const centerFit = style({
  width: 'fit-content',
  textAlign: 'center',
});

export const tooltipBox = style([
  centerFit,
  {
    backgroundColor: 'white',
    border: '1px solid lightgray',
    padding: '10px',
  },
]);

export const warningTitle = style({
  fontSize: '20px',
  marginBottom: '5px',
  fontWeight: 500,
});

export const noAddressText = style({
  color: vars.color.black3,
});

export const searchLink = style({
  marginLeft: '5px',
  color: vars.color.blue1,
  cursor: 'pointer',
});

export const detailAddressWrap = style({
  marginTop: '8px',
});

export const detailAddressInput = style({
  width: '400px',
  padding: '8px',
  border: '1px solid lightgray',
  fontSize: '14px',
});

export const updateBtn = style({
  backgroundColor: vars.color.blue1,
  color: 'white',
  cursor: 'pointer',
  padding: '5px 0',
  marginTop: '8px',
});
