'use client';

import { usePathname } from 'next/navigation';
import { MiniTimer } from './MiniTimer';

export const TimerWrapper = () => {
  const pathname = usePathname();
  const showMiniTimer = pathname !== '/pomodoro';

  if (!showMiniTimer) return null;
  
  return <MiniTimer />;
};
