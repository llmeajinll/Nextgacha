import { vars } from '@/styles/theme.css';
import { style, keyframes } from '@vanilla-extract/css';

export const panelTitle = style({
  marginBottom: 10,
  height: 42,
  fontSize: 18,
  letterSpacing: '-0.9px',
  lineHeight: '120%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  color: vars.color.black1,
});

export const ticketContainer = style({
  display: 'flex',
  width: '960px',
  maxWidth: '960px',
  marginBottom: '40px',
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

const fadeOutKeyframes = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
});

export const copyText = style({
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  height: 'fit-content',
  padding: '3px 8px 5px 8px',
  fontFamily: 'silkscreen',
  fontSize: '20px',
  left: '50%',
  top: '60%',
  backgroundColor: `${vars.color.blue1}`,
  color: 'white',
  zIndex: 10,
  animation: `${fadeOutKeyframes} 1.2s ease-out forwards`,
});
