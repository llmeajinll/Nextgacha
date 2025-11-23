'use client';

import React, { useState } from 'react';
import { category, categoryMatch } from '@/shared/category';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PutBlobResult } from '@vercel/blob';

export default function ManageProductPage() {
  console.log(categoryMatch.character['포켓몬']);
  const formData = new FormData();

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
    <>
      <div>
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
        />
      </div>

      <div>
        <input
          placeholder='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          style={{ width: '400px' }}
          required
        />
      </div>

      <div>
        <input
          placeholder='price'
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>출시일 선택 </label>
        <DatePicker
          selected={create}
          onChange={(newDate) => setCreate(newDate)}
          dateFormat='yyyy-MM-dd'
          placeholderText='Select a date'
          disabled={checkBox}
        />
      </div>
      <div>
        <label>예약판매 선택 </label>
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
        />{' '}
        예약 판매
      </div>
      <label>가챠 리스트</label>
      <div>
        {list.map((val, idx) => (
          <div key={idx}>
            <input
              placeholder='이름'
              value={val.name}
              onChange={(e) => {
                const newList = [...list];
                newList[idx].name = e.target.value;
                setList(newList);
              }}
            />
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
            />
          </div>
        ))}
        <button
          onClick={() => setList((list) => [...list, { name: '', count: 0 }])}
        >
          +
        </button>
      </div>
      <div>
        <label>회사 선택 </label>
        <select
          onChange={(e) => {
            setCompany(e.target.value);
            console.log(e.target.value);
          }}
        >
          {Object.keys(category.series).map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>
      <div>{company}</div>

      <div>
        <label>그룹 선택 </label>
        <select
          onChange={(e) => {
            setGroup((group) => [...group, e.target.value]);
            console.log(group);
          }}
        >
          {category.character.map((val) => (
            <option
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
          {category.ani.map((val) => (
            <option
              key={val}
              value={categoryMatch.ani[val as keyof typeof categoryMatch.ani]}
            >
              {val}
            </option>
          ))}

          {Object.entries(category.series).map(([seriesName, seriesList]) => {
            console.log('seriesName, seriesList:', seriesName, seriesList);
            const seriesMap = (
              categoryMatch.series as Record<string, Record<string, string>>
            )[seriesName];
            return seriesList.map((series) => (
              <option
                key={series}
                value={seriesMap ? seriesMap[series] ?? series : series}
              >
                {series}
              </option>
            ));
          })}
        </select>
      </div>
      <div>
        {group.map((val) => {
          return (
            <span key={val} style={{ marginRight: '10px' }}>
              {val}
              <button onClick={() => group.filter((v, idx) => val === v)}>
                x
              </button>
            </span>
          );
        })}
      </div>
      <button
        onClick={() => {
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

          console.log('Form Data Entries:');
          for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
          }

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
          fetch('/api/postProduct', {
            method: 'POST',
            body: formData,
          });
        }}
      >
        상품등록
      </button>
    </>
  );
}
