'use client';

import { usePathname } from 'next/navigation';
import MiniTimer from './MiniTimer';

export const TimerWrapper = () => {
  const pathname = usePathname();

  if (!pathname.startsWith('/dashboard')) {
    return null;
  }

  return <MiniTimer />;
};
