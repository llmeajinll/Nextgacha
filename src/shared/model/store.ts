import { atom } from 'jotai';

export const modalAtom = atom<{
  isOpen: boolean;
  message: string;
  onClickCheck?: () => void;
  onClickCancel?: () => void;
  onClickClose?: () => void;
}>({
  isOpen: false,
  message: 'test',
  onClickCheck: () => {},
  onClickCancel: () => {},
  onClickClose: () => {},
});
