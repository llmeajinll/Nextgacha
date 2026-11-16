'use client';

import { useState } from 'react';
import { Btn, StarRating } from '@/shared/ui';
import { useModal } from '@/shared/hooks';
import { textareaBox, textareaCount } from '@/styles/ui.css';
import { deleteBtn } from './deleteReviewBtn.css';
import { form, textarea, row } from './editReviewBtn.css';

// 본인 리뷰, 작성 후 5일 안에만 보여준다 (서버가 canEdit으로 알려주고 저장할 때 다시 확인)
export default function EditReviewBtn({
  num,
  orderId,
  rate: initialRate,
  content,
  onSaved,
}: {
  num: number;
  orderId: string;
  rate: number;
  content: string;
  onSaved: (next: { rate: number; content: string }) => void;
}) {
  const { openModal } = useModal();
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(initialRate);
  const [text, setText] = useState(content);
  const [sending, setSending] = useState(false);

  if (!open) {
    return (
      <button type='button' className={deleteBtn} onClick={() => setOpen(true)}>
        수정
      </button>
    );
  }

  const save = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/protected/updateReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num, orderId, rate, text: text.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) return openModal(data.message ?? '리뷰를 수정하지 못했습니다.');
      onSaved({ rate, content: text.trim() });
      setOpen(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={form}>
      <StarRating value={rate} setValue={setRate} />
      <div className={textareaBox}>
        <textarea
          aria-label='리뷰 내용'
          rows={3}
          maxLength={1000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={textarea}
        />
        <span className={textareaCount}>{text.length}/1000</span>
      </div>
      <div className={row}>
        <Btn kind='neutral' scale='s' onClick={() => setOpen(false)}>
          취소
        </Btn>
        <Btn kind='primary' scale='s' disabled={sending || text.trim().length === 0} onClick={save}>
          {sending ? '저장하는 중…' : '저장'}
        </Btn>
      </div>
    </div>
  );
}
