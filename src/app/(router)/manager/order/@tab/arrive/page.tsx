import { redirect } from 'next/navigation';
import OrderTemplate from '@/widgets/OrderTemplate/OrderTemplate';
import { countOrdersByStatus, findOrdersByStatus } from '@/features/order-manage/lib/findOrdersByStatus';
import { ORDER_PAGE_SIZE } from '@/features/order-manage/model/status';

// 서버 컴포넌트에서 자기 API를 fetch하면 쿠키가 없어 관리자 API가 403 → DB 직접 조회
export const dynamic = 'force-dynamic';

export default async function ArrivePage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const q = String(params.q ?? '').trim();
  const [{ result, total }, counts] = await Promise.all([findOrdersByStatus('배송 완료', page, q), countOrdersByStatus()]);

  // 처리해서 마지막 페이지가 비면 그 앞 페이지로
  const lastPage = Math.max(Math.ceil(total / ORDER_PAGE_SIZE), 1);
  if (page > lastPage) redirect(`/manager/order/arrive?${new URLSearchParams({ page: String(lastPage), ...(q && { q }) })}`);

  return <OrderTemplate status='배송 완료' orders={result} total={total} page={page} counts={counts} q={q} />;
}
