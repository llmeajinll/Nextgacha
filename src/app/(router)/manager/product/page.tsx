'use client';

import React, { useState, useEffect } from 'react';
import { category, categoryMatch } from '@/shared/category';
import dayjs from 'dayjs';
import { Range } from '@/components/atoms';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ManageProductPage() {
  const formData = new FormData();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState(0);
  const [create, setCreate] = useState<Date | null>(null);
  const [reserve, setReserve] = useState<Date | null>(null);
  const [list, setList] = useState(
    [] as {
      name: string;
      count: number;
    }[]
  );

  const [company, setCompany] = useState('');
  const [group, setGroup] = useState([] as string[]);

  const [checkBox, setCheckBox] = useState(false);

  return (
    <div
      style={{
        boxSizing: 'border-box',
        padding: '0px 30px 50px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <h1>상품 추가</h1>
      <Range gap='8' style={{ alignItems: 'center' }}>
        <div style={{ width: '110px', fontSize: '18px' }}>이미지</div>
        <input
          placeholder=''
          type='file'
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const imageUrl = URL.createObjectURL(file);
              setImage(file);
            }
          }}
          style={{
            width: '200px',
            height: '200px',
            border: '1px solid lightgray',
          }}
        />
      </Range>

      <Range gap='8' style={{ alignItems: 'center' }}>
        <div style={{ width: '110px', fontSize: '18px' }}>제목</div>
        <input
          placeholder='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          style={{
            width: '400px',
            height: '30px',
            border: '1px solid lightgray',
            padding: '4px 8px',
            fontSize: '18px',
          }}
          required
        />
      </Range>

      <Range gap='8' style={{ alignItems: 'center' }}>
        <div style={{ width: '110px', fontSize: '18px' }}>가격</div>
        <input
          placeholder='price'
          onChange={(e) => setPrice(Number(e.target.value))}
          style={{
            width: '200px',
            height: '30px',
            border: '1px solid lightgray',
            padding: '4px 8px',
            fontSize: '18px',
          }}
          required
        />
        원
      </Range>
      <Range gap='8' style={{ alignItems: 'center' }}>
        <label
          style={{ display: 'inline-block', width: '110px', fontSize: '18px' }}
        >
          출시일 선택
        </label>
        <DatePicker
          selected={create}
          onChange={(newDate) => setCreate(newDate)}
          dateFormat='yyyy-MM-dd'
          placeholderText='Select a date'
          disabled={checkBox}
        />
      </Range>
      <Range gap='8' style={{ alignItems: 'center' }}>
        <label
          style={{ display: 'inline-block', width: '110px', fontSize: '18px' }}
        >
          예약판매 선택
        </label>
        <DatePicker
          selected={reserve}
          onChange={(newDate) => setReserve(newDate)}
          dateFormat='yyyy-MM-dd'
          placeholderText='Select a date'
          disabled={!checkBox}
        />
        <input
          type='checkbox'
          checked={checkBox}
          onChange={(e) => setCheckBox(e.target.checked)}
        />
        예약 판매
      </Range>
      <label style={{ fontSize: '18px' }}>가챠 리스트</label>
      <Range preset='column' gap='8'>
        {list.map((val, idx) => (
          <Range gap='8' key={idx}>
            <input
              placeholder='이름'
              value={val.name}
              onChange={(e) => {
                const newList = [...list];
                newList[idx].name = e.target.value;
                setList(newList);
              }}
              style={{
                width: '200px',
                height: '30px',
                border: '1px solid lightgray',
                padding: '4px 8px',
                fontSize: '18px',
              }}
            />
            <Range gap='4' style={{ fontSize: '18px', alignItems: 'center' }}>
              <input
                placeholder='갯수'
                value={val.count}
                type='number'
                onChange={(e) => {
                  const newList = [...list];
                  newList[idx].count = Number(e.target.value);
                  setList(newList);
                }}
                disabled={checkBox}
                style={{
                  width: '100px',
                  height: '30px',
                  border: '1px solid lightgray',
                  padding: '4px 8px',
                  fontSize: '18px',
                }}
              />
              개
              <button
                onClick={() => {
                  setList((prev) => prev.filter((_, i) => i !== idx));
                }}
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  height: '26px',
                  fontSize: '30px',
                  lineHeight: '10px',
                  color: 'red',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </Range>
          </Range>
        ))}
        <button
          onClick={() => setList((list) => [...list, { name: '', count: 0 }])}
          style={{
            width: '344px',
            height: '40px',
            border: '1px solid lightgray',
            fontSize: '40px',
            lineHeight: '39px',
            color: 'gray',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </Range>
      <Range gap='8' style={{ alignItems: 'center' }}>
        <label
          style={{ display: 'inline-block', width: '110px', fontSize: '18px' }}
        >
          회사 선택
        </label>
        <select
          onChange={(e) => {
            setCompany(e.target.value);
            // console.log(e.target.value);
          }}
          style={{
            width: '200px',
            height: '40px',
            border: '1px solid lightgray',
            padding: '4px 8px',
            fontSize: '18px',
          }}
        >
          <option value='' onClick={() => undefined}>
            회사를 선택하세요
          </option>
          {Object.keys(category.series).map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <div style={{ fontSize: '18px' }}>선택한 회사 : {company}</div>
      </Range>

      <Range gap='8' style={{ alignItems: 'center' }}>
        <label
          style={{ display: 'inline-block', width: '110px', fontSize: '18px' }}
        >
          그룹 선택
        </label>
        <select
          onChange={(e) => {
            setGroup((group) => [...group, e.target.value]);
            // console.log(group);
          }}
          style={{
            width: '200px',
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
                if (group.includes(val)) {
                  setGroup((prev) => prev.filter((v) => val !== v));
                }
              }}
              key={val}
              value={
                categoryMatch.character[
                  val as keyof typeof categoryMatch.character
                ]
              }
            >
              {val}
            </option>
          ))}
          <option disabled>===== 애니 =====</option>
          {category.ani.map((val) => (
            <option
              key={val}
              value={categoryMatch.ani[val as keyof typeof categoryMatch.ani]}
              onClick={() => {
                if (group.includes(val)) {
                  setGroup((prev) => prev.filter((v) => val !== v));
                }
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
                    if (group.includes(val)) {
                      setGroup((prev) => prev.filter((v) => val !== v));
                    }
                  }}
                >
                  {val}
                </option>
              );
            });
          })}
        </select>
        <div style={{ fontSize: '18px' }}>선택한 그룹 : </div>

        <Range gap='10'>
          {group.map((val) => {
            return (
              <span key={val} style={{ fontSize: '18px', marginRight: '4px' }}>
                {val}
                <button
                  onClick={() => {
                    console.log('group', group);
                    // group.filter((v) => val !== v);
                    setGroup((prev) => prev.filter((v) => val !== v));
                  }}
                  style={{
                    backgroundColor: 'white',
                    border: 'none',
                    height: '26px',
                    fontSize: '18px',
                    lineHeight: '30px',
                    color: 'red',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </span>
            );
          })}
        </Range>
      </Range>
      <button
        onClick={async () => {
          formData.append('title', title);
          formData.append('price', String(price)); // 숫자는 string으로 변환
          formData.append('company', company);

          if (create) formData.append('create', create.toISOString());
          if (reserve) formData.append('reserve', reserve.toISOString());

          formData.append('group', JSON.stringify(group));

          formData.append('list', JSON.stringify(list));

          if (image) {
            formData.append('image', image);
          }

          // console.log('Form Data Entries:');

          // for (const pair of formData.entries()) {
          //   console.log(`${pair[0]}: ${pair[1]}`);
          // }

          // console.log({
          //   title,
          //   image,
          //   price,
          //   create: create ? dayjs(create).format('YYYY-MM-DD') : '',
          //   reserve: reserve ? dayjs(reserve).format('YYYY-MM-DD') : '',
          //   list,
          //   company,
          //   group,

          // });
          await fetch('/api/postProduct', {
            method: 'POST',
            body: formData,
          })
            .then((res) => {
              if (res.ok === true) {
                alert('상품이 성공적으로 등록되었습니다.');
                window.location.reload();
              } else {
                alert('오류로 인해 등록하지 못했습니다.');
                window.location.reload();
              }
            })
            .catch((err) => {
              console.log(err);
              alert('등록 과정에서 오류가 발생했습니다.');
              window.location.reload();
            });
        }}
        style={{
          height: '60px',
          border: '1px solid gray',
          marginTop: '50px',
          backgroundColor: 'gray',
          color: 'white',
          fontSize: '20px',
          lineHeight: '20px',
          cursor: 'pointer',
        }}
      >
        상품 등록
      </button>
    </div>
  );
}
