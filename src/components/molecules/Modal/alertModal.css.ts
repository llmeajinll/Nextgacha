import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const backgroundStyle = style({
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
});

export const modalContainer = style({
  width: 'fit-content',
  position: 'fixed',
  minWidth: '300px',
  top: '170px',
  right: '50%',
  backgroundColor: 'white',
  transform: 'translate(50%, 0%)',
  border: `3px solid ${vars.color.blue1}`,
  boxShadow: '5px 5px 0px 0px #3aaaff',
});
export const alertText = style({
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold',
  fontFamily: 'silkscreen',
  margin: '7px 0px 0px 8px',
});
export const closeBtn = style({
  backgroundImage: `url('/images/closeBtn.png')`,
  backgroundSize: '100%',
  backgroundColor: 'transparent',
  width: '35px',
  height: '35px',
  border: 'none',
  cursor: 'pointer',
  margin: '4px 4px 0px 0px',
});

export const modalBtn = style({
  width: 'fit-content',
  border: 'none',
  fontFamily: 'silkscreen',
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  //   backgroundColor: vars.color.blue1,
  backgroundColor: '#99D3FF',
  padding: '2px 5px 4px 5px',
  cursor: 'pointer',
  borderLeft: '4px solid #BFE3FF',
  borderTop: '4px solid #BFE3FF',
  boxShadow: `4px 4px 0px 0px ${vars.color.blue1}`,
});

export const messageText = style({
  textAlign: 'center',
  marginBottom: '20px',
  fontWeight: '450',
  fontSize: '18px',
  color: vars.color.black1,
  letterSpacing: '-0.5px',
});
