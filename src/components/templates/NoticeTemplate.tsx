'use client';

import React, { Fragment, useState } from 'react';
import { Notice } from '../molecules';
import { notice } from '@/shared/notice';
import Pagination from 'rc-pagination';
import { Range } from '../atoms';
import 'rc-pagination/assets/index.css';

export default function NoticeTemplate() {
  const list = {
    num: '공지',
    title: '넥스트가챠 사용 안내',
    created_at: '2025-08-10 12:00:00',
    content:
      '되팔이 방지를 위해 한번에 5개까지만 구매할 수 있고, 배송이 완료되기 전까지 같은 제품을 구매할 수 없는 구조로 되어있습니다. 우리 모두 행복한 덕질 생활을 위한 정책이므로 양해부탁드리겠습니다. 5만원 이상 구매 시 배송비가 무료입니다. 또한, 구매 후 7일 이내에 반품 및 교환이 가능합니다. 현재 보안을 위해 로그인은 카카오, 구매는 네이버페이를 통해서만 가능합니다. 신상 가챠는 매월 1일에 예약 가챠는 매월 12일에 추가됩니다만, 깜짝 추가 가챠가 들어올 수 있습니다. 앞으로도 더 나은 서비스로 찾아뵙겠습니다. 감사합니다!',
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(notice.length);
  const [pageSize, setPageSize] = useState(14);
  const [page, setPage] = useState(notice.slice(0, pageSize));
  return (
    <div style={{ width: '960px', margin: '0 auto' }}>
      <div style={{ height: '555px' }}>
        <div style={{ marginTop: '40px' }}>
          <Notice props={list} />
        </div>
        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: 'lightgray',
          }}
        ></div>
        {page.map((v, i) => (
          <Fragment key={v.num}>
            <Notice props={v} />
            {i !== notice.length - 1 && (
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'lightgray',
                }}
              ></div>
            )}
          </Fragment>
        ))}
      </div>
      <Range style={{ margin: '40px auto' }}>
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={(page) => {
            setCurrentPage(page);
            setPage(notice.slice((page - 1) * pageSize, page * pageSize));
          }}
        />
      </Range>
    </div>
  );
}
