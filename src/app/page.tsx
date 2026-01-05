// import { useEffect, useState } from 'react';
import SignIn from '@/app/(router)/signin/page';
import { HomePage } from '@/components/pages';

export default function Home() {
  // const [test, setTest] = useState('');

  // useEffect(() => {
  //   fetch('/api/Test')
  //     .then((data) => {
  //       console.log(data);
  //       setTest(data.message);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //       setTest('fail');
  //     });
  // }, []);

  return (
    <div style={{ position: 'relative' }}>
      <HomePage />
    </div>
  );
}
