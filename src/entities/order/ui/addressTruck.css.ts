import { createVar, style } from '@vanilla-extract/css';

export const truckWidthVar = createVar();

export const truckBody = style({
  position: 'relative',
  width: truckWidthVar,
  minWidth: '245px',
});

export const truckBg = style({
  width: '100%',
  height: '70px',
});

export const addressText = style({
  boxSizing: 'border-box',
  position: 'absolute',
  width: '100%',
  top: 0,
  height: '50px',
  padding: '12px 10px 10px 10px',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center',
});

export const placeholder = style({
  color: '#3aaaff',
});
