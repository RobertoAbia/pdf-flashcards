'use client';

import { useEffect, useState } from 'react';
import { useFlashcardStore } from '@/store/flashcards';
import dynamic from 'next/dynamic';
import StudyTracker from '@/components/StudyTracker';
import FlashcardStats from '@/components/FlashcardStats';
import Link from 'next/link';
import { Flashcard } from '@/components/Flashcard';

// Importar MiniTimer de forma dinámica para evitar errores de hidratación
const MiniTimer = dynamic(() => import('@/components/MiniTimer'), {
  ssr: false,
});

export default function Dashboard() {
  const { flashcards, units } = useFlashcardStore();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [todaysCards, setTodaysCards] = useState<Array<Flashcard & { unitName: string }>>([]);

  useEffect(() => {
    // Aquí implementaremos la lógica para seleccionar las tarjetas del día
    // Por ahora, mostraremos todas las tarjetas como ejemplo
    const allCards = flashcards.map(card => ({
      ...card,
      unitName: units.find(u => u.id === card.unit_id)?.name || 'Unidad sin nombre'
    }));
    setTodaysCards(allCards);
  }, [flashcards, units]);

  const handleNextCard = () => {
    if (currentCardIndex < todaysCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tarjetas para repasar hoy</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Panel de Estadísticas de Estudio */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tu Progreso</h2>
          <StudyTracker />
        </div>

        {/* Panel de Estadísticas de Tarjetas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tarjetas</h2>
          <FlashcardStats />
        </div>

        {/* Panel del Timer */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Timer Pomodoro</h2>
          <MiniTimer />
        </div>
      </div>

      {/* Flashcards del día */}
      <div className="max-w-4xl mx-auto">
        {todaysCards.length > 0 ? (
          <>
            <div className="mb-4 text-center">
              <p className="text-gray-600">
                Tarjeta {currentCardIndex + 1} de {todaysCards.length}
              </p>
              <p className="text-sm text-gray-500">
                De la unidad: {todaysCards[currentCardIndex]?.unitName}
              </p>
            </div>
            
            <Flashcard
              front={todaysCards[currentCardIndex]?.front || ''}
              back={todaysCards[currentCardIndex]?.back || ''}
              onDifficultyRated={(difficulty) => {
                // Aquí implementaremos la lógica para el SRS
                handleNextCard();
              }}
            />

            <div className="flex justify-between mt-6">
              <button
                onClick={handlePreviousCard}
                disabled={currentCardIndex === 0}
                className="px-4 py-2 text-gray-600 disabled:opacity-50"
              >
                ← Anterior
              </button>
              <button
                onClick={handleNextCard}
                disabled={currentCardIndex === todaysCards.length - 1}
                className="px-4 py-2 text-gray-600 disabled:opacity-50"
              >
                Siguiente →
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">¡No hay tarjetas para repasar hoy!</p>
            <Link
              href="/flashcards"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Crear nuevas tarjetas
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
