'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTimerStore } from '@/store/timerStore';
import { useEscapeKey } from '@/hooks/useEscapeKey';

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

  // Usar el hook para cerrar con Escape
  useEscapeKey(onClose);

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
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 flex flex-col max-h-[90vh]">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="text-2xl mr-3">⚙️</span>
              Configuración del temporizador
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="pomodoro" className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de Pomodoro (minutos)
              </label>
              <input
                type="number"
                id="pomodoro"
                name="pomodoro"
                value={formData.pomodoro}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="shortBreak" className="block text-sm font-medium text-gray-700 mb-2">
                Descanso corto (minutos)
              </label>
              <input
                type="number"
                id="shortBreak"
                name="shortBreak"
                value={formData.shortBreak}
                onChange={handleChange}
                min="1"
                max="30"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="longBreak" className="block text-sm font-medium text-gray-700 mb-2">
                Descanso largo (minutos)
              </label>
              <input
                type="number"
                id="longBreak"
                name="longBreak"
                value={formData.longBreak}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
