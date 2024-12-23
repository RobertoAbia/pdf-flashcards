'use client';

import { useState, useEffect } from 'react';
import { useFlashcardStore } from '@/store/flashcards';
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import CreateUnitModal from '@/components/CreateUnitModal';
import EditUnitModal from '@/components/EditUnitModal';
import Header from '@/components/Header';

export default function UnitsPage() {
  const { units, loadUnits, getFlashcardCountsByDifficulty } = useFlashcardStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const handleDeleteUnit = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta unidad? Se eliminarán también todas las tarjetas asociadas.')) {
      return;
    }

    try {
      setIsDeleting(id);
      const { deleteUnit } = useFlashcardStore.getState();
      await deleteUnit(id);
    } catch (error) {
      console.error('Error deleting unit:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <Header
          title="Unidades"
          rightContent={
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear unidad
            </button>
          }
        />

        {/* Modal de creación */}
        {showCreateModal && (
          <CreateUnitModal onClose={() => setShowCreateModal(false)} />
        )}

        {/* Modal de edición */}
        {editingUnit && (
          <EditUnitModal
            unit={editingUnit}
            onClose={() => setEditingUnit(null)}
          />
        )}

        <div className="space-y-4">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-center justify-between">
                <Link
                  href={`/units/${unit.id}`}
                  className="flex-1 group"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-500 transition-colors">
                      {unit.name}
                    </h3>
                    {unit.description && (
                      <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
                    )}
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-green-100 text-green-800 rounded">
                          {getFlashcardCountsByDifficulty(unit.id).easy}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">Fácil</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                          {getFlashcardCountsByDifficulty(unit.id).medium}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">Media</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-red-100 text-red-800 rounded">
                          {getFlashcardCountsByDifficulty(unit.id).hard}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">Difícil</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingUnit(unit)}
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUnit(unit.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    disabled={isDeleting === unit.id}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                  <Link href={`/units/${unit.id}`} className="text-gray-400 hover:text-blue-500 transition-colors">
                    <ChevronRightIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
