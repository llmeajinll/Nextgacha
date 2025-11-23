import React from 'react';
import { usePathname } from 'next/navigation';

export default function useSplitRoute() {
  const pathname = usePathname();

  const route = pathname.split('/').slice(1);

  const firstRoute = route[0];
  const secondRoute = route[1];

  const seperatedRoute = firstRoute.match(/[a-zA-Z]+|[0-9]+/g);

  return { firstRoute, secondRoute, route, seperatedRoute };
}
