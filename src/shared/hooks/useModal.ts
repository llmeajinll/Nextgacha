import { modalAtom, ModalState } from '@/shared/model/store';
import { useAtom } from 'jotai';

type OpenModalOptions = Pick<
  ModalState,
  'onClickCheck' | 'onClickCancel' | 'onClickClose'
>;

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
