import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlashcardStore } from '../store/flashcardStore'; // Importar el store de flashcards

interface FlashcardProps {
  id: string; // Cambiar de number a string ya que los IDs de Supabase son UUIDs
  front: string;
  back: string;
  onEdit?: () => void;
  onDifficultyRated?: (difficulty: 'easy' | 'medium' | 'hard') => Promise<void>;
}

export const Flashcard = ({ id, front, back, onEdit, onDifficultyRated }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { markFlashcardReviewed } = useFlashcardStore();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficultyRated = async (difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      if (!id) {
        console.error('No se proporcionó ID de flashcard');
        return;
      }

      // Calcular la próxima fecha de revisión basada en la dificultad
      const today = new Date();
      let nextReviewDate = new Date(today);
      
      switch(difficulty) {
        case 'easy':
          nextReviewDate.setDate(today.getDate() + 7); // Revisar en 7 días
          break;
        case 'medium':
          nextReviewDate.setDate(today.getDate() + 3); // Revisar en 3 días
          break;
        case 'hard':
          nextReviewDate.setDate(today.getDate() + 1); // Revisar mañana
          break;
      }

      console.log('Actualizando flashcard:', {
        id,
        difficulty,
        nextReviewDate: nextReviewDate.toISOString()
      });

      // Primero actualizar la dificultad
      if (onDifficultyRated) {
        await onDifficultyRated(difficulty);
      }
      
      // Luego marcar como revisada
      const result = await markFlashcardReviewed(id, nextReviewDate);
      console.log('Resultado de markFlashcardReviewed:', result);

    } catch (error) {
      console.error('Error al actualizar la flashcard:', error);
    }
  };

  const variants = {
    front: {
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 30,
        duration: 0.8
      }
    },
    back: {
      rotateY: 180,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 30,
        duration: 0.8
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative h-[300px] w-full preserve-3d cursor-pointer">
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={isFlipped ? "back" : "front"}
          variants={variants}
          onClick={handleFlip}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Frente de la tarjeta */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8">
              <div className="relative h-full">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="absolute top-0 right-0 p-2 text-white hover:text-blue-200 transition-colors"
                  >
                    ✏️
                  </button>
                )}
                <div className="flex items-center justify-center h-full">
                  <p className="text-2xl font-medium text-white text-center">
                    {front}
                  </p>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <p className="text-sm text-white/70">Click para ver respuesta</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reverso de la tarjeta */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8">
              <div className="relative h-full">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="absolute top-0 right-0 p-2 text-white hover:text-blue-200 transition-colors"
                  >
                    ✏️
                  </button>
                )}
                <div className="flex items-center justify-center h-full">
                  <p className="text-2xl font-medium text-white text-center">
                    {back}
                  </p>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <p className="text-sm text-white/70">Click para ver pregunta</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Botones de dificultad */}
      {isFlipped && onDifficultyRated && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => handleDifficultyRated('easy')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Fácil
          </button>
          <button
            onClick={() => handleDifficultyRated('medium')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Medio
          </button>
          <button
            onClick={() => handleDifficultyRated('hard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Difícil
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
