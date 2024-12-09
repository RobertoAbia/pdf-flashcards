'use client';

import { useState } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { CircularProgress } from './CircularProgress';
import { Settings } from './Settings';
import { CogIcon, PlayIcon, PauseIcon, ForwardIcon } from '@heroicons/react/24/outline';

export default function PomodoroTimer() {
  const {
    settings,
    timer: { timeLeft, isRunning, mode },
    toggleTimer,
    resetTimer,
    switchMode,
  } = useTimerStore();

  const [showSettings, setShowSettings] = useState(false);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalDurationSeconds = settings[mode] * 60;
  const progress = (totalDurationSeconds - timeLeft) / totalDurationSeconds;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] relative">
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Configuración"
      >
        <CogIcon className="w-6 h-6 text-gray-600" />
      </button>

      {/* Selector de modo */}
      <div className="flex justify-center space-x-3 mb-12">
        {[
          { mode: 'pomodoro' as const, label: 'Pomodoro' },
          { mode: 'shortBreak' as const, label: 'Descanso Corto' },
          { mode: 'longBreak' as const, label: 'Descanso Largo' }
        ].map(({ mode: modeOption, label }) => (
          <button
            key={modeOption}
            onClick={() => switchMode(modeOption)}
            className={`px-6 py-3 rounded-2xl transition-all duration-300 font-medium text-sm ${
              mode === modeOption 
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative">
        <CircularProgress progress={progress} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={toggleTimer}
          className="p-6 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          {isRunning ? (
            <PauseIcon className="w-8 h-8" />
          ) : (
            <PlayIcon className="w-8 h-8" />
          )}
        </button>
        <button
          onClick={() => resetTimer(mode)}
          className="p-6 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl"
        >
          <ForwardIcon className="w-8 h-8" />
        </button>
      </div>

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
