'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PdfUploader from '../components/PdfUploader';
import Flashcard from '../components/Flashcard';
import CreateFlashcardForm from '../components/CreateFlashcardForm';
import AIGenerationForm from '../components/AIGenerationForm';
import { PlusIcon } from "@heroicons/react/24/outline";

interface FlashcardType {
  front: string;
  back: string;
  unit: string;
  createdAt: Date;
  nextReview: Date;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function Home() {
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  const handleTextExtracted = (unit: string, text: string) => {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const now = new Date();
    const newFlashcards = paragraphs.map((paragraph) => {
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
      return {
        front: sentences[0].trim() + '?',
        back: sentences.slice(1).join('. ').trim() || paragraph.trim(),
        unit,
        createdAt: now,
        nextReview: now
      };
    });
    setFlashcards([...flashcards, ...newFlashcards]);
    setShowAIForm(false);
  };

  const handleCreateFlashcard = (unit: string, front: string, back: string) => {
    const now = new Date();
    if (editingCard !== null) {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[editingCard] = {
        ...updatedFlashcards[editingCard],
        unit,
        front,
        back
      };
      setFlashcards(updatedFlashcards);
      setEditingCard(null);
    } else {
      const newFlashcard: FlashcardType = {
        unit,
        front,
        back,
        createdAt: now,
        nextReview: now
      };
      setFlashcards([...flashcards, newFlashcard]);
    }
    setShowCreateForm(false);
  };

  const handleEditCard = () => {
    setEditingCard(currentIndex);
    setShowCreateForm(true);
  };

  const calculateNextReview = (difficulty: 'easy' | 'medium' | 'hard', currentDate: Date): Date => {
    const nextDate = new Date(currentDate);
    switch (difficulty) {
      case 'easy':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'medium':
        nextDate.setDate(nextDate.getDate() + 3);
        break;
      case 'hard':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
    }
    return nextDate;
  };

  const handleDifficultyRated = (difficulty: 'easy' | 'medium' | 'hard') => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[currentIndex] = {
      ...updatedFlashcards[currentIndex],
      difficulty,
      nextReview: calculateNextReview(difficulty, new Date())
    };
    setFlashcards(updatedFlashcards);
    
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowCongrats(true);
    }
  };

  const today = new Date();
  const flashcardsToReview = flashcards.filter(card => {
    const nextReview = new Date(card.nextReview);
    return nextReview <= today;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-3"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nueva Tarjeta</span>
          </button>
        </div>

        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center">
              <span className="text-3xl mr-3">📚</span>
              Repaso Diario
            </h2>
            {flashcardsToReview.length > 0 ? (
              <div className="mb-6">
                <Flashcard
                  front={flashcardsToReview[currentIndex].front}
                  back={flashcardsToReview[currentIndex].back}
                  onEdit={handleEditCard}
                  onDifficultyRated={handleDifficultyRated}
                />
              </div>
            ) : showCongrats ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
                <div className="text-7xl mb-6 animate-bounce">🎉</div>
                <h3 className="text-2xl font-semibold mb-3">¡Felicitaciones!</h3>
                <p className="text-gray-600 mb-6 text-lg">Has completado todas las tarjetas por hoy</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Crear Más Tarjetas
                </button>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🚀</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">¡Enhorabuena!</h3>
                <p className="text-gray-600 mb-3 text-lg">Estás al día con tus repasos</p>
                <p className="text-gray-500">Sigue avanzando con tu temario</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {showCreateForm && (
        <CreateFlashcardForm
          onSubmit={handleCreateFlashcard}
          onClose={() => {
            setShowCreateForm(false);
            setEditingCard(null);
          }}
          initialUnit={editingCard !== null ? flashcards[editingCard].unit : ''}
          initialFront={editingCard !== null ? flashcards[editingCard].front : ''}
          initialBack={editingCard !== null ? flashcards[editingCard].back : ''}
        />
      )}
      {showAIForm && (
        <AIGenerationForm
          onSubmit={handleTextExtracted}
          onClose={() => setShowAIForm(false)}
        />
      )}
    </div>
  );
}
