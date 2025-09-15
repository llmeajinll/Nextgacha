import { title } from './title.css';
import React from 'react';

export default function Title(props: { text: string }) {
  return <div className={title}>{props.text}</div>;
}
