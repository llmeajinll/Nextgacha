'use client';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { sliderContainer } from './reactSlick.css';

export default function ReactSlick() {
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className={sliderContainer}>
      <Slider {...settings}>
        <div style={{ width: '450px', height: '450px' }}>
          <Image
            width={450}
            height={450}
            src='/images/image 23.png'
            alt='main'
          />
        </div>

        <div style={{ width: '450px', height: '450px' }}>
          {/* <div style={{ width: '450px', height: '450px' }}>1</div> */}
          <Image
            width={450}
            height={450}
            src='/images/image 23.png'
            alt='main'
          />
        </div>

        <div style={{ width: '450px', height: '450px' }}>
          {/* <div style={{ width: '450px', height: '450px' }}>1</div> */}
          <Image
            width={450}
            height={450}
            src='/images/image 23.png'
            alt='main'
          />
        </div>

        <div style={{ width: '450px', height: '450px' }}>
          {/* <div style={{ width: '450px', height: '450px' }}>1</div> */}
          <Image
            width={450}
            height={450}
            src='/images/image 23.png'
            alt='main'
          />
        </div>
      </Slider>
    </div>
  );
}
