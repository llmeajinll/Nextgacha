'use client';

import React from 'react';
import { Range } from '@/shared/ui';
import {
  categoryContainer,
  label,
  sublabel,
  content,
  line,
  select,
  wrapRow,
  contentItem,
} from './category.css';
import { categoryVariant } from '@/styles/variants.css';
import type { CategoryMenu } from '@/entities/product/model/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Props = {
  status?: 'header' | 'menu';
  setShow?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  menu: CategoryMenu;
};

export default function Category({ status = 'header', setShow, menu }: Props) {
  const searchParams = useSearchParams();

  const type = searchParams.get('type');
  const detail = searchParams.get('detail');
  const company = searchParams.get('company');
  const tag = searchParams.get('tag');
  const group = searchParams.get('group');

  return (
    <div
      className={`${categoryVariant[status]} ${categoryContainer}`}
      onMouseEnter={() => {
        if (setShow) {
          setShow(true);
        }
      }}
      onMouseLeave={() => {
        if (setShow) {
          setShow(false);
        }
      }}
    >
      <Range>
        <div
          className={`${label} ${
            type === 'main' && status === 'menu' ? select : null
          }`}
        >
          메인
        </div>
        <Range gap='15'>
          {['전체 상품', '인기 상품', '신규 상품', '예약 판매'].map(
            (val, idx) => (
              <Link href={`/search?type=main&tag=${val}&page=1`} key={val}>
                <div
                  className={`${content} ${
                    tag === val && status === 'menu' ? select : null
                  }`}
                >
                  {val}
                </div>
              </Link>
            ),
          )}
        </Range>
      </Range>

      <div className={line} />

      <Range>
        <div
          className={`${label} ${
            type === 'character' && status === 'menu' ? select : null
          }`}
        >
          캐릭터
        </div>
        <Range gap='15'>
          {menu.character.map((val, idx) => (
            <Link
              href={`/search?type=character&detail=${val}&page=1&filter=전체`}
              key={val}
            >
              <div
                className={`${content} ${
                  detail === val && status === 'menu' ? select : null
                }`}
              >
                {val}
              </div>
            </Link>
          ))}
        </Range>
      </Range>

      <div className={line} />

      <Range>
        <div
          className={`${label} ${
            type === 'ani' && status === 'menu' ? select : null
          }`}
        >
          애니메이션
        </div>
        <Range preset='left' gap='15' className={wrapRow}>
          {menu.ani.map((val, idx) => (
            <Link
              href={`/search?type=ani&detail=${val}&page=1&filter=전체`}
              key={val}
            >
              <div
                className={`${content} ${contentItem} ${
                  detail === val && status === 'menu' ? select : null
                }`}
                key={val}
              >
                {val}
              </div>
            </Link>
          ))}
        </Range>
      </Range>

      <div className={line} />

      <Range>
        <div
          className={`${label} ${
            type === 'series' && status === 'menu' ? select : null
          }`}
        >
          시리즈
        </div>

        <Range preset='column' gap='15'>
          {menu.series.map((m) => {
            const co = m.company.toLowerCase();
            return (
              <div key={m.company}>
                <div
                  className={`${sublabel} ${
                    company === co && status === 'menu' ? select : null
                  }`}
                >
                  {m.name}
                </div>
                <Range gap='15' className={wrapRow}>
                  {m.items.map((val) => (
                    <Link
                      href={`/search?type=series&company=${encodeURIComponent(co)}&detail=${encodeURIComponent(val)}&page=1&filter=전체`}
                      key={val}
                    >
                      <div
                        className={`${content} ${contentItem} ${
                          detail === val && status === 'menu' ? select : null
                        }`}
                      >
                        {val}
                      </div>
                    </Link>
                  ))}
                </Range>
              </div>
            );
          })}
        </Range>
      </Range>

      {menu.groups.map((g) => (
        <React.Fragment key={g.name}>
          <div className={line} />
          <Range>
            <div
              className={`${label} ${
                type === 'custom' && group === g.name && status === 'menu' ? select : null
              }`}
            >
              {g.name}
            </div>
            <Range preset='left' gap='15' className={wrapRow}>
              {g.items.map((val) => (
                <Link
                  href={`/search?type=custom&group=${encodeURIComponent(g.name)}&detail=${encodeURIComponent(val)}&page=1&filter=전체`}
                  key={val}
                >
                  <div
                    className={`${content} ${contentItem} ${
                      detail === val && status === 'menu' ? select : null
                    }`}
                  >
                    {val}
                  </div>
                </Link>
              ))}
            </Range>
          </Range>
        </React.Fragment>
      ))}
    </div>
  );
}
