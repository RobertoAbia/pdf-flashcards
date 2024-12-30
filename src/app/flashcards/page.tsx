'use client';

import { useState, useEffect, useRef } from 'react';
import { useFlashcardStore } from '@/store/flashcards';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import EditFlashcardModal from '@/components/EditFlashcardModal';
import DeleteFlashcardModal from '@/components/DeleteFlashcardModal';
import StudyStats from '@/components/StudyStats';
import { useRouter } from 'next/navigation';
import { updateStudyStreak, resetDailyStreak } from '@/lib/user';

export default function FlashcardsPage() {
  const { 
    loadUnits, 
    loadAllFlashcards, 
    updateFlashcardDifficulty, 
    markFlashcardReviewed, 
    deleteFlashcard
  } = useFlashcardStore();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dueFlashcards, setDueFlashcards] = useState<any[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<any | null>(null);
  const [deletingFlashcard, setDeletingFlashcard] = useState<any | null>(null);
  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);
  const { units } = useFlashcardStore();
  const statsRef = useRef<{ reloadStats: () => Promise<void> }>();
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        await resetDailyStreak(); // Reiniciar el flag al cargar
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
        setError('Error al cargar las tarjetas. Por favor, intenta recargar la página.');
        // Asegurarnos de que dueFlashcards esté vacío en caso de error
        setDueFlashcards([]);
      } finally {
        // Asegurarnos de que isLoading se ponga a false incluso si hay error
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Reiniciar el estado de felicitación cuando se cargan nuevas tarjetas
    setShowCongratulations(false);
  }, [dueFlashcards.length]);

  const handleNext = () => {
    if (dueFlashcards.length === 0) return;
    setShowAnswer(false);
    setCurrentIndex(prev => (prev + 1) % dueFlashcards.length);
  };

  const handlePrevious = () => {
    if (dueFlashcards.length === 0) return;
    setShowAnswer(false);
    setCurrentIndex(prev => (prev - 1 + dueFlashcards.length) % dueFlashcards.length);
  };

  const handleDifficultyResponse = async (difficulty: 'easy' | 'medium' | 'hard') => {
    const currentCard = dueFlashcards[currentIndex];
    if (!currentCard) return;

    try {
      // 1. Actualizar la tarjeta
      const updatedCard = await updateFlashcardDifficulty(currentCard.id, difficulty);
      await markFlashcardReviewed(
        currentCard.id, 
        updatedCard.next_review ? new Date(updatedCard.next_review) : new Date()
      );

      // 2. Marcar como completada
      const newCompletedCards = new Set([...completedCards, currentCard.id]);
      setCompletedCards(newCompletedCards);

      // 3. Actualizar fecha de estudio y posiblemente la racha
      const isLastCard = newCompletedCards.size === dueFlashcards.length;
      await updateStudyStreak(isLastCard);
      
      if (isLastCard) {
        await statsRef.current?.reloadStats();
        setShowCongratulations(true);
        setDueFlashcards([]);
      } else {
        setShowAnswer(false);
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error('Error al actualizar la tarjeta:', error);
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
    
    // Mantener las mismas tarjetas que teníamos, pero actualizar la editada
    const updatedDueFlashcards = dueFlashcards.map(card => {
      // Si es la tarjeta que acabamos de editar, obtener la versión actualizada
      const updatedCard = flashcards.find(f => f.id === card.id);
      if (updatedCard) {
        return {
          ...updatedCard,
          unitName: units.find(u => u.id === updatedCard.unit_id)?.name || 'Unidad desconocida'
        };
      }
      return card;
    });

    setDueFlashcards(updatedDueFlashcards);
    setEditingFlashcard(null);
  };

  const handleDeleteFlashcard = async (e: React.MouseEvent, flashcard: any) => {
    e.stopPropagation();
    setDeletingFlashcard(flashcard);
  };

  const handleDelete = async () => {
    const { deleteFlashcard } = useFlashcardStore.getState();
    try {
      await deleteFlashcard(deletingFlashcard.id);
      await loadAllFlashcards();
      const { flashcards } = useFlashcardStore.getState();
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const dueCards = flashcards
        .filter(card => {
          if (currentUnitId && card.unit_id !== currentUnitId) return false;
          if (!card.next_review) return true;
          const nextReview = new Date(card.next_review);
          nextReview.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays <= 0;
        });

      setDueFlashcards(dueCards);
      setDeletingFlashcard(null);
      
      // Si no quedan tarjetas, volver al índice 0
      if (dueCards.length === 0) {
        router.back();
      } else if (currentIndex >= dueCards.length) {
        setCurrentIndex(dueCards.length - 1);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <>
      {/* Contenido principal */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-8">
              <StudyStats ref={statsRef} />
            </div>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-8">
              <StudyStats ref={statsRef} />
            </div>
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p>{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Recargar página
              </button>
            </div>
          </div>
        ) : dueFlashcards.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-8">
              <StudyStats ref={statsRef} />
            </div>
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              {showCongratulations ? (
                <>
                  <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full text-green-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Enhorabuena! Has completado todas tus tarjetas de hoy</h2>
                    <p className="text-gray-600">Sigue así para mantener tu racha de estudio</p>
                  </div>
                  <button
                    onClick={() => router.push('/units')}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Volver a unidades
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay tarjetas pendientes para hoy</h2>
                  <p className="text-gray-600">Puedes volver mañana</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-8">
              <StudyStats ref={statsRef} />
            </div>
            <div className="flex justify-between items-center mb-8">
              <div className="text-sm font-medium text-gray-500">
                {completedCards.size} de {dueFlashcards.length} tarjetas completadas
              </div>
            </div>

            <div className="relative">
              {/* Barra de progreso */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(completedCards.size / dueFlashcards.length) * 100}%` }}
                />
              </div>

              <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-100 mt-6 hover:shadow-xl transition-shadow duration-300">
                {/* Encabezado de la tarjeta */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {dueFlashcards[currentIndex]?.unitName || 'Sin unidad'}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        Revisión #{(dueFlashcards[currentIndex]?.review_count || 0) + 1}
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
                      <div className="text-xl font-medium text-gray-800 mb-4 leading-relaxed whitespace-pre-line">
                        {dueFlashcards[currentIndex] && (showAnswer ? dueFlashcards[currentIndex].back : dueFlashcards[currentIndex].front)}
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
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
