import { notice } from '@/shared/notice';
import { modalAtom } from '@/jotai/store';
import { useAtom } from 'jotai';

export default function useModal() {
  const [modalState, setModalState] = useAtom(modalAtom);
  const openModal = (
    message: string,
    onClickCheck?: () => void,
    onClickCancel?: () => void
  ) =>
    setModalState({
      isOpen: true,
      message,
      onClickCheck,
      onClickCancel,
    });

  const closeModal = () =>
    setModalState({
      isOpen: false,
      message: '',
      onClickCheck: () => {},
      onClickCancel: () => {},
    });
  return { modalState, setModalState, openModal, closeModal };
}
