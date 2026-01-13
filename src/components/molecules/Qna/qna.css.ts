import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { writerStyle } from '@/components/atoms/Writer/writer.css';

export const leftContent = style({
  fontSize: '14px',
  lineHeight: '24px',
  backgroundColor: vars.color.blue1,
  color: 'white',
  padding: '4px 12px 6px 14px',
  borderRadius: '50px',
  borderTopRightRadius: '0px',
  marginTop: '0px',
});

export const rightContent = style({
  fontSize: '14px',
  lineHeight: '24px',
  backgroundColor: 'white',
  color: vars.color.blue1,
  padding: '4px 12px 6px 12px',
  borderRadius: '50px',
  borderTopLeftRadius: '0px',
  marginTop: '4px',
  border: `1px solid ${vars.color.blue1}`,
});

export const masterName = style({
  fontSize: '14px',
  fontFamily: 'silkscreen',
  lineHeight: '18px',
  color: vars.color.blue1,
  marginRight: '6px',
});

export const qnaContainer = style({
  width: '100%',
  border: `1px solid ${vars.color.gray1}`,
  padding: '10px 12px',
  boxSizing: 'border-box',
});

export const question = style({
  fontFamily: 'silkscreen',
  paddingTop: '0px',
  color: vars.color.blue1,
  fontSize: '24px',
  fontWeight: 'bold',
});

export const showBtn = style({
  backgroundColor: 'transparent',
  border: 'none',
  fontFamily: 'silkscreen',
  color: vars.color.blue1,
  padding: '0',
  cursor: 'pointer',
  height: '25px',
  marginRight: 'auto',
  marginTop: '10px',
});

export const scrollRange = style({
  boxSizing: 'border-box',
  maxHeight: '210px',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '3px',
  width: '100%',
  // backgroundColor: '#d3eeffff',

  selectors: {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#ccc',
      borderRadius: '3px',
    },
  },
});
export const wrapRequestInput = style({
  width: '100%',
  border: '1px solid lightgray',
  marginTop: '10px',
});

export const requestInputStyle = style({
  width: 'calc(100% - 150px)',
  height: '40px',
  borderRadius: '0px',
  color: vars.color.black2,
  paddingLeft: '10px',
  border: 'none',
  outline: 'none',
  fontSize: '15px',
});

export const postBtn = style({
  width: '60px',
  height: '36px',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: vars.color.blue1,
  color: 'white',
  fontSize: '16px',
  margin: '3px 3px 0 0',
  fontFamily: 'silkscreen',
});

export const countLength = style({
  fontFamily: 'silkscreen',
  fontSize: '14px',
  width: '90px',
  height: '42px',
  lineHeight: '40px',
  textAlign: 'center',
});

export const qnaDeleteBtn = style([
  writerStyle,
  {
    backgroundColor: 'transparent',
    border: 'none',
    height: '25px',
    cursor: 'pointer',
  },
]);

export const editQuestionInput = style({
  fontSize: '16px',
  color: vars.color.black2,
  width: '875px',
  border: '1px solid lightgray',
  padding: '7px 10px 3px 10px',
  outline: 'none',
});
