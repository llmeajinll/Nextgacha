'use client';

import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { reactSlickVariant } from '@/styles/variants.css';

import { lever, handle, dot, slices, rotateVar } from './reactSlick.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

type Preset = keyof typeof reactSlickVariant;
type PropsType1 = {
  image?: { url?: string; onClick?: () => void }[];
};
type PropsType2 = {
  image?: string[];
};
type PropsType = (PropsType1 | PropsType2) & { preset?: Preset };

export default function ReactSlick({ image, preset }: PropsType) {
  const [angle, setAngle] = useState(0);
  const sliderRef = useRef<Slider>(null);

  let imgCount = image?.length || 0;
  let show = 0;
  let divideAngle = 360 * (1 / imgCount) - 90;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setAngle((prev) => prev + 360 * (1 / imgCount));
  //   }, 4500);

  //   return () => clearInterval(interval);
  // }, []);

  const isStringArray = Array.isArray(image) && typeof image[0] === 'string';

  // 레버는 항상 시계 방향(오른쪽)으로만 돈다: 목표 각도까지 0~360도 사이만큼 앞으로
  const getClockwiseAngle = (current: number, target: number) =>
    current + ((((target - current) % 360) + 360) % 360);

  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,

    beforeChange: (current: number, next: number) => {
      const targetAngle = 360 * (next / imgCount);
      setAngle((prev) => getClockwiseAngle(prev, targetAngle));
    },
  };

  let sizeSettings = { width: 450, height: 450 };

  if (preset === 'banner') {
    sizeSettings = { width: 1312, height: 439 };
    settings = {
      ...settings,
      dots: false,
      autoplay: true,
    };
  }

  return (
    <div className={`${reactSlickVariant[preset ?? 'small']}`}>
      <Slider {...settings} ref={sliderRef}>
        {image?.map((val, idx) => {
          const url = isStringArray ? (val as string) : (val as any).url;
          const onClick = !isStringArray ? (val as any).onClick : undefined;

          return (
            <div
              className={`${preset ?? 'small'}`}
              onClick={onClick ?? (() => {})}
              key={idx}
            >
              <Image
                width={sizeSettings.width}
                height={sizeSettings.height}
                src={String(url)}
                alt='main'
                // 메인 배너 첫 장은 LCP 후보 → lazy 대신 preload
                priority={preset === 'banner' && idx === 0}
              />
            </div>
          );
        })}
      </Slider>

      {preset === 'banner' && (
        <div className={lever}>
          {/* 레버 손잡이 */}
          <div
            className={handle}
            style={assignInlineVars({ [rotateVar]: `${angle}deg` })}
          >
            <div className={dot}></div>
          </div>

          {/* slider dots */}
          {image?.map((_, idx) => {
            let angle = 360 * (idx / imgCount);

            return (
              <div
                key={idx}
                className={slices}
                style={assignInlineVars({ [rotateVar]: `${angle}deg` })}
                // 각도는 beforeChange가 맞춘다 (여기서 절대값으로 덮으면 왼쪽으로 되감김)
                onClick={() => sliderRef.current?.slickGoTo(idx)}
              >
                {/* {idx} */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
