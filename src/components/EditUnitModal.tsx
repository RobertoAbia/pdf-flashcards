'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { updateUnit } from '@/lib/units';
import { useFlashcardStore } from '@/store/flashcards';

interface EditUnitModalProps {
  unit: {
    id: string;
    name: string;
    description?: string | null;
  };
  onClose: () => void;
}

export default function EditUnitModal({ unit, onClose }: EditUnitModalProps) {
  const router = useRouter();
  const { loadUnits } = useFlashcardStore();
  const [unitData, setUnitData] = useState({ 
    name: unit.name, 
    description: unit.description || '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditUnit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!unitData.name.trim()) {
        throw new Error('El nombre de la unidad es requerido');
      }

      // Llamar a la función updateUnit con los parámetros correctos
      const result = await updateUnit(
        unit.id,
        unitData.name.trim(),
        unitData.description.trim() || null
      );

      if (!result) {
        throw new Error('No se pudo actualizar la unidad');
      }

      await loadUnits();
      router.refresh();
      onClose();
    } catch (err) {
      console.error('Error updating unit:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Error al actualizar la unidad. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 animate-float">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-2xl mr-3">✏️</span>
            Editar Unidad
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleEditUnit(); }} className="space-y-6">
          <div>
            <label htmlFor="unit-name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Unidad
            </label>
            <input
              type="text"
              id="unit-name"
              value={unitData.name}
              onChange={(e) => setUnitData({ ...unitData, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="unit-description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="unit-description"
              value={unitData.description}
              onChange={(e) => setUnitData({ ...unitData, description: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
              placeholder="Opcional: añade una descripción para esta unidad"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <span className="inline-block animate-spin mr-2">⏳</span>
              ) : null}
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
