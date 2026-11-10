import { redirect } from 'next/navigation';
import OrderTemplate from '@/widgets/OrderTemplate/OrderTemplate';
import { countOrdersByStatus, findOrdersByStatus } from '@/features/order-manage/lib/findOrdersByStatus';
import { ORDER_PAGE_SIZE } from '@/features/order-manage/model/status';

// 서버 컴포넌트에서 자기 API를 fetch하면 쿠키가 없어 관리자 API가 403 → DB 직접 조회
export const dynamic = 'force-dynamic';

export default async function CheckPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(Number((await searchParams).page) || 1, 1);
  const [{ result, total }, counts] = await Promise.all([findOrdersByStatus('상품 확인중', page), countOrdersByStatus()]);

  // 처리해서 마지막 페이지가 비면 그 앞 페이지로
  const lastPage = Math.max(Math.ceil(total / ORDER_PAGE_SIZE), 1);
  if (page > lastPage) redirect(`/manager/order/check?page=${lastPage}`);

  return <OrderTemplate status='상품 확인중' orders={result} total={total} page={page} counts={counts} />;
}
