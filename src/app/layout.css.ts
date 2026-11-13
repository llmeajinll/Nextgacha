import { style } from '@vanilla-extract/css';
import { mobile } from '@/styles/ui.css';

export const layoutContainer = style({
  width: '1314px',
  // maxWidth: '1314px',
  minWidth: '1314px',
  margin: '0 auto',
  padding: '0 0 50px 0',
});

export const relativeWrap = style({
  position: 'relative',
});

// /notice는 모바일까지 유연한 폭: 웹은 Header, 모바일은 MobileNav(위 로고 바 + 아래 탭 바)
export const fluidContainer = style({ width: '100%', maxWidth: 1314, margin: '0 auto' });

export const webOnly = style({ '@media': { [mobile]: { display: 'none' } } });

// 아래 탭 바(고정)에 본문이 가리지 않게
export const fluidMain = style({ '@media': { [mobile]: { paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' } } });
