import React from 'react';
import { usePathname } from 'next/navigation';

export default function useSplitRoute() {
  const pathname = usePathname();

  const route = pathname.split('/').slice(1);
  const firstRoute = route[0];
  const secondRoute = route[1];

  const seperatedRoute = route[0].split(/(?=\d)/);

  return { firstRoute, secondRoute, route, seperatedRoute };
}
