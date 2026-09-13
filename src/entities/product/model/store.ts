import { atom } from 'jotai';
import { CardProps } from './types';

export const searchProductsAtom = atom<CardProps[]>([]);
