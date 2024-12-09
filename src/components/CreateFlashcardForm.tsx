'use client';

import { useState } from 'react';
import CreateMethodSelector from './CreateMethodSelector';
import PdfFlashcardGenerator from './PdfFlashcardGenerator';

interface CreateFlashcardFormProps {
  onSubmit: (unit: string, front: string, back: string) => void;
  onClose: () => void;
  initialUnit?: string;
  initialFront?: string;
  initialBack?: string;
}

export default function CreateFlashcardForm({ 
  onSubmit, 
  onClose,
  initialUnit = '',
  initialFront = '',
  initialBack = ''
}: CreateFlashcardFormProps) {
  const [showMethodSelector, setShowMethodSelector] = useState(true);
  const [creationMethod, setCreationMethod] = useState<'manual' | 'pdf' | null>(null);
  const [unit, setUnit] = useState(initialUnit);
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);

  const handleMethodSelect = (method: 'manual' | 'pdf') => {
    setCreationMethod(method);
    setShowMethodSelector(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit || !front || !back) {
      alert('Por favor, completa todos los campos');
      return;
    }
    onSubmit(unit, front, back);
  };

  const handleCreateFlashcardsFromPdf = (unit: string, flashcards: Array<{ front: string; back: string }>) => {
    // Por ahora, solo crearemos la primera flashcard
    if (flashcards.length > 0) {
      const firstCard = flashcards[0];
      onSubmit(unit, firstCard.front, firstCard.back);
    }
  };

  if (showMethodSelector) {
    return (
      <CreateMethodSelector
        onSelectMethod={handleMethodSelect}
        onClose={onClose}
      />
    );
  }

  if (creationMethod === 'pdf') {
    return (
      <PdfFlashcardGenerator
        onSubmit={handleCreateFlashcardsFromPdf}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 animate-float">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-2xl mr-3">✏️</span>
            {initialFront ? 'Editar tarjeta' : 'Crear tarjeta'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unidad
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Seleccionar unidad...</option>
              <option value="ancient">🏛️ Historia Antigua</option>
              <option value="medieval">⚔️ Edad Media</option>
              <option value="modern">🎨 Historia Moderna</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pregunta (frente)
            </label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
              placeholder="Escribe la pregunta..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Respuesta (reverso)
            </label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
              placeholder="Escribe la respuesta..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialFront ? 'Guardar cambios' : 'Crear tarjeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
