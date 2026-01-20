'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import { Search } from '@/components/molecules';
import { category, categoryMatch } from '@/shared/category';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { CardProps } from '@/shared/type';

export default function page() {
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState([] as CardProps[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [checkList, setCheckList] = useState([] as number[]);
  const [discount, setDiscount] = useState(0);
  const [checkAll, setCheckAll] = useState(false);
  const [exceptReserve, setExceptReserve] = useState(false);

  const searchProduct = async (keyword: string) => {
    console.log('search : ', search);
    const result = await fetch(
      `/api/getProduct?search=${keyword}&page=${currentPage}&count=100`
    )
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
    setProduct(result.data);
    setTotal(result.total);
  };

  const ShowPrice = useCallback(
    (props: {
      isDiscount: boolean;
      price: number;
      alreadyDiscount: number;
      checked: boolean;
    }) => {
      //   console.log(props, discount);
      if (props.isDiscount === true && props.alreadyDiscount) {
        return (
          <div>
            <span
              style={{ color: '#8e75fe', fontSize: '14px', marginRight: '8px' }}
            >
              이미 할인중
            </span>
            <span
              style={{ color: 'lightgray', textDecoration: 'line-through' }}
            >
              {props.price}
            </span>
            <span> → {props.price * (1 - props.alreadyDiscount / 100)}</span> 원
          </div>
        );
      } else if (discount !== 0 && props.checked === true) {
        return (
          <div>
            <span
              style={{ color: 'lightgray', textDecoration: 'line-through' }}
            >
              {props.price}
            </span>
            <span> → {props.price * (1 - discount / 100)}</span> 원
          </div>
        );
      } else {
        return <div>{props.price} 원</div>;
      }
    },
    [discount, checkList]
  );

  return (
    <div style={{ padding: '30px' }}>
      <h1>이벤트 추가</h1>

      <div style={{ marginBottom: '20px' }}>검색어 : {search}</div>
      <Range preset='between'>
        <Range preset='column'>
          <select
            onChange={(e) => {
              setSearch(e.target.value);
              searchProduct(e.target.value);

              setCheckList([]);
              setCheckAll(false);
              setExceptReserve(false);
            }}
            style={{
              width: '500px',
              height: '40px',
              border: '1px solid lightgray',
              padding: '4px 8px',
              fontSize: '18px',
            }}
          >
            <option value='' onClick={() => undefined}>
              그룹을 선택하세요
            </option>
            <option disabled>===== 캐릭터 =====</option>
            {category.character.map((val) => (
              <option
                onClick={() => {
                  setSearch(val);
                }}
                key={val}
                value={val}
              >
                {val}
              </option>
            ))}
            <option disabled>===== 애니 =====</option>
            {category.ani.map((val) => (
              <option
                key={val}
                value={val}
                onClick={() => {
                  setSearch(val);
                  searchProduct(val);
                }}
              >
                {val}
              </option>
            ))}

            <option disabled>===== 시리즈 =====</option>
            {Object.entries(category.series).map(([seriesName, seriesList]) => {
              // console.log('seriesName, seriesList:', seriesName, seriesList);
              const seriesMap =
                categoryMatch.series[
                  seriesName as keyof typeof categoryMatch.series
                ];
              return seriesList.map((val) => {
                const seriesValue =
                  seriesMap[val as keyof typeof seriesMap] || val;
                return (
                  <option
                    key={val}
                    value={seriesValue}
                    onClick={() => {
                      setSearch(val);
                      searchProduct(val);
                    }}
                  >
                    {val}
                  </option>
                );
              });
            })}
          </select>

          <input
            placeholder='제품 검색'
            style={{
              width: '482px',
              height: '30px',
              border: '1px solid lightgray',
              padding: '4px 8px',
              fontSize: '18px',
              marginTop: '10px',
            }}
            onChange={(e) => {
              setSearch(e.target.value);
              setCheckList([]);
              setCheckAll(false);
              setExceptReserve(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchProduct(search);
                setCheckList([]);
                setCheckAll(false);
                setExceptReserve(false);
              }
            }}
          />
        </Range>
        <Range preset='column' gap='10' style={{ width: '700px' }}>
          <Range gap='30' style={{ alignItems: 'center' }}>
            <Range>
              <span
                style={{
                  lineHeight: '35px',
                  fontSize: '18px',
                  marginRight: '10px',
                }}
              >
                할인
              </span>
              <input
                value={discount}
                placeholder='할인 %'
                type='number'
                onChange={(e) => {
                  setDiscount(Number(e.target.value));
                }}
                style={{
                  width: '100px',
                  height: '30px',
                  border: '1px solid lightgray',
                  padding: '4px 8px',
                  fontSize: '18px',
                }}
              />
              <span
                style={{
                  lineHeight: '35px',
                  fontSize: '18px',
                  marginLeft: '5px',
                }}
              >
                %
              </span>
            </Range>
            <Range>
              <input
                type='checkbox'
                checked={checkAll}
                style={{ width: '20px', height: '20px' }}
                onChange={(e) => {
                  console.log('checkAll checked: ', checkAll);
                  if (checkAll === true) {
                    setCheckList([]);
                    setCheckAll(false);
                  } else {
                    let allNumbers = [] as number[];
                    if (exceptReserve === true) {
                      allNumbers = product
                        .filter((prod) => prod.reserve === '')
                        .map((prod) => prod.num);
                    } else {
                      allNumbers = product.map((prod) => prod.num);
                    }

                    console.log('allNumbers : ', allNumbers);

                    setCheckList((prev) => [...prev, ...allNumbers]);
                    setCheckAll(true);
                  }
                }}
              />
              <label style={{ lineHeight: '25px', fontSize: '18px' }}>
                전체 선택
              </label>
            </Range>
            <Range>
              <input
                type='checkbox'
                checked={exceptReserve}
                style={{ width: '20px', height: '20px' }}
                onChange={(e) => {
                  console.log('exceptReserve checked: ', exceptReserve);
                  if (exceptReserve === true) {
                    setExceptReserve(false);
                  } else {
                    for (const prod of product) {
                      if (checkList.includes(prod.num) && prod.reserve !== '') {
                        setCheckList((prev) =>
                          prev.filter((val) => val !== prod.num)
                        );
                      }
                    }
                    setExceptReserve(true);
                  }
                }}
              />
              <label style={{ lineHeight: '25px', fontSize: '18px' }}>
                예약 상품 제외
              </label>
            </Range>
          </Range>
          <Range>
            <button
              style={{
                backgroundColor: '#75C3FE',
                width: '475px',
                height: '40px',
                color: 'white',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                lineHeight: '38px',
              }}
              onClick={async () => {
                if (checkList.length === 0) {
                  alert('제품을 선택해주세요.');
                  return;
                }

                if (checkList.length === 0) {
                  alert('할인이 0프로 입니다.');
                  return;
                }

                await fetch('/api/postEvent', {
                  method: 'POST',
                  body: JSON.stringify({
                    discount,
                    checkList,
                  }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }).then(async (res) => {
                  const data = await res.json();
                  console.log(data);
                  if (data.ok === true) {
                    alert('할인이 반영되었습니다.');
                    window.location.reload();
                  } else {
                    alert('오류가 발생하여 반영되지 못했습니다.');
                    window.location.reload();
                  }
                });
              }}
            >
              이벤트 적용
            </button>
          </Range>
        </Range>
      </Range>
      <Range
        preset='columnBetween'
        width='full'
        gap='10'
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 600px)',
          marginTop: '30px',
        }}
      >
        {product.map((val, idx) => (
          <Range preset='left' key={val.num} gap='5' style={{ width: '600px' }}>
            <input
              checked={checkList.includes(val.num)}
              type='checkbox'
              style={{
                width: '20px',
                height: '20px',
              }}
              onChange={(e) => {
                if (checkList.includes(val.num)) {
                  setCheckList((prev) => prev.filter((v) => v !== val.num));
                  return;
                }
                setCheckList((prev) => [...prev, val.num]);
              }}
            />
            <Image
              src={val.image[0]}
              width={120}
              height={120}
              alt='img'
              style={{ border: '1px solid lightgray' }}
            />
            <Range
              preset='columnBetween'
              style={{ marginLeft: '8px', height: '120px' }}
            >
              <Range preset='column'>
                <h4 style={{ margin: '0' }}>{'NO. ' + val.num} </h4>
                <div key={idx} style={{ fontSize: '18px', height: '52px' }}>
                  {val?.title || ''}
                </div>
              </Range>
              <Range preset='column'>
                {val.reserve !== '' && (
                  <div style={{ color: '#75C3FE', fontSize: '14px' }}>
                    예약 상품
                  </div>
                )}
                <ShowPrice
                  isDiscount={val.isDiscount}
                  price={val.price}
                  alreadyDiscount={val.discount}
                  checked={checkList.includes(val.num)}
                />
              </Range>
            </Range>
          </Range>
        ))}
      </Range>

      {product.length !== 0 && (
        <Range style={{ margin: '80px auto 30px auto' }}>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={100}
            onChange={(page) => {
              console.log('onChange page : ', page);
              setCurrentPage(page);
              searchProduct(search);
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }}
          />
        </Range>
      )}
      {checkList.length !== 0 && (
        <Range gap='10'>
          {checkList.map((val, idx) => (
            <div key={idx}>{val}</div>
          ))}
        </Range>
      )}
    </div>
  );
}
