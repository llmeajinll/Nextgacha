import type { CategoryMenu } from '../model/types';

// 카테고리 메뉴 → 드롭다운 옵션 (그룹 이름 포함). 관리자 상품 등록·이벤트 화면이 같이 쓴다
export function categoryOptions(menu: CategoryMenu | undefined) {
  if (!menu) return [];
  return [
    ...menu.character.map((v) => ({ value: v, label: v, group: '캐릭터' })),
    ...menu.ani.map((v) => ({ value: v, label: v, group: '애니메이션' })),
    ...menu.series.flatMap((m) => m.items.map((v) => ({ value: v, label: v, group: `시리즈 · ${m.name}` }))),
    ...menu.groups.flatMap((m) => m.items.map((v) => ({ value: v, label: v, group: m.name }))),
  ];
}
