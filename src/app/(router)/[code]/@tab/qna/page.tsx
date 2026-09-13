'use client';

import getQna from '@/entities/qna/api/getQna';
import useSplitRoute from '@/shared/hooks/useSplitRoute';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Writer, Range, Btn, ImgBtn } from '@/shared/ui';
import { Qna, Private } from '@/features/qna/ui';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { QnaTemplate } from '@/widgets';

export default function QnaTab() {
  return <QnaTemplate />;
}
