'use client';

import { useState, useEffect } from 'react';
import { useFlashcardStore } from '@/store/flashcards';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface EditFlashcardModalProps {
  flashcard: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditFlashcardModal({ flashcard, onClose, onSuccess }: EditFlashcardModalProps) {
  const { updateFlashcard, loadUnits, units: storeUnits } = useFlashcardStore();
  const [front, setFront] = useState(flashcard.front);
  const [back, setBack] = useState(flashcard.back);
  const [unitId, setUnitId] = useState(flashcard.unit_id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);

  useEffect(() => {
    const loadUnitData = async () => {
      setIsLoadingUnits(true);
      try {
        await loadUnits();
      } catch (err) {
        console.error('Error loading units:', err);
        setError('Error al cargar las unidades');
      } finally {
        setIsLoadingUnits(false);
      }
    };
    loadUnitData();
  }, [loadUnits]);

  const handleClose = () => {
    onSuccess(); // Llamamos a onSuccess para recargar las tarjetas
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front || !back) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateFlashcard(flashcard.id, {
        front,
        back,
        unit_id: unitId
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al actualizar la tarjeta:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar la tarjeta');
    } finally {
      setIsLoading(false);
    }
  };

  // Usar el hook para cerrar con Escape
  useEscapeKey(handleClose);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 flex flex-col max-h-[90vh]">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="text-2xl mr-3">✏️</span>
              Editar Tarjeta
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de unidad */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                Unidad
              </label>
              <select
                id="unit"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                disabled={isLoadingUnits}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {isLoadingUnits ? (
                  <option>Cargando unidades...</option>
                ) : (
                  storeUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Campo pregunta */}
            <div>
              <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-2">
                Pregunta
              </label>
              <textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[150px]"
              />
            </div>

            {/* Campo respuesta */}
            <div>
              <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-2">
                Respuesta
              </label>
              <textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[150px]"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
