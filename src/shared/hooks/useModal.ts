import { notice } from '@/shared/notice';
import { modalAtom } from '@/jotai/store';
import { useAtom } from 'jotai';

type OpenModalOptions = {
  onClickCheck?: () => void;
  onClickCancel?: () => void;
  onClickClose?: () => void;
};

export default function useModal() {
  const [modalState, setModalState] = useAtom(modalAtom);

  const openModal = (message: string, options?: OpenModalOptions) =>
    setModalState({
      isOpen: true,
      message,
      ...options,
    });

  const closeModal = () => {
    setModalState({
      isOpen: false,
      message: '',
      onClickCheck: () => {},
      onClickCancel: () => {},
      onClickClose: () => {},
    });
  };
  return { modalState, setModalState, openModal, closeModal };
}
