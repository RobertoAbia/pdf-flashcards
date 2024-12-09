'use client';

import PomodoroTimer from '@/components/PomodoroTimer';

export default function PomodoroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center">
              <span className="text-3xl mr-3">⏱️</span>
              Temporizador Pomodoro
            </h2>
            <PomodoroTimer />
          </div>
        </section>
      </div>
    </div>
  );
}