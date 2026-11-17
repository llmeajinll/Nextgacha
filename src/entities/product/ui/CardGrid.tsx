import Card from './Card';
import { cardGrid } from './card.css';
import type { CardProps } from '../model/types';

export default function CardGrid({ items }: { items: CardProps[] }) {
  return (
    <div className={cardGrid}>
      {items.map((item) => (
        <Card props={item} key={item._id} />
      ))}
    </div>
  );
}
