'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeftIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useFlashcardStore } from '@/store/flashcards';
import { useRouter } from 'next/navigation';
import type { Unit, Flashcard } from '@/types/supabase';
import Link from 'next/link';
import CreateFlashcardForm from '@/components/CreateFlashcardForm';

interface UnitPageProps {
  params: {
    unitId: string;
  };
}

export default function UnitPage({ params }: UnitPageProps) {
  const router = useRouter();
  const { unitId } = params;
  const { loadUnits, loadFlashcards } = useFlashcardStore();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleCloseModal = useCallback(() => {
    setShowCreateForm(false);
    setEditingCard(null);
  }, []);

  const handleCreateFlashcard = async (unit: string, front: string, back: string) => {
    try {
      const { createFlashcard } = useFlashcardStore.getState();
      await createFlashcard(unit, front, back);
      
      const { getFlashcardsByUnit } = useFlashcardStore.getState();
      const updatedFlashcards = getFlashcardsByUnit(unitId);
      setFlashcards(updatedFlashcards);
      
      handleCloseModal();
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  const handleEditFlashcard = async (unit: string, front: string, back: string) => {
    if (!editingCard) return;
    
    try {
      const { updateFlashcard } = useFlashcardStore.getState();
      await updateFlashcard(editingCard.id, { 
        front, 
        back,
        unit_id: unit
      });
      
      // Si la unidad cambió, eliminamos la tarjeta de la vista actual
      if (unit !== unitId) {
        setFlashcards(currentFlashcards => 
          currentFlashcards.filter(f => f.id !== editingCard.id)
        );
      } else {
        // Si la unidad es la misma, actualizamos la tarjeta en la vista actual
        const { getFlashcardsByUnit } = useFlashcardStore.getState();
        const updatedFlashcards = getFlashcardsByUnit(unitId);
        setFlashcards(updatedFlashcards);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      return;
    }

    try {
      setIsDeleting(id);
      const { deleteFlashcard } = useFlashcardStore.getState();
      await deleteFlashcard(id);
      setFlashcards(currentFlashcards => 
        currentFlashcards.filter(f => f.id !== id)
      );
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await loadUnits();
        await loadFlashcards(unitId);
        
        const { getUnit, getFlashcardsByUnit } = useFlashcardStore.getState();
        const unitData = getUnit(unitId);
        const flashcardsData = getFlashcardsByUnit(unitId);
        
        setUnit(unitData || null);
        setFlashcards(flashcardsData);

        if (!unitData) {
          router.push('/units');
        }
      } catch (error) {
        console.error('Error loading unit data:', error);
        router.push('/units');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [unitId, loadUnits, loadFlashcards, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando unidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link 
              href="/units"
              className="text-gray-600 hover:text-gray-800 flex items-center mb-2"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Volver a Unidades
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              {unit?.name}
            </h1>
            {unit?.description && (
              <p className="text-gray-600 mt-1">{unit.description}</p>
            )}
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Crear tarjetas</span>
          </button>
        </div>

        {flashcards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No hay tarjetas en esta unidad</p>
            <p className="text-gray-500">¡Crea tu primera tarjeta para empezar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flashcards.map((flashcard) => (
              <div
                key={flashcard.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
              >
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleCard(flashcard.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{flashcard.front}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCard(flashcard);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Editar tarjeta"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFlashcard(flashcard.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={isDeleting === flashcard.id}
                      title="Eliminar tarjeta"
                    >
                      {isDeleting === flashcard.id ? (
                        <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </button>
                    {expandedCard === flashcard.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {expandedCard === flashcard.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600">{flashcard.back}</p>
                    <div className="mt-2 text-sm text-gray-400">
                      Creada: {new Date(flashcard.created_at).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {(showCreateForm || editingCard) && (
        <CreateFlashcardForm
          onSubmit={editingCard ? handleEditFlashcard : handleCreateFlashcard}
          onClose={handleCloseModal}
          initialUnit={unitId}
          initialFront={editingCard?.front}
          initialBack={editingCard?.back}
        />
      )}
    </div>
  );
}
