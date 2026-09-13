import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const headerContainer = style({
  position: 'relative',
  //   backgroundColor: 'red',
  width: 1314,
  borderBottom: `1px solid ${vars.color.gray1}`,
});

export const reportContainer = style({
  position: 'fixed',
  display: 'flex',
  // alignItems: 'center',
  width: 'fit-content',
  zIndex: '20',
  right: 0,
  top: 60,
});

export const wrapTextarea = style({
  boxSizing: 'border-box',
  padding: '10px',
  width: 'fit-content',
  border: `3px solid ${vars.color.blue1}`,
  borderRight: `3px solid ${vars.color.blue1}`,
  backgroundColor: '#ddf0fd',
});

export const menuContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  width: 980,
  height: 60,
  margin: '0 auto',
  fontFamily: 'silkscreen',
  color: vars.color.black1,
});

export const logo = style({
  height: 35,
  fontSize: 24,
  letterSpacing: -1.2,
  marginRight: 20,
  cursor: 'pointer',
});

export const menu = style({
  height: '60px',
  marginLeft: 20,
  fontSize: 14,
  letterSpacing: -0.7,
  lineHeight: '60px',
  cursor: 'pointer',
  backgroundColor: 'white',
  border: 'none',
  fontFamily: 'silkscreen',
  color: vars.color.black1,
});

export const wrap = style({
  position: 'relative',
  width: 'fit-content',
  display: 'flex',
  alignItems: 'center',
});

export const search = style({
  width: 300,
  height: 31,
  borderRadius: 35,
  border: `2px solid ${vars.color.gray1}`,
});

export const overlay = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.3s ease',
});

export const overlayShow = style({
  opacity: 1,
  pointerEvents: 'auto',
});

export const drawer = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: 280,
  height: '100%',
  background: '#fff',
  transform: 'translateX(-100%)',
  transition: 'transform 0.3s ease',
});

export const drawerOpen = style({
  transform: 'translateX(0)',
});
