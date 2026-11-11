import QnaManager from '@/features/qna-manage/ui/QnaManager';
import { findQnaForAdmin } from '@/features/qna-manage/lib/findQnaForAdmin';
import * as s from '../error/page.css';

// 서버 컴포넌트에서 자기 API를 fetch하면 쿠키가 없어 관리자 API가 403 → DB 직접 조회
export const dynamic = 'force-dynamic';

export default async function QnaPage() {
  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <span className={s.eyebrow}>Q&amp;A</span>
        <h1 className={s.title}>문의 답변</h1>
        <p className={s.subText}>상품 문의에 답변해요. 등록한 답변은 상품 상세의 Q&amp;A에 바로 보여요.</p>
      </section>
      <QnaManager items={await findQnaForAdmin()} />
    </div>
  );
}
