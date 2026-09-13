import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const sectionHeightVar = createVar();

export const receiptWrap = style({
  position: 'relative',
  width: '310px',
});

export const stampImg = style({
  position: 'absolute',
  top: '20px',
  left: '10px',
  opacity: 0.4,
});

export const sectionOuter = style({
  position: 'relative',
  width: '310px',
  height: sectionHeightVar,
});

const innerPadBase = style({
  position: 'absolute',
  width: '100%',
  boxSizing: 'border-box',
});

export const innerPadTop = style([innerPadBase, { padding: '20px 12px 0 12px' }]);
export const innerPadMiddle = style([
  innerPadBase,
  { padding: '10px 15px 0 12px' },
]);
export const innerPadBottom = style([
  innerPadBase,
  { padding: '10px 12px 0 12px' },
]);

export const imageStyle = style({
  border: `1px solid ${vars.color.gray1}`,
});

// export const bigLabelTitle = style({
//   boxSizing: 'border-box',
//   color: vars.color.black1,
//   fontSize: '20px',
// });

export const Title = style({
  boxSizing: 'border-box',
  color: vars.color.black1,
  fontSize: '20px',
});

export const contentStyle = style({
  color: vars.color.black1,
});

export const reviewBtn = style({
  backgroundColor: vars.color.blue1,
  width: '100%',
  color: 'white',
  border: 'none',
  textAlign: 'center',
  padding: '8px 12px',
  cursor: 'pointer',
  fontFamily: 'silkscreen',
  fontSize: '16px',
  marginTop: '40px',
});

const receiptBaseLabelProps = {
  fontSize: '13px',
  letterSpacing: '-1.3px',
  lineHeight: '18px',
  color: '#4E4E4E',
};

export const labelTitle = style({
  ...receiptBaseLabelProps,
  fontFamily: 'silkscreen_bold',
});

export const labelContent = style({
  ...receiptBaseLabelProps,
  textAlign: 'left',
  fontFamily: 'silkscreen',
});

export const labelContentKor = style({
  ...receiptBaseLabelProps,
  textAlign: 'left',
  width: '190px',
});

export const listContainer = style({
  marginTop: '15px',
});

export const title = style({
  fontSize: '15px',
  letterSpacing: '-1.5px',
  lineHeight: '18px',
  color: '#4E4E4E',
  fontWeight: '500',
});

export const contentContainer = style({
  marginTop: '8px',
});

export const count = style({
  ...receiptBaseLabelProps,
});

export const content = style({
  ...receiptBaseLabelProps,
  width: '200px',
});

export const bigLabelTitle = style({
  ...receiptBaseLabelProps,
  fontSize: '18px',
  fontFamily: 'silkscreen_bold',
  marginTop: '8px',
});

export const bigLabelContent = style({
  ...receiptBaseLabelProps,
  fontSize: '18px',
  fontFamily: 'silkscreen',
  marginTop: '6px',
});
