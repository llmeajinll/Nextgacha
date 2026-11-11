import UserManager from '@/features/user-manage/ui/UserManager';
import { findUsersForAdmin } from '@/features/user-manage/lib/findUsersForAdmin';
import * as s from '../error/page.css';

// 서버 컴포넌트에서 자기 API를 fetch하면 쿠키가 없어 관리자 API가 403 → DB 직접 조회
export const dynamic = 'force-dynamic';

export default async function UserPage() {
  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <span className={s.eyebrow}>USERS</span>
        <h1 className={s.title}>사용자 관리</h1>
        <p className={s.subText}>카카오로 가입한 회원을 찾아 주문·포인트·보유 수량을 확인해요.</p>
      </section>
      <UserManager users={await findUsersForAdmin()} />
    </div>
  );
}
