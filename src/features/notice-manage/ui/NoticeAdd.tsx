'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'pixelarticons/react';
import NoticeEditor from './NoticeEditor';
import * as s from './noticeAdd.css';

// 공지 추가 페이지. 저장하면 결과와 다음 행동(하나 더 쓰기 · 목록으로)을 보여줌
export default function NoticeAdd({ pinCount }: { pinCount: number }) {
  const [done, setDone] = useState('');
  const [round, setRound] = useState(0);

  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <Link href='/manager/notice' className={s.back}>
          <ChevronLeft aria-hidden />
          공지 관리
        </Link>
        <span className={s.eyebrow}>NEW NOTICE</span>
        <h1 className={s.title}>공지 추가</h1>
        <p className={s.subText}>쇼핑몰 공지사항을 새로 써요. 글 사이 원하는 자리에 이미지를 넣을 수 있어요.</p>
      </section>

      {done ? (
        <div role='status' className={s.done}>
          <span className={s.doneText}>{done}</span>
          <span className={s.doneBtns}>
            <button
              type='button'
              className={s.neutralBtn}
              onClick={() => {
                setDone('');
                setRound(round + 1);
              }}
            >
              하나 더 쓰기
            </button>
            <Link href='/manager/notice' className={s.secondaryBtn}>
              공지 목록으로
            </Link>
          </span>
        </div>
      ) : (
        <section className={s.panel}>
          <NoticeEditor
            key={round}
            pinCount={pinCount}
            // ponytail: 하나 더 쓰기 때 고정 개수는 페이지를 연 시점 기준, 넘치면 서버가 409로 막음
            onDone={(message) => setDone(message)}
          />
        </section>
      )}
    </div>
  );
}
