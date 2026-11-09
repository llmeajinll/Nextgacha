'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Close } from 'pixelarticons/react';
import { Range, ImgBtn } from '@/shared/ui';
import * as styles from './alertModal.css';
import { modalAtom } from '@/shared/model/store';
import { useAtom } from 'jotai';
import { useModal } from '@/shared/hooks';

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

  const renderModalBtn = () => {
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
            className={`${styles.modalBtn} ${styles.secondBtn}`}
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
              className={styles.headerBar}
            >
              <div className={styles.alertText}>ALERT</div>
              <button
                className={styles.closeBtn}
                aria-label='닫기'
                onClick={() => {
                  if (modalState.onClickClose) modalState.onClickClose();
                  setModalState({ ...modalState, isOpen: false, message: '' });
                }}
              >
                <Close width={28} height={28} aria-hidden />
              </button>
            </Range>
            <div className={styles.contentContainer}>
              <div className={styles.messageText}>{modalState.message}</div>
              {renderModalBtn()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
