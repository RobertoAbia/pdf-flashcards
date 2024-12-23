'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTimerStore } from '@/store/timerStore';

interface TimerSettingsModalProps {
  onClose: () => void;
}

export default function TimerSettingsModal({ onClose }: TimerSettingsModalProps) {
  const { settings, updateSettings } = useTimerStore();
  const [formData, setFormData] = useState({
    pomodoro: settings.pomodoro,
    shortBreak: settings.shortBreak,
    longBreak: settings.longBreak,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Configuración del Timer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo de Pomodoro (minutos)
            </label>
            <input
              type="number"
              name="pomodoro"
              value={formData.pomodoro}
              onChange={handleChange}
              min="1"
              max="60"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descanso Corto (minutos)
            </label>
            <input
              type="number"
              name="shortBreak"
              value={formData.shortBreak}
              onChange={handleChange}
              min="1"
              max="30"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descanso Largo (minutos)
            </label>
            <input
              type="number"
              name="longBreak"
              value={formData.longBreak}
              onChange={handleChange}
              min="1"
              max="60"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
