import OrderTemplate from '@/widgets/OrderTemplate/OrderTemplate';
import { findOrdersByStatus } from '@/features/order-manage/lib/findOrdersByStatus';

// 서버 컴포넌트에서 자기 API를 fetch하면 쿠키가 없어 관리자 API가 403 → DB 직접 조회
export const dynamic = 'force-dynamic';

export default async function SendingPage() {
  const { result, nextCursor } = await findOrdersByStatus('배송중');

  return (
    <div>
      <OrderTemplate props={result} getLastId={nextCursor} status='배송중' />
    </div>
  );
}
