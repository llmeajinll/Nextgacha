import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const cartContainer = style({
  // backgroundColor: 'red',
  border: `1px solid ${vars.color.gray1}`,
});

export const ticketContainer = style({
  display: 'flex',
  width: '1040px',
  maxWidth: '1070',
  overflowX: 'auto',

  scrollbarWidth: 'thin',

  scrollbarColor: 'rgba(0,0,0,0.3) transparent',

  selectors: {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(0, 0, 0, 0.5)',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
});
