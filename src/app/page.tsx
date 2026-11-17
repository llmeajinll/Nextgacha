import { HomePage } from '@/views';
import { relativeWrap } from './layout.css';

export default function Home() {
  return (
    <div className={relativeWrap}>
      <HomePage />
    </div>
  );
}
