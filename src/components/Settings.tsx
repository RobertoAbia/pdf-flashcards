'use client';

import { useTimerStore } from '@/store/timerStore';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const { settings, updateSettings } = useTimerStore();

  const handleChange = (key: string, value: number | boolean) => {
    updateSettings({ [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 animate-float">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-2xl mr-3">⚙️</span>
            Configuración del Temporizador
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo de Pomodoro (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.pomodoro}
              onChange={(e) => handleChange('pomodoro', parseInt(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descanso Corto (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.shortBreak}
              onChange={(e) => handleChange('shortBreak', parseInt(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descanso Largo (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.longBreak}
              onChange={(e) => handleChange('longBreak', parseInt(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <label className="text-sm font-medium text-gray-700">
              Iniciar descansos automáticamente
            </label>
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <label className="text-sm font-medium text-gray-700">
              Sonido de notificación
            </label>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleChange('soundEnabled', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
