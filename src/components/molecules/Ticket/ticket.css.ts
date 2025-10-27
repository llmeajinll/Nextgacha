import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const ticketContainer = style({
  display: 'flex',
  boxSizing: 'border-box',
  position: 'relative',
  width: '320px',
  minWidth: '320px',
  height: '130px',
  backgroundImage: "url('/images/ticket.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '12px 24px 12px 25px',
  // flexDirection: 'column',
  justifyContent: 'space-between',

  selectors: {
    '&:not(:first-child)': {
      marginLeft: '-1px',
    },
  },
});

export const contentContainer = style({
  boxSizing: 'border-box',
  width: '202px',
  height: '108px',
  padding: '12px 8px',
});

export const character = style({
  whiteSpace: 'nowrap',
  width: '100%',
  height: '26px',
  fontSize: '20px',
  color: vars.color.black2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const title = style({
  whiteSpace: 'nowrap',
  width: '100%',
  fontSize: '15px',
  color: vars.color.black1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const countNumber = style({
  width: '30px',
  height: '30px',
  fontFamily: 'silkscreen',
  fontSize: '24px',
  lineHeight: '30px',
  textAlign: 'center',
  backgroundColor: 'white',
});
