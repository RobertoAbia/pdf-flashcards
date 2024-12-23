'use client';

import { useState } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { PlayIcon, PauseIcon, ArrowPathIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import TimerSettingsModal from '@/components/TimerSettingsModal';

export default function PomodoroPage() {
  const [showSettings, setShowSettings] = useState(false);
  const { 
    timer: { timeLeft, isRunning, mode },
    toggleTimer, 
    resetTimer,
    switchMode 
  } = useTimerStore();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <>
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-lg border border-white/20 p-12 w-[36rem] h-[36rem] flex flex-col justify-center relative hover:shadow-xl transition-shadow duration-500">
          {/* Botón de configuración */}
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-5 right-5 p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50/80 rounded-xl transition-all duration-200 group"
          >
            <Cog6ToothIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          </button>

          {/* Selector de modo */}
          <div className="flex justify-center space-x-3 mb-14">
            <button
              onClick={() => switchMode('pomodoro')}
              className={`px-6 py-2.5 rounded-xl text-sm font-inter transition-all duration-200 relative overflow-hidden
                ${mode === 'pomodoro' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md after:absolute after:inset-0 after:bg-white/20 after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-500' 
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:shadow-sm'}`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`px-6 py-2.5 rounded-xl text-sm font-inter transition-all duration-200 relative overflow-hidden
                ${mode === 'shortBreak' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md after:absolute after:inset-0 after:bg-white/20 after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-500' 
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:shadow-sm'}`}
            >
              Descanso Corto
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`px-6 py-2.5 rounded-xl text-sm font-inter transition-all duration-200 relative overflow-hidden
                ${mode === 'longBreak' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md after:absolute after:inset-0 after:bg-white/20 after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-500' 
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:shadow-sm'}`}
            >
              Descanso Largo
            </button>
          </div>

          {/* Timer */}
          <div className="text-center flex-grow flex flex-col justify-center">
            <div className="text-8xl font-inter font-bold text-gray-800 mb-12">
              {timeString}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleTimer}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 relative overflow-hidden after:absolute after:inset-0 after:bg-white/20 after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-500"
              >
                {isRunning ? (
                  <PauseIcon className="h-8 w-8 relative z-10" />
                ) : (
                  <PlayIcon className="h-8 w-8 relative z-10" />
                )}
              </button>
              <button
                onClick={() => resetTimer()}
                className="bg-gray-100/80 p-4 rounded-xl hover:bg-gray-200/80 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 group"
              >
                <ArrowPathIcon className="h-8 w-8 text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de configuración */}
      {showSettings && (
        <TimerSettingsModal onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}