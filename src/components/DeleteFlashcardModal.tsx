'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface DeleteFlashcardModalProps {
  flashcard: any;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteFlashcardModal({ flashcard, onClose, onConfirm }: DeleteFlashcardModalProps) {
  // Usar el hook para cerrar con Escape
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Eliminar Tarjeta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que quieres eliminar esta tarjeta?
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-500">Pregunta:</span>
              <p className="mt-1 text-gray-800">{flashcard.front}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Respuesta:</span>
              <p className="mt-1 text-gray-800">{flashcard.back}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
