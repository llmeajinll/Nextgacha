'use client';

import getQna from '@/api/getQna';
import useSplitRoute from '@/app/hooks/useSplitRoute';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Writer, Range, Btn, ImgBtn } from '@/components/atoms';
import { Qna, Private } from '@/components/molecules';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { QnaTemplate } from '@/components/templates';

export default function QnaTab() {
  return <QnaTemplate />;
}
