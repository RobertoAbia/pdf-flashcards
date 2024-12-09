'use client';

import { useState, useEffect } from 'react';

interface StudyStats {
  totalTimeStudied: number; // en minutos
  sessionsCompleted: number;
  streakDays: number;
  lastStudyDate?: Date;
}

interface StudyTrackerProps {
  stats: StudyStats;
}

export default function StudyTracker({ stats }: StudyTrackerProps) {
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
              {Math.floor(stats.totalTimeStudied / 60)} horas {stats.totalTimeStudied % 60} minutos
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium text-gray-600">
              Sesiones completadas
            </div>
            <div className="text-2xl font-bold">
              {stats.sessionsCompleted}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium text-gray-600">
              Racha
            </div>
            <div className="text-2xl font-bold">
              {stats.streakDays} días
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
