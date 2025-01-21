'use client';

import { useState } from 'react';
import { useFlashcardStore } from '@/store/flashcards';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface CreateFlashcardFormProps {
  handleSubmit: (unit: string, front: string, back: string) => Promise<void>;
  handleClose: () => void;
  initialUnit: string;
  initialFront?: string;
  initialBack?: string;
}

export default function CreateFlashcardForm({
  handleSubmit,
  handleClose,
  initialUnit,
  initialFront = '',
  initialBack = '',
}: CreateFlashcardFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);
  const [error, setError] = useState<string | null>(null);

  // Usar el hook para cerrar con Escape
  useEscapeKey(handleClose);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front || !back) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await handleSubmit(initialUnit, front, back);
      setFront('');
      setBack('');
      handleClose();
    } catch (err) {
      console.error('Error al crear la tarjeta:', err);
      setError(err instanceof Error ? err.message : 'Error al crear la tarjeta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full flex flex-col max-h-[90vh]">
        <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-3">📝</span>
            {initialFront ? 'Editar tarjeta' : 'Crear nueva tarjeta'}
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta
              </label>
              <textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                placeholder="Escribe la pregunta..."
              />
            </div>

            <div>
              <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-1">
                Respuesta
              </label>
              <textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                placeholder="Escribe la respuesta..."
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (initialFront ? 'Guardando...' : 'Creando...') : (initialFront ? 'Guardar cambios' : 'Crear tarjeta')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
