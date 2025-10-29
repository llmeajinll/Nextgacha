'use client';

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { sliderContainer } from './reactSlick.css';
import { reactSlickVariant } from '@/styles/variants.css';
import { Number } from 'mongoose';

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

  let imgCount = image?.length || 0;
  let show = 0;
  let subangle = 360 * (1 / imgCount) - 90;
  console.log(subangle);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev + 360 * (1 / imgCount));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const isStringArray = Array.isArray(image) && typeof image[0] === 'string';

  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
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
      <Slider {...settings}>
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
    </div>
  );
}
