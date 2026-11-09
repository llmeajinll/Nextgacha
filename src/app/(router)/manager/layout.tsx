import { ManagerHeader, ManagerSideMenu } from '@/widgets';
import * as s from './layout.css';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.page}>
      <ManagerHeader />
      <div className={s.body}>
        <ManagerSideMenu />
        <main className={s.main}>{children}</main>
      </div>
    </div>
  );
}
