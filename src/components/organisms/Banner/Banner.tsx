'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  bannerContainer,
  eventConatiner,
  lever,
  handle,
  dot,
  slices,
} from './banner.css';

import { ReactSlick } from '@/components/atoms';

export default function Banner() {
  const [angle, setAngle] = useState(0);
  let imgUrl = [
    {
      url: '/images/event1.png',
      onClick: () =>
        (document.location.href = `${process.env.NEXT_PUBLIC_URL}/search?type=series&company=bandai`),
    },
    {
      url: '/images/event2.png',
      onClick: () =>
        (document.location.href = `${process.env.NEXT_PUBLIC_URL}/search?type=character&detail=치이카와`),
    },
    { url: '/images/event3.png' },
  ];

  let imgCount = imgUrl.length;
  let show = 0;
  let subangle = 360 * (1 / imgCount) - 90;
  console.log(subangle);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev + 360 * (1 / imgCount));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={bannerContainer}>
        <div className={eventConatiner}>
          {/* {imgUrl.map((url, index) => (
            <Image
              src={url}
              alt='event'
              width={1312}
              height={437}
              key={index}
            />
          ))} */}
          <ReactSlick image={imgUrl} preset='banner' />
        </div>
        <div className={lever}>
          <div
            className={handle}
            style={{
              transform: `rotate(${angle}deg)`,
              transition: 'transform 1s ease-in-out',
            }}
          >
            <div className={dot}></div>
          </div>

          {imgUrl.map((_, idx) => {
            let angle = 360 * (idx / imgCount) - 90;

            return (
              <div
                key={idx}
                className={slices}
                style={{
                  transform: `rotate(${angle}deg) translate(58px)`,
                }}
                onClick={() => {
                  show = idx;
                  console.log(show);
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </>
  );
}
