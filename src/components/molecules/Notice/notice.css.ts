import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const noticeContainer = style({
  padding: '8px 20px',
  fontSize: '14px',
  boxSizing: 'border-box',
});

export const noticeNum = style({
  width: '58px',
  fontFamily: 'silkscreen',
});

export const noticeTitle = style({
  width: '759px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  ':hover': {
    textDecoration: 'underline',
  },
});

export const noticeCreateDate = style({
  width: '110px',
  fontFamily: 'silkscreen',
  fontSize: '12px',
  textAlign: 'right',
  lineHeight: '20px',
});
