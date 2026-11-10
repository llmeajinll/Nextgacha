import { Box, Bug, Folder, Gift, PlusBox, Truck, Users } from 'pixelarticons/react';

// 관리자 사이드 메뉴·대시보드 카드 공용. base: 하위 경로까지 선택 표시할 기준
export const MANAGER_MENUS = [
  { href: '/manager/product_add', base: '/manager/product_add', ko: '상품 추가', en: 'ADD PRODUCT', icon: PlusBox, desc: '새 캡슐토이 상품을 등록하고 이미지·가격·태그를 설정합니다.' },
  { href: '/manager/product_manage', base: '/manager/product_manage', ko: '상품 관리', en: 'PRODUCTS', icon: Box, desc: '등록된 상품을 찾아 수정하고 품절·예약 상태를 바꿉니다.' },
  { href: '/manager/category', base: '/manager/category', ko: '카테고리 관리', en: 'CATEGORIES', icon: Folder, desc: '쇼핑몰 헤더의 캐릭터·애니·시리즈 메뉴 항목을 추가하거나 지웁니다.' },
  { href: '/manager/order/check', base: '/manager/order', ko: '주문 관리', en: 'ORDERS', icon: Truck, desc: '들어온 주문을 확인하고 배송 상태를 처리합니다.' },
  { href: '/manager/event', base: '/manager/event', ko: '이벤트 관리', en: 'EVENTS', icon: Gift, desc: '기획전 이벤트를 만들고 진행 기간을 관리합니다.' },
  { href: '/manager/error', base: '/manager/error', ko: '오류 신고 수집', en: 'ERROR REPORTS', icon: Bug, desc: '사용자가 헤더 제보창으로 보낸 오류 신고를 모아 확인합니다.' },
  { href: '/manager/user', base: '/manager/user', ko: '사용자 관리', en: 'USERS', icon: Users, desc: '가입한 회원을 조회하고 권한과 계정 상태를 관리합니다.' },
];
