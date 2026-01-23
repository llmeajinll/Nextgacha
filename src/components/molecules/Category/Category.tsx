'use client';

import React from 'react';
import { Range } from '@/components/atoms';
import {
  categoryContainer,
  label,
  sublabel,
  content,
  line,
  select,
} from './category.css';
import { categoryVariant } from '@/styles/variants.css';
import { category } from '@/shared/category';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Props = {
  status?: 'header' | 'menu';
  setShow?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
};

export default function Category({ status = 'header', setShow }: Props) {
  //   const category = await require('@/shared/category');
  const searchParams = useSearchParams();

  const type = searchParams.get('type');
  const detail = searchParams.get('detail');
  const company = searchParams.get('company');
  const tag = searchParams.get('tag');

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
          {category.character.map((val, idx) => (
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
        <Range
          preset='left'
          gap='15'
          style={{
            flexWrap: 'wrap',
          }}
        >
          {category.ani.map((val, idx) => (
            <Link
              href={`/search?type=ani&detail=${val}&page=1&filter=전체`}
              key={val}
            >
              <div
                className={`${content} ${
                  detail === val && status === 'menu' ? select : null
                }`}
                key={val}
                style={{ flex: '0 0 auto' }}
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
          <div>
            <div
              className={`${sublabel} ${
                company === 'bandai' && status === 'menu' ? select : null
              }`}
            >
              반다이
            </div>
            <Range
              gap='15'
              style={{
                flexWrap: 'wrap',
              }}
            >
              {category.series.BANDAI.map((val, idx) => (
                <Link
                  href={`/search?type=series&company=bandai&detail=${val}&page=1&filter=전체`}
                  key={val}
                >
                  <div
                    className={`${content} ${
                      detail === val && status === 'menu' ? select : null
                    }`}
                    key={val}
                    style={{ flex: '0 0 auto' }}
                  >
                    {val}
                  </div>
                </Link>
              ))}
            </Range>
          </div>

          <div>
            <div
              className={`${sublabel} ${
                company === 'tomy' && status === 'menu' ? select : null
              }`}
            >
              토미
            </div>
            <Range
              gap='15'
              style={{
                flexWrap: 'wrap',
              }}
            >
              {category.series.TOMY.map((val, idx) => (
                <Link
                  href={`/search?type=series&company=tomy&detail=${val}&page=1&filter=전체`}
                  key={val}
                >
                  <div
                    className={`${content} ${
                      detail === val && status === 'menu' ? select : null
                    }`}
                    key={val}
                    style={{ flex: '0 0 auto' }}
                  >
                    {val}
                  </div>
                </Link>
              ))}
            </Range>
          </div>

          <div>
            <div
              className={`${sublabel} ${
                company === 'standstones' && status === 'menu' ? select : null
              }`}
            >
              STANDSTONES
            </div>
            <Range
              gap='15'
              style={{
                flexWrap: 'wrap',
              }}
            >
              {category.series.STANDSTONES.map((val, idx) => (
                <Link
                  href={`/search?type=series&company=standstones&detail=${val}&page=1&filter=전체`}
                  key={val}
                >
                  <div
                    className={`${content} ${
                      detail === val && status === 'menu' ? select : null
                    }`}
                    key={val}
                    style={{ flex: '0 0 auto' }}
                  >
                    {val}
                  </div>
                </Link>
              ))}
            </Range>
          </div>

          <div>
            <div
              className={`${sublabel} ${
                company === 'etc' && status === 'menu' ? select : null
              }`}
            >
              기타
            </div>
            <Range
              gap='15'
              style={{
                flexWrap: 'wrap',
              }}
            >
              {category.series.ETC.map((val, idx) => (
                <Link
                  href={`/search?type=series&company=etc&detail=${val}`}
                  key={val}
                >
                  <div
                    className={`${content} ${
                      detail === val && status === 'menu' ? select : null
                    }`}
                    key={val}
                    style={{ flex: '0 0 auto' }}
                  >
                    {val}
                  </div>
                </Link>
              ))}
            </Range>
          </div>
        </Range>
      </Range>
    </div>
  );
}
