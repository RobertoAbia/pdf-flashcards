'use client';

import { PlayIcon, PauseIcon, ArrowPathIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useTimerStore } from '@/store/timerStore';

export default function MiniTimer() {
  const router = useRouter();
  const { 
    timer: { timeLeft, isRunning, mode },
    toggleTimer,
    resetTimer,
  } = useTimerStore();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white rounded-2xl shadow-lg flex items-center space-x-4 p-2 border border-gray-100">
      <div className="text-xl font-bold text-blue-600 px-2">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTimer}
          className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {isRunning ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => resetTimer(mode)}
          className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => router.push('/pomodoro')}
          className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
