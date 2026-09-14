import { atom } from 'jotai';

export type ModalState = {
  isOpen: boolean;
  message: string;
  onClickCheck?: () => void;
  onClickCancel?: () => void;
  onClickClose?: () => void;
};

export const modalAtom = atom<ModalState>({
  isOpen: false,
  message: 'test',
  onClickCheck: () => {},
  onClickCancel: () => {},
  onClickClose: () => {},
});
