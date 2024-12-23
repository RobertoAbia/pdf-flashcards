'use client';

import { useState, useEffect } from 'react';
import { useFlashcardStore } from '@/store/flashcards';
import { useParams } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import CreateFlashcardForm from '@/components/CreateFlashcardForm';
import EditFlashcardModal from '@/components/EditFlashcardModal';
import DeleteFlashcardModal from '@/components/DeleteFlashcardModal';
import Link from 'next/link';

export default function UnitPage() {
  const { unitId } = useParams();
  const { loadFlashcards, getUnit, flashcards } = useFlashcardStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<any | null>(null);
  const [deletingFlashcard, setDeletingFlashcard] = useState<any | null>(null);
  const unit = getUnit(unitId as string);

  useEffect(() => {
    if (unitId) {
      loadFlashcards(unitId as string);
    }
  }, [unitId, loadFlashcards]);

  const handleEditSuccess = async () => {
    if (unitId) {
      await loadFlashcards(unitId as string);
    }
  };

  if (!unit) {
    return <div>Unidad no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <Header
          title={unit.name}
          rightContent={
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear tarjeta
            </button>
          }
        />

        {showCreateForm && (
          <CreateFlashcardForm
            unitId={unitId as string}
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => setShowCreateForm(false)}
          />
        )}

        <div className="space-y-4">
          {flashcards.map((flashcard) => (
            <div
              key={flashcard.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    {flashcard.front}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{flashcard.back}</p>
                </div>

                <div className="flex items-center ml-4 space-x-2">
                  <button
                    onClick={() => setEditingFlashcard(flashcard)}
                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setDeletingFlashcard(flashcard)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de edición */}
      {editingFlashcard && (
        <EditFlashcardModal
          flashcard={editingFlashcard}
          onClose={() => setEditingFlashcard(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Modal de eliminación */}
      {deletingFlashcard && (
        <DeleteFlashcardModal
          flashcard={deletingFlashcard}
          onClose={() => setDeletingFlashcard(null)}
          onConfirm={async () => {
            const { deleteFlashcard } = useFlashcardStore.getState();
            try {
              await deleteFlashcard(deletingFlashcard.id);
              await loadFlashcards(unitId as string);
              setDeletingFlashcard(null);
            } catch (error) {
              console.error('Error al eliminar:', error);
            }
          }}
        />
      )}
    </div>
  );
}
