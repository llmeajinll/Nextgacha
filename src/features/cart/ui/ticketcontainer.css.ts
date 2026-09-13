import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const ticketContainer = style({
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
