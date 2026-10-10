import ManagerMenu from '@/widgets/ManagerMenu/ManagerMenu';
import { pagePadding } from './page.css';

export default function Page() {
  return (
    <div className={pagePadding}>
      <h1>관리자 페이지</h1>
      <ManagerMenu />
    </div>
  );
}
