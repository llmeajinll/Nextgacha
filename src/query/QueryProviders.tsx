// lib/getQueryClient.ts
'use client';
import { useState } from 'react';
import {
  QueryClient,
  defaultShouldDehydrateQuery,
  QueryClientProvider,
} from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // 성공한 쿼리만 클라이언트로 전달하도록 설정
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: 항상 새로운 queryClient 생성
    return makeQueryClient();
  } else {
    // Browser: 다시 만들지 않고 기존에 이미 client 존재시 해당 client 제공
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: suspense boundary 로 로딩 이 잡히지 않는경우, useState 를 사용하여 초기화한다면, clinet 는 유실된다.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// export default function getQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         staleTime: 60 * 1000,
//       },
//       dehydrate: {
//         shouldDehydrateQuery: (query) =>
//           defaultShouldDehydrateQuery(query) ||
//           query.state.status === 'pending',
//       },
//     },
//   });
// }
