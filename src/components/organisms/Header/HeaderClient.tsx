'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// import { signIn, signOut } from '@/auth';
import { Search, Category } from '@/components/molecules';
import {
  headerContainer,
  logo,
  menuContainer,
  wrap,
  menu,
  reportContainer,
  wrapTextarea,
  search,
} from './header.css';

import Link from 'next/link';

import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

// import { kakaoSignIn, kakaoSignOut } from '@/shared/authActions';
import { Session } from 'next-auth';
import { useSearchParams, usePathname } from 'next/navigation';
import { useSpliteRoute } from '@/app/hooks';
import { useAtom } from 'jotai';
import { userInfoAtom } from '@/jotai/store';
import { Range, ImgBtn, Btn } from '@/components/atoms';
import { textareaStyle } from '@/components/organisms/Modal/reviewModal.css';

export default function Header({ session }: { session: Session | null }) {
  const [showCategory, setShowCategory] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [textareaValue, setTextAreaValue] = useState('');
  const reportRef = useRef<HTMLDivElement | null>(null);
  const { firstRoute } = useSpliteRoute();
  const [{ data, isPending, error }] = useAtom(userInfoAtom);
  const pathname = usePathname();
  console.log(firstRoute);
  console.log('JOTAI userInfoAtom : ', data);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (reportRef.current && !reportRef.current.contains(e.target as Node)) {
        setShowReport(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowReport]);

  return (
    <>
      {firstRoute !== 'manager' && (
        <div className={headerContainer}>
          {showCategory && <Category setShow={setShowCategory} />}
          <div className={menuContainer}>
            <div className={wrap}>
              <Link href='/'>
                <div className={logo}>NEXTGACHA</div>
              </Link>
              <div className={wrap}>
                <span
                  className={menu}
                  onMouseEnter={() => setShowCategory(true)}
                  onMouseLeave={() => setShowCategory(false)}
                >
                  <Link
                    href='/search?type=main&tag=전체 상품&page=1'
                    style={{
                      color: `${firstRoute === 'search' ? '#75C3FE' : ''}`,
                    }}
                  >
                    CATEGORY
                  </Link>
                </span>

                <Link href='/notice'>
                  <span
                    className={menu}
                    style={{
                      color: `${firstRoute === 'notice' ? '#75C3FE' : ''}`,
                    }}
                  >
                    NOTICE
                  </span>
                </Link>
                {session?.user && (
                  <Link href={`/mypage/cart`}>
                    <span
                      className={menu}
                      style={{
                        color: `${firstRoute === 'mypage' ? '#75C3FE' : ''}`,
                      }}
                    >
                      MYPAGE
                    </span>
                  </Link>
                )}
              </div>
            </div>

            <div className={wrap}>
              <Search />
              {session?.user ? (
                // <form action={kakaoSignOut}>
                //   <button className={menu}>LOGOUT</button>
                // </form>

                <button className={menu} onClick={() => signOut()}>
                  LOGOUT
                </button>
              ) : (
                // <form action={kakaoSignIn}>
                //   <button className={menu}>LOGIN</button>
                // </form>
                <button className={menu} onClick={() => signIn('kakao')}>
                  LOGIN
                </button>
              )}
              <div  ref={reportRef}>
                <ImgBtn
                  img='report'
                  title='오류 신고'
                  width={30}
                  height={28}
                  style={{
                    marginLeft: '5px',
                    marginTop: '2px',
                    // marginBottom: '5px',
                    // marginRight: '-1px',
                    // border: '1px solid lightgray',
                    // borderRight: '1px solid white',
                    // padding: '5px 6px 7px 7px',
                    // backgroundColor: 'white',
                    // zIndex: 30,
                  }}
                  onClick={() => {
                    setShowReport((prev) => !prev);
                  }}
                />

                {showReport && (
                  <div className={reportContainer}>
                    <div className={wrapTextarea}>
                      <div
                        style={{
                          fontSize: '20px',
                          marginBottom: '10px',
                          fontWeight: 500,
                        }}
                      >
                        🚨 오류 신고 🚨
                      </div>
                      <textarea
                        placeholder='오류를 입력해주세요 (최소 4자, 최대 200자)'
                        className={textareaStyle}
                        maxLength={200}
                        value={textareaValue}
                        style={{ border: '2px solid #75C3FE' }}
                        onChange={(e) => {
                          setTextAreaValue(e.target.value);
                        }}
                      />
                      <Btn
                        style={{ margin: '5px auto 0 auto' }}
                        onClick={async () => {
                          if (textareaValue.length === 0) {
                            alert('오류를 입력해주세요.');
                            return;
                          }
                          if (
                            textareaValue.length >= 1 &&
                            textareaValue.length <= 4
                          ) {
                            alert('5자 이상 입력해주세요.');
                            return;
                          }
                          await fetch('/api/postError', {
                            method: 'POST',
                            body: JSON.stringify({
                              textareaValue,
                              pathname: decodeURIComponent(pathname),
                            }),
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          }).then(async (res) => {
                            const data = await res.json();
                            console.log(data);
                            if (data.ok === true) {
                              alert('전송되었습니다.');
                              setTextAreaValue('');
                              setShowReport(false);
                            } else {
                              alert('오류가 발생하여 전송되지 못했습니다.');
                              setTextAreaValue('');
                              setShowReport(false);
                            }
                          });
                        }}
                      >
                        SEND ({textareaValue.length})
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
