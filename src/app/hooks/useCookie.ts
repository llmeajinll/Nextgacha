// import { useEffect, useState } from 'react';
// import {
//   getCookie as clientGetCookie,
//   setCookie as clientSetCookie,
//   deleteCookie as clientDeleteCookie,
//   hasCookie as clientHasCookie,
// } from 'cookies-next/client';
// import {
//   getCookie as serverGetCookie,
//   setCookie as serverSetCookie,
//   deleteCookie as serverDeleteCookie,
//   hasCookie as serverHasCookie,
// } from 'cookies-next/server';
// import { cookies } from 'next/headers';

// export async function useCookie() {
//   const [value, setValue] = useState<boolean | undefined>(undefined);

//   useEffect(() => {
//     if (typeof window === 'object') {
//       setValue(clientHasCookie('authjs.session-token') as boolean | undefined);
//     }
//   }, []);

//   //   const set = (value: string, options?: Record<string, any>) => {
//   //     if (typeof window !== 'undefined') {
//   //       setCookie(name, value, options);
//   //       setValue(value);
//   //     } else {
//   //       const cookieStore = cookies();
//   //       cookieStore.set(name, value, { httpOnly: true, secure: true, path: '/' });
//   //     }
//   //   };

//   const has = async () => {
//     if (typeof window !== 'undefined') {
//       console.log('first: ', clientHasCookie('authjs.session-token'));
//       return clientHasCookie('authjs.session-token');
//     } else {
//       console.log('second: ', clientHasCookie('authjs.session-token'));
//       return await serverHasCookie('authjs.session-token');
//     }
//   };

//   return { value, has };
// }
