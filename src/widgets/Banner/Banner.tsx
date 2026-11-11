'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { bannerContainer, eventConatiner } from './banner.css';

import { ReactSlick } from '@/shared/ui';

// 관리자 배너가 하나도 없을 때 보이는 기본 배너
const FALLBACK = ['/images/event/event1.png', '/images/event/event2.png', '/images/event/event3.png', '/images/event/event4.png'];

// banners: 관리자 배너 관리에서 게시 중인 배너 (노출 순서대로)
export default function Banner({ banners }: { banners: { image: string; link: string }[] }) {
  const router = useRouter();
  const imgUrl = banners.length
    ? banners.map((b) => ({ url: b.image, onClick: b.link ? () => router.push(b.link) : undefined }))
    : FALLBACK.map((url) => ({ url }));

  // let imgCount = imgUrl.length;
  // let show = 0;
  // let subangle = 360 * (1 / imgCount) - 90;
  // console.log(subangle);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setAngle((prev) => prev + 360 * (1 / imgCount));
  //   }, 4500);

  //   return () => clearInterval(interval);
  // }, []);

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
        {/* <div className={lever}>
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
        </div> */}
      </div>
    </>
  );
}
