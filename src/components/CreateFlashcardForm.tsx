'use client';

import { useState } from 'react';
import { useFlashcardStore } from '@/store/flashcards';

interface CreateFlashcardFormProps {
  unitId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateFlashcardForm({
  unitId,
  onClose,
  onSuccess,
}: CreateFlashcardFormProps) {
  const { createFlashcard } = useFlashcardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front || !back) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createFlashcard(unitId, front, back);
      setFront('');
      setBack('');
      onSuccess();
      onClose();
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
        <h2 className="text-xl font-bold text-gray-800 mb-4">Crear nueva tarjeta</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-1">
              Pregunta
            </label>
            <textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Escribe la respuesta..."
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
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
              {isLoading ? 'Creando...' : 'Crear tarjeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
