import { category } from './category';
import type { CategoryMenu } from '../model/types';

// 관리자 화면에서 한 번도 저장하지 않았을 때 쓰는 기본 메뉴 (기존 category.js 값)
export const DEFAULT_CATEGORY_MENU: CategoryMenu = {
  character: category.character,
  ani: category.ani,
  series: [
    { company: 'BANDAI', name: '반다이', items: category.series.BANDAI },
    { company: 'TOMY', name: '토미', items: category.series.TOMY },
    { company: 'STANDSTONES', name: 'STANDSTONES', items: category.series.STANDSTONES },
    { company: 'ETC', name: '기타', items: category.series.ETC },
  ],
  groups: [],
};
