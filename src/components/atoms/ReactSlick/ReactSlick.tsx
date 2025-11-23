'use client';

import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { reactSlickVariant } from '@/styles/variants.css';

import {
  lever,
  handle,
  dot,
  slices,
} from '@/components/organisms/Banner/banner.css';

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
  let divideAngle = 360 * (1 / imgCount);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setAngle((prev) => prev + 360 * (1 / imgCount));
  //   }, 4500);

  //   return () => clearInterval(interval);
  // }, []);

  const isStringArray = Array.isArray(image) && typeof image[0] === 'string';

  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,

    beforeChange: (current: number, next: number) => {
      // console.log('current:', current, 'next:', next);
      setAngle((prev) => prev + divideAngle);
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
              />
            </div>
          );
        })}
      </Slider>

      {preset === 'banner' && (
        <div className={lever}>
          <div
            className={handle}
            style={{
              transform: `rotate(${angle}deg)`,
              transition: 'transform 0.4s ease-in-out',
            }}
          >
            <div className={dot}></div>
          </div>

          {image?.map((_, idx) => {
            let angle = 360 * (idx / imgCount) - 90;

            return (
              <div
                key={idx}
                className={slices}
                style={{
                  transform: `rotate(${angle}deg) translate(58px)`,
                }}
                onClick={() => {
                  // console.log(idx, divideAngle * idx);
                  sliderRef.current?.slickGoTo(idx);
                  setAngle(divideAngle * (idx + 2));
                }}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
}
