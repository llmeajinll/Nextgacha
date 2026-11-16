import { auth } from '@/auth';
import { isAdminEmail } from '@/shared/lib/isAdmin';
import { koreaTime } from '@/shared/lib/koreaTime';
import { errorColl, orderColl, productColl, qnaColl } from '@/shared/api/mongodb';
import { businessDaysBefore, ORDER_CONFIRM_DAYS, QNA_ANSWER_DAYS } from '@/shared/lib/businessDays';
import { kstString } from '@/shared/lib/kstString';
import ManagerMenu, { type ManagerSummary } from '@/widgets/ManagerMenu/ManagerMenu';

// /manager는 공개 페이지라 요약 숫자는 관리자에게만 조회해서 보여줌
async function getSummary(): Promise<ManagerSummary | null> {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) return null;

  // created_at은 'YYYY-MM-DD HH:mm:ss'(KST) 문자열 → 오늘 날짜 문자열과 사전순 비교
  const today = koreaTime().slice(0, 10);
  const [todayOrders, pendingOrders, onSale, todayErrors, overdueOrders, overdueQna] = await Promise.all([
    orderColl.countDocuments({ created_at: { $gte: today } }),
    orderColl.countDocuments({ status: '상품 확인중' }),
    productColl.countDocuments({ 'list.count': { $gt: 0 } }),
    errorColl.countDocuments({ created_at: { $gte: today } }),
    // 배송 처리 기한(3영업일)을 넘긴 주문. 다음 자동 환불(cron) 대상
    orderColl.countDocuments({ status: '상품 확인중', created_at: { $lt: businessDaysBefore(ORDER_CONFIRM_DAYS) } }),
    countOverdueQna(),
  ]);
  return { todayOrders, pendingOrders, onSale, todayErrors, overdueOrders, overdueQna };
}

// 답변 기한(2영업일)을 넘긴 미답변 문의: 마지막 글이 관리자 답변이 아니고, 그 글(없으면 질문)이 기한보다 오래됨
async function countOverdueQna() {
  const [row] = await qnaColl
    .aggregate<{ n: number }>([
      { $unwind: '$qna' },
      { $set: { last: { $last: { $ifNull: ['$qna.request', []] } } } },
      { $match: { 'last.writer': { $ne: 'master' } } },
      { $set: { since: { $ifNull: ['$last.created_at', '$qna.created_at'] } } },
      { $set: { since: kstString('$since') } },
      { $match: { since: { $lt: businessDaysBefore(QNA_ANSWER_DAYS), $ne: '' } } },
      { $count: 'n' },
    ])
    .toArray();
  return row?.n ?? 0;
}

export default async function Page() {
  return <ManagerMenu summary={await getSummary()} />;
}
