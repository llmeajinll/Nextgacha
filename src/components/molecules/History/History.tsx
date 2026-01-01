import Image from 'next/image';
import { Range } from '@/components/atoms';
import { LabelTitle } from '@/components/molecules';
import dayjs from 'dayjs';
import { comma } from '@/shared/comma';
import { imageStyle, Title, contentStyle } from './history.css';

export default function History({ props }: { props: any }) {
  // console.log('props:', props);

  const ListContent = ({ val }: { val: { name: string; count: number } }) => {
    return (
      <Range gap='10' width='340' className={contentStyle}>
        <div>
          {val.name}: {val.count}개
        </div>
      </Range>
    );
  };

  return (
    <Range gap='15' style={{ width: '620px' }} preset='left'>
      {/* <Image
        alt='img'
        src={
          props.list[0].num
            ? `${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}${props.list[0].num}`
            : '/images/defaultImg.png'
        }
        width={200}
        height={200}
        className={imageStyle}
      /> */}
      <Range preset='columnBetween' gap='8' style={{ padding: '3px 0 0 0' }}>
        {/* <div className={Title}>{props.product.title}</div> */}
        <LabelTitle
          label='택배사'
          content={props.courier ? props.courier : '준비중'}
        />
        <LabelTitle
          label='운송장'
          content={props.invoice ? props.invoice : '준비중'}
        />
        <LabelTitle
          label='주문일'
          content={dayjs(props.created_at).format('YYYY년 MM월 DD일 HH시 mm분')}
        />
        <LabelTitle label='배송지' content={props.address} />
        <LabelTitle label='상태' content={props.status} />
        <LabelTitle label='가격' content={`${comma(props.totalPrice)}원`} />
        <LabelTitle
          label='내역'
          content={
            <Range
              gap='4 10'
              width='340'
              preset='left'
              style={{
                flexWrap: 'wrap',
              }}
            >
              {props.list.map((value: any) => {
                return value.product.map((val: any, idx: number) => (
                  <div key={value.num + idx} className={contentStyle}>
                    {val.name} : {val.count}개
                  </div>
                ));
              })}
            </Range>
          }
        />
      </Range>
    </Range>
  );
}
