'use client';

import { useState, useEffect, useRef } from 'react';
import { useFlashcardStore } from '@/store/flashcards';
import { ChevronRightIcon, ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import EditFlashcardModal from '@/components/EditFlashcardModal';
import DeleteFlashcardModal from '@/components/DeleteFlashcardModal';
import StudyStats from '@/components/StudyStats';
import { useRouter } from 'next/navigation';

export default function FlashcardsPage() {
  const { loadUnits, loadAllFlashcards, updateFlashcardDifficulty, markFlashcardReviewed, deleteFlashcard, createFlashcard } = useFlashcardStore();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dueFlashcards, setDueFlashcards] = useState<any[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<any | null>(null);
  const [deletingFlashcard, setDeletingFlashcard] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { units } = useFlashcardStore();
  const statsRef = useRef<{ reloadStats: () => Promise<void> }>();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await loadUnits();
        await loadAllFlashcards();
        
        const { flashcards, units } = useFlashcardStore.getState();
        
        // Obtener el ID de la unidad actual de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const unitId = urlParams.get('unit');
        setCurrentUnitId(unitId);
        
        // Filtrar las tarjetas que toca repasar hoy o antes
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const dueCards = flashcards
          .filter(card => {
            // Si hay un unitId en la URL, solo mostrar tarjetas de esa unidad
            if (unitId && card.unit_id !== unitId) return false;
            
            if (!card.next_review) return true;
            const nextReview = new Date(card.next_review);
            nextReview.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= 0;
          })
          .map(card => ({
            ...card,
            unitName: units.find(u => u.id === card.unit_id)?.name || 'Unidad desconocida'
          }))
          .sort((a, b) => {
            if (!a.next_review) return -1;
            if (!b.next_review) return 1;
            return new Date(a.next_review).getTime() - new Date(b.next_review).getTime();
          });

        console.log('Tarjetas pendientes:', dueCards);
        setDueFlashcards(dueCards);
      } catch (error) {
        console.error('Error loading flashcards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadUnits, loadAllFlashcards]);

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex(prev => (prev + 1) % dueFlashcards.length);
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentIndex(prev => (prev - 1 + dueFlashcards.length) % dueFlashcards.length);
  };

  const handleDifficultyResponse = async (difficulty: 'easy' | 'medium' | 'hard') => {
    const currentCard = dueFlashcards[currentIndex];
    if (!currentCard) return;

    try {
      console.log('Evaluando tarjeta:', currentCard.id, 'con dificultad:', difficulty);
      const updatedCard = await updateFlashcardDifficulty(currentCard.id, difficulty);
      console.log('Tarjeta actualizada:', updatedCard);

      // Si es la última tarjeta, recargar las estadísticas
      if (currentIndex === dueFlashcards.length - 1) {
        await statsRef.current?.reloadStats();
      }

      setShowAnswer(false);
      
      // Actualizar la lista de tarjetas pendientes
      setDueFlashcards(current => 
        current.filter((_, index) => index !== currentIndex)
      );

      // Si no quedan más tarjetas, volver al índice 0
      if (currentIndex >= dueFlashcards.length - 1) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error detallado al actualizar la tarjeta:', error);
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
      }
    }
  };

  const handleEditFlashcard = async (e: React.MouseEvent, flashcard: any) => {
    e.stopPropagation();
    setEditingFlashcard(flashcard);
  };

  const handleEditSuccess = async () => {
    // Recargar todas las flashcards
    await loadAllFlashcards();
    const { flashcards, units } = useFlashcardStore.getState();
    
    // Filtrar las tarjetas que toca repasar hoy o antes
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const dueCards = flashcards
      .filter(card => {
        // Si hay un unitId en la URL, solo mostrar tarjetas de esa unidad
        if (currentUnitId && card.unit_id !== currentUnitId) return false;
        
        if (!card.next_review) return true;
        const nextReview = new Date(card.next_review);
        nextReview.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 0;
      })
      .map(card => ({
        ...card,
        unitName: units.find(u => u.id === card.unit_id)?.name || 'Unidad desconocida'
      }))
      .sort((a, b) => {
        if (!a.next_review) return -1;
        if (!b.next_review) return 1;
        return new Date(a.next_review).getTime() - new Date(b.next_review).getTime();
      });

    setDueFlashcards(dueCards);
  };

  const handleDeleteFlashcard = async (e: React.MouseEvent, flashcard: any) => {
    e.stopPropagation();
    setDeletingFlashcard(flashcard);
  };

  const handleCreateFlashcard = async () => {
    if (!currentUnitId || !newFront.trim() || !newBack.trim()) return;

    try {
      setIsCreating(true);
      const newCard = await createFlashcard(currentUnitId, newFront.trim(), newBack.trim());
      
      // Limpiar el formulario y cerrar el modal
      setNewFront('');
      setNewBack('');
      setShowCreateModal(false);
      
      // Obtener el nombre de la unidad
      const { units } = useFlashcardStore.getState();
      const unitName = units.find(u => u.id === currentUnitId)?.name || 'Unidad desconocida';

      // Añadir la nueva tarjeta a la lista existente
      setDueFlashcards(prev => [...prev, { ...newCard, unitName }]);
      
    } catch (error) {
      console.error('Error al crear la tarjeta:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenCreateModal = () => {
    console.log('Abriendo modal...');
    setShowCreateModal(true);
  };

  return (
    <>
      {/* Modal de crear tarjeta */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Crear nueva tarjeta</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unidad
              </label>
              <select
                id="unit"
                value={currentUnitId || ''}
                onChange={(e) => setCurrentUnitId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona una unidad</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta
              </label>
              <textarea
                id="front"
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder="Escribe la pregunta..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-1">
                Respuesta
              </label>
              <textarea
                id="back"
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                placeholder="Escribe la respuesta..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewFront('');
                  setNewBack('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isCreating}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFlashcard}
                disabled={isCreating || !currentUnitId || !newFront.trim() || !newBack.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creando...' : 'Crear tarjeta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-1.5" />
                Crear tarjeta
              </button>
              <StudyStats ref={statsRef} />
            </div>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : dueFlashcards.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-1.5" />
                Crear tarjeta
              </button>
              <StudyStats ref={statsRef} />
            </div>
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Enhorabuena! Estás al día con tus tarjetas</h2>
              <p className="text-gray-600">Puedes seguir estudiando tu temario</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-1.5" />
                Crear tarjeta
              </button>
              <StudyStats ref={statsRef} />
            </div>
            <div className="flex justify-between items-center mb-8">
              <div className="text-sm font-medium text-gray-500">
                Tarjeta {currentIndex + 1} de {dueFlashcards.length}
              </div>
            </div>

            <div className="relative">
              {/* Barra de progreso */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / dueFlashcards.length) * 100}%` }}
                />
              </div>

              <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-100 mt-6 hover:shadow-xl transition-shadow duration-300">
                {/* Encabezado de la tarjeta */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {dueFlashcards[currentIndex].unitName}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        Revisión #{dueFlashcards[currentIndex].review_count || 0 + 1}
                      </span>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditFlashcard(e, dueFlashcards[currentIndex]);
                          }}
                          className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-400 hover:text-blue-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFlashcard(e, dueFlashcards[currentIndex]);
                          }}
                          className="p-2 rounded-full hover:bg-red-50 transition-all duration-200 text-gray-400 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div 
                  className="p-8 cursor-pointer select-none"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  <div className="min-h-[200px] flex items-center justify-center">
                    <div className="text-center max-w-2xl">
                      <div className="text-xl font-medium text-gray-800 mb-4 leading-relaxed">
                        {showAnswer ? dueFlashcards[currentIndex].back : dueFlashcards[currentIndex].front}
                      </div>
                      {!showAnswer && (
                        <div className="inline-flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                          <span>Haz clic para ver la respuesta</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones de calificación */}
                {showAnswer && (
                  <div className="border-t border-gray-100 p-6">
                    <div className="text-center mb-4">
                      <span className="text-sm font-medium text-gray-600">
                        ¿Qué tal lo has hecho?
                      </span>
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleDifficultyResponse('hard')}
                        className="flex-1 max-w-[150px] px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        Difícil
                      </button>
                      <button
                        onClick={() => handleDifficultyResponse('medium')}
                        className="flex-1 max-w-[150px] px-6 py-3 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 transition-colors font-medium text-sm"
                      >
                        Regular
                      </button>
                      <button
                        onClick={() => handleDifficultyResponse('easy')}
                        className="flex-1 max-w-[150px] px-6 py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium text-sm"
                      >
                        Fácil
                      </button>
                    </div>
                  </div>
                )}

                {/* Navegación */}
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={handlePrevious}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeftIcon className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Anterior</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={currentIndex === dueFlashcards.length - 1}
                  >
                    <span className="text-sm font-medium">Siguiente</span>
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Otros modales */}
      {editingFlashcard && (
        <EditFlashcardModal
          flashcard={editingFlashcard}
          onClose={() => setEditingFlashcard(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingFlashcard && (
        <DeleteFlashcardModal
          flashcard={deletingFlashcard}
          onClose={() => setDeletingFlashcard(null)}
          onConfirm={async () => {
            const { deleteFlashcard } = useFlashcardStore.getState();
            try {
              await deleteFlashcard(deletingFlashcard.id);
              await loadAllFlashcards();
              const { flashcards, units } = useFlashcardStore.getState();
              
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              
              const dueCards = flashcards
                .filter(card => {
                  // Si hay un unitId en la URL, solo mostrar tarjetas de esa unidad
                  if (currentUnitId && card.unit_id !== currentUnitId) return false;
                  
                  if (!card.next_review) return true;
                  const nextReview = new Date(card.next_review);
                  nextReview.setHours(0, 0, 0, 0);
                  const diffDays = Math.floor((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return diffDays <= 0;
                })
                .map(card => ({
                  ...card,
                  unitName: units.find(u => u.id === card.unit_id)?.name || 'Unidad desconocida'
                }))
                .sort((a, b) => {
                  if (!a.next_review) return -1;
                  if (!b.next_review) return 1;
                  return new Date(a.next_review).getTime() - new Date(b.next_review).getTime();
                });

              setDueFlashcards(dueCards);
              setDeletingFlashcard(null);
              
              // Si no quedan tarjetas, volver a la página anterior
              if (dueCards.length === 0) {
                router.back();
              } else if (currentIndex >= dueCards.length) {
                setCurrentIndex(dueCards.length - 1);
              }
            } catch (error) {
              console.error('Error al eliminar:', error);
            }
          }}
        />
      )}
    </>
  );
}
