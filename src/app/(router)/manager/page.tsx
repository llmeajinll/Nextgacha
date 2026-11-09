import { auth } from '@/auth';
import { isAdminEmail } from '@/shared/lib/isAdmin';
import { koreaTime } from '@/shared/lib/koreaTime';
import { errorColl, orderColl, productColl } from '@/shared/api/mongodb';
import ManagerMenu, { type ManagerSummary } from '@/widgets/ManagerMenu/ManagerMenu';

// /manager는 공개 페이지라 요약 숫자는 관리자에게만 조회해서 보여줌
async function getSummary(): Promise<ManagerSummary | null> {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) return null;

  // created_at은 'YYYY-MM-DD HH:mm:ss'(KST) 문자열 → 오늘 날짜 문자열과 사전순 비교
  const today = koreaTime().slice(0, 10);
  const [todayOrders, pendingOrders, onSale, todayErrors] = await Promise.all([
    orderColl.countDocuments({ created_at: { $gte: today } }),
    orderColl.countDocuments({ status: '상품 확인중' }),
    productColl.countDocuments({ 'list.count': { $gt: 0 } }),
    errorColl.countDocuments({ created_at: { $gte: today } }),
  ]);
  return { todayOrders, pendingOrders, onSale, todayErrors };
}

export default async function Page() {
  return <ManagerMenu summary={await getSummary()} />;
}
