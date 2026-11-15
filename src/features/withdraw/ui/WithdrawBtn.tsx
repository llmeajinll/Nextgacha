'use client';

import { signOut } from 'next-auth/react';
import { useAtomValue } from 'jotai';
import { useModal } from '@/shared/hooks';
import { comma } from '@/shared/lib/comma';
import { userInfoAtom } from '@/entities/user/model/store';
import withdraw from '../api/withdraw';
import { wrap, link } from './withdrawBtn.css';

// 탈퇴 전에 남은 포인트가 사라진다고 알린다
export default function WithdrawBtn() {
  const { data } = useAtomValue(userInfoAtom);
  const { openModal } = useModal();

  const run = async () => {
    try {
      await withdraw();
      await signOut({ callbackUrl: '/' });
    } catch (e) {
      openModal(e instanceof Error ? e.message : '탈퇴 처리에 실패했습니다.');
    }
  };

  return (
    <div className={wrap}>
      <button
        type='button'
        className={link}
        onClick={() =>
          openModal(
            `탈퇴하면 보유 포인트 ${comma(data?.point ?? 0)}P가 사라지고 되돌릴 수 없습니다. 작성한 리뷰·문의는 익명으로 남습니다. 탈퇴할까요?`,
            { onClickCheck: run, onClickCancel: () => {} },
          )
        }
      >
        회원 탈퇴
      </button>
    </div>
  );
}
