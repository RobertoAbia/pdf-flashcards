'use client';

import { useState, useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';

interface StudyStats {
  totalTimeStudied: number; // en minutos
  sessionsCompleted: number;
  streakDays: number;
  lastStudyDate?: Date;
}

interface StudyTrackerProps {
  stats: StudyStats;
}

export default function StudyTracker() {
  const { stats } = useTimerStore();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-fit">
      <div className="flex flex-col items-start">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Estadísticas de Estudio</h2>
        <div className="grid grid-cols-1 gap-4 w-full">
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium text-gray-600">
              Tiempo total de estudio
            </div>
            <div className="text-2xl font-bold">
              {Math.floor(stats.totalStudyTime / 60)} horas {stats.totalStudyTime % 60} minutos
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium text-gray-600">
              Pomodoros completados
            </div>
            <div className="text-2xl font-bold">
              {stats.completedPomodoros}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium text-gray-600">
              Racha diaria
            </div>
            <div className="text-2xl font-bold">
              {stats.dailyStreak} días
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
