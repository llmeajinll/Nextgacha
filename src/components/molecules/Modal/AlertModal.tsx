'use client';

import React, { useEffect } from 'react';
import { Range, ImgBtn } from '@/components/atoms';
import * as styles from './alertModal.css';
import { modalAtom } from '@/jotai/store';
import { useAtom } from 'jotai';

// {
//   onCheck,
//   twoBtn,
// }: {
//   onCheck?: () => void;
//   twoBtn?: boolean;
// }

export default function AlertModal() {
  const [modalState, setModalState] = useAtom(modalAtom);
  console.log('modalState : ', modalState);
  useEffect(() => {
    console.log('Modal state changed: ', modalState);
  }, [modalState]);

  const ModalBtn = () => {
    return (
      <Range
      // preset='between'
      // height='45'
      // style={{
      //   width: '100px',
      // }}
      >
        <button
          className={styles.modalBtn}
          onClick={() => {
            if (modalState.onClickCheck) modalState.onClickCheck();
            setModalState({ ...modalState, isOpen: false, message: '' });
          }}
        >
          {modalState.onClickCheck ? 'YES' : 'OK'}
        </button>

        {modalState.onClickCheck && (
          <button
            className={styles.modalBtn}
            style={{ marginLeft: '15px' }}
            onClick={() => {
              if (modalState.onClickCancel) modalState.onClickCancel();
              setModalState({
                ...modalState,
                isOpen: false,
                message: '',
                onClickCheck: () => {},
                onClickCancel: () => {},
              });
            }}
          >
            NO
          </button>
        )}
      </Range>
    );
  };

  return (
    <>
      {modalState.isOpen && (
        <div className={styles.backgroundStyle}>
          <div className={styles.modalContainer}>
            <Range
              preset='between'
              width='full'
              height='45'
              style={{
                backgroundColor: '#75C3FE',
                border: '1px solid #75C3FE',
              }}
            >
              <div className={styles.alertText}>ALERT</div>
              <button
                className={styles.closeBtn}
                onClick={() => {
                  setModalState({ ...modalState, isOpen: false, message: '' });
                }}
              ></button>
            </Range>
            <div
              style={{
                width: '100%',
                padding: '25px 20px 20px 20px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className={styles.messageText}>{modalState.message}</div>
              {/* <button
                onClick={() => {
                  setModalState({ ...modalState, isOpen: false, message: '' });
                }}
              >
                ok
              </button> */}
              <ModalBtn />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
