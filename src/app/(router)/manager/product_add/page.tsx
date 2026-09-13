'use client';

import React, { useState, useEffect } from 'react';
import { category, categoryMatch } from '@/entities/product/lib/category';
import dayjs from 'dayjs';
import { Range } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  pageContainer,
  fieldLabel,
  plainLabel,
  imageInput,
  titleInput,
  priceInput,
  listCountInput,
  selectField,
  deleteBtn,
  deleteBtnSmall,
  addListBtn,
  submitBtn,
  groupTag,
} from './page.css';

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
    }[],
  );

  const [company, setCompany] = useState('');
  const [group, setGroup] = useState([] as string[]);

  const [checkBox, setCheckBox] = useState(false);

  return (
    <div className={pageContainer}>
      <h4 onClick={() => router.push('/manager')}>HOME</h4>
      <h1>상품 추가</h1>
      <Range gap='8' preset='alignCenter'>
        <div className={fieldLabel}>이미지</div>
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
          className={imageInput}
        />
      </Range>

      <Range gap='8' preset='alignCenter'>
        <div className={fieldLabel}>제목</div>
        <input
          placeholder='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className={titleInput}
          required
        />
      </Range>

      <Range gap='8' preset='alignCenter'>
        <div className={fieldLabel}>가격</div>
        <input
          placeholder='price'
          onChange={(e) => setPrice(Number(e.target.value))}
          className={priceInput}
          required
        />
        원
      </Range>
      <Range gap='8' preset='alignCenter'>
        <label className={fieldLabel}>출시일 선택</label>
        <DatePicker
          selected={create}
          onChange={(newDate) => setCreate(newDate)}
          dateFormat='yyyy-MM-dd'
          placeholderText='Select a date'
          disabled={checkBox}
        />
      </Range>
      <Range gap='8' preset='alignCenter'>
        <label className={fieldLabel}>예약판매 선택</label>
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
      <label className={plainLabel}>가챠 리스트</label>
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
              className={priceInput}
            />
            <Range gap='4' preset='alignCenter' className={plainLabel}>
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
                className={listCountInput}
              />
              개
              <button
                onClick={() => {
                  setList((prev) => prev.filter((_, i) => i !== idx));
                }}
                className={deleteBtn}
              >
                ✕
              </button>
            </Range>
          </Range>
        ))}
        <button
          onClick={() => setList((list) => [...list, { name: '', count: 0 }])}
          className={addListBtn}
        >
          +
        </button>
      </Range>
      <Range gap='8' preset='alignCenter'>
        <label className={fieldLabel}>회사 선택</label>
        <select
          onChange={(e) => {
            setCompany(e.target.value);
            // console.log(e.target.value);
          }}
          className={selectField}
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
        <div className={plainLabel}>선택한 회사 : {company}</div>
      </Range>

      <Range gap='8' preset='alignCenter'>
        <label className={fieldLabel}>그룹 선택</label>
        <select
          onChange={(e) => {
            setGroup((group) => [...group, e.target.value]);
            // console.log(group);
          }}
          className={selectField}
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
        <div className={plainLabel}>선택한 그룹 : </div>

        <Range gap='10'>
          {group.map((val) => {
            return (
              <span key={val} className={groupTag}>
                {val}
                <button
                  onClick={() => {
                    console.log('group', group);
                    // group.filter((v) => val !== v);
                    setGroup((prev) => prev.filter((v) => val !== v));
                  }}
                  className={deleteBtnSmall}
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
        className={submitBtn}
      >
        상품 등록
      </button>
    </div>
  );
}
