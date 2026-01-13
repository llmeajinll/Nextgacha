'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Range, ImgBtn } from '@/components/atoms';
import * as styles from './alertModal.css';
import { modalAtom } from '@/jotai/store';
import { useAtom } from 'jotai';
import { useModal } from '@/app/hooks';

// {
//   onCheck,
//   twoBtn,
// }: {
//   onCheck?: () => void;
//   twoBtn?: boolean;
// }

export default function AlertModal() {
  const pathname = usePathname();
  const [modalState, setModalState] = useAtom(modalAtom);
  const [isMounted, setIsMounted] = useState(false);
  const { closeModal } = useModal();

  console.log('modalState : ', modalState);

  useEffect(() => {
    setIsMounted(true);
    console.log('Modal state changed: ', modalState);
    if (modalState.isOpen === true) {
      closeModal();
    }
  }, [pathname]);

  if (!isMounted || !modalState.isOpen) return null;

  const ModalBtn = () => {
    return (
      <Range>
        <button
          className={styles.modalBtn}
          onClick={() => {
            if (modalState.onClickCheck) modalState.onClickCheck();
            setModalState({ ...modalState, isOpen: false, message: '' });
          }}
        >
          {modalState.onClickCancel ? 'YES' : 'OK'}
        </button>

        {modalState.onClickCancel && (
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
                  if (modalState.onClickClose) modalState.onClickClose();
                  setModalState({ ...modalState, isOpen: false, message: '' });
                }}
              ></button>
            </Range>
            <div className={styles.contentContainer}>
              <div className={styles.messageText}>{modalState.message}</div>
              <ModalBtn />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
