import { redirect } from 'next/navigation';
import { ErrorTemplate } from '@/widgets';
import { findErrors } from '@/features/error-manage/lib/findErrors';
import { ERROR_PAGE_SIZE, ERROR_STATUSES, ERROR_TYPES } from '@/features/error-manage/model/types';
import * as s from './page.css';

// 서버 컴포넌트에서 자기 API를 fetch하면 쿠키가 없어 관리자 API가 403 → DB 직접 조회
export const dynamic = 'force-dynamic';

type Search = { status?: string; type?: string; page?: string };

export default async function ErrorPage({ searchParams }: { searchParams: Promise<Search> }) {
  const q = await searchParams;
  const status = ERROR_STATUSES.find((x) => x.slug === q.status) ?? ERROR_STATUSES[0];
  const type = ERROR_TYPES.find((x) => x.type === q.type)?.type ?? 'all';
  const page = Math.max(Number(q.page) || 1, 1);

  const { result, total, counts, paymentOpen } = await findErrors(status.status, type, page);

  // 처리해서 마지막 페이지가 비면 그 앞 페이지로
  const lastPage = Math.max(Math.ceil(total / ERROR_PAGE_SIZE), 1);
  if (page > lastPage) redirect(`/manager/error?status=${status.slug}&type=${type}&page=${lastPage}`);

  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <span className={s.eyebrow}>ERRORS</span>
        <h1 className={s.title}>오류 신고 수집</h1>
        <p className={s.subText}>
          사용자 제보와 시스템 에러를 확인하고 처리 상태를 바꿔요. 결제 관련 기록은 장애 대응 순서대로 바로 처리해요.
        </p>
      </section>
      <ErrorTemplate
        status={status.status}
        type={type}
        errors={result}
        total={total}
        page={page}
        counts={counts}
        paymentOpen={paymentOpen}
      />
    </div>
  );
}
