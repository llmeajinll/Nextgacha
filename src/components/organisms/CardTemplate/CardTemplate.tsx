import React from 'react';
import { Card } from '@/components/molecules';
import { cardTemplateContainer } from './cardtemplate.css';
import { Title } from '@/components/atoms';

export default function CardTemplate() {
  return (
    <>
      <div className={cardTemplateContainer}>
        <Card id='reserve1' />
        <Card id='reserve2' />
        <Card id='reserve3' />
        <Card id='reserve4' />
        <Card id='reserve5' />
        <Card id='reserve6' />
        <Card id='reserve7' />
        <Card id='reserve8' />
      </div>
    </>
  );
}
