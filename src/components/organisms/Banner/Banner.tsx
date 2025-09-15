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

export default function Banner() {
  const [angle, setAngle] = useState(0);
  let imgUrl = [
    '/images/event1.png',
    '/images/event2.png',
    '/images/event3.png',
  ];
  let imgCount = imgUrl.length;
  let show = 0;
  //   let angle = 360 * (1 / imgCount) - 90;
  //   console.log(angle);
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev + 120);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className={bannerContainer}>
        <div className={eventConatiner}>
          {imgUrl.map((url, index) => (
            <Image
              src={url}
              alt='event'
              width={1312}
              height={437}
              key={index}
            />
          ))}
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

          {imgUrl.map((_, index) => {
            let angle = 360 * (index / imgCount) - 90;

            return (
              <div
                key={index}
                className={slices}
                style={{
                  transform: `rotate(${angle}deg) translate(58px)`,
                }}
                onClick={() => {
                  show = index;
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
