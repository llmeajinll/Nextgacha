// Header는 서버 전용(auth·DB 조회)이라 여기서 내보내지 않는다. 클라이언트 컴포넌트가 이 barrel을 import하면
// Header를 따라 mongodb가 브라우저 번들에 들어가 빌드가 깨진다 → `@/widgets/Header/Header`로 직접 import
export { default as Banner } from './Banner/Banner';
export { default as Footer } from './Footer/Footer';
export { default as DetailTab } from './DetailTab/DetailTab';
export { default as ManagerMenu } from './ManagerMenu/ManagerMenu';
export { default as CardTemplate } from './CardTemplate/CardTemplate';
export { default as CartTemplate } from './CartTemplate/CartTemplate';
export { default as OrderTemplate } from './OrderTemplate/OrderTemplate';
export { default as QnaTemplate } from './QnaTemplate/QnaTemplate';
export { default as NoticeTemplate } from './NoticeTemplate/NoticeTemplate';
export { default as ManagerHeader } from './ManagerHeader/ManagerHeader';
export { default as ManagerSideMenu } from './ManagerSideMenu/ManagerSideMenu';
export { default as ErrorTemplate } from './ErrorTemplate/ErrorTemplate';
export { default as MobileNav } from './MobileNav/MobileNav';
export { default as MypageTabs } from './MypageTabs/MypageTabs';
export { default as FloatingActions } from './FloatingActions/FloatingActions';
