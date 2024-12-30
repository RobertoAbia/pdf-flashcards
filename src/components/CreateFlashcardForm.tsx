'use client';

import { useState } from 'react';
import { useFlashcardStore } from '@/store/flashcards';

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
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 whitespace-pre-wrap"
              rows={3}
              placeholder="Escribe la pregunta..."
              style={{ whiteSpace: 'pre-line' }}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 whitespace-pre-wrap"
              rows={3}
              placeholder="Escribe la respuesta..."
              style={{ whiteSpace: 'pre-line' }}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (initialFront ? 'Guardando...' : 'Creando...') : (initialFront ? 'Guardar cambios' : 'Crear tarjeta')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
