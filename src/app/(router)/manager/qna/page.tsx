import QnaManager from '@/features/qna-manage/ui/QnaManager';
import { findQnaForAdmin } from '@/features/qna-manage/lib/findQnaForAdmin';
import * as s from '../error/page.css';
import { PageHeader } from '@/shared/ui';

// 서버 컴포넌트에서 자기 API를 fetch하면 쿠키가 없어 관리자 API가 403 → DB 직접 조회
export const dynamic = 'force-dynamic';

export default async function QnaPage() {
  return (
    <div className={s.container}>
      <PageHeader
        eyebrow={<>Q&amp;A</>}
        title='문의 답변'
        description={<>상품 문의에 답변해요. 등록한 답변은 상품 상세의 Q&amp;A에 바로 보여요.</>}
      />
      <QnaManager items={await findQnaForAdmin()} />
    </div>
  );
}
