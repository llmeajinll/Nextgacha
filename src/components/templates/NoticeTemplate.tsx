import React, { Fragment } from 'react';
import { Notice } from '../molecules';

export default function NoticeTemplate() {
  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div style={{ width: '960px', margin: '0 auto' }}>
      {list.map((v, i) => (
        <Fragment key={v}>
          <Notice key={v} />
          {i !== list.length - 1 && (
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'lightgray',
              }}
            ></div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
