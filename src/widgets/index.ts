// Header는 서버 전용(auth·DB 조회)이라 여기서 내보내지 않는다. 클라이언트 컴포넌트가 이 barrel을 import하면
// Header를 따라 mongodb가 브라우저 번들에 들어가 빌드가 깨진다 → `@/widgets/Header/Header`로 직접 import
export { default as Banner } from './Banner/Banner';
export { default as Footer } from './Footer/Footer';
export { default as DetailTab } from './DetailTab/DetailTab';
export { default as ManagerMenu } from './ManagerMenu/ManagerMenu';
export { default as SearchResults } from './SearchResults/SearchResults';
export { default as CartCheckout } from './CartCheckout/CartCheckout';
export { default as ProductQna } from './ProductQna/ProductQna';
export { default as NoticeBoard } from './NoticeBoard/NoticeBoard';
export { default as ManagerHeader } from './ManagerHeader/ManagerHeader';
export { default as ManagerSideMenu } from './ManagerSideMenu/ManagerSideMenu';
export { default as MobileNav } from './MobileNav/MobileNav';
export { default as MypageTabs } from './MypageTabs/MypageTabs';
export { default as FloatingActions } from './FloatingActions/FloatingActions';
export { default as LikeList } from './LikeList/LikeList';
export { default as OrderHistory } from './OrderHistory/OrderHistory';
export { default as ProductReviews } from './ProductReviews/ProductReviews';
export { default as ProductPurchasePanel } from './ProductPurchasePanel/ProductPurchasePanel';
