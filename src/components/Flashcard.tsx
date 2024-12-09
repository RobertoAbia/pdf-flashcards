import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardProps {
  front: string;
  back: string;
  onEdit?: () => void;
  onDifficultyRated?: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const Flashcard = ({ front, back, onEdit, onDifficultyRated }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
            onClick={() => onDifficultyRated('easy')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Fácil
          </button>
          <button
            onClick={() => onDifficultyRated('medium')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Medio
          </button>
          <button
            onClick={() => onDifficultyRated('hard')}
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
