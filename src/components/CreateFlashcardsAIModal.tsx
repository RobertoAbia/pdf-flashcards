"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useFlashcardStore } from '@/store/flashcards';

interface CreateFlashcardsAIModalProps {
  unitId: string;
  onClose: () => void;
}

export default function CreateFlashcardsAIModal({ unitId, onClose }: CreateFlashcardsAIModalProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addFlashcardsToUnit } = useFlashcardStore();

  const handleCreateFlashcards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!content.trim()) {
        throw new Error('Por favor, introduce el contenido para generar las tarjetas');
      }

      // TODO: Integrar con OpenAI para generar las tarjetas
      const generatedFlashcards = [
        { front: "Pregunta 1", back: "Respuesta 1" },
        { front: "Pregunta 2", back: "Respuesta 2" }
      ];

      await addFlashcardsToUnit(unitId, generatedFlashcards);
      router.refresh();
      onClose();
    } catch (err) {
      console.error('Error creating flashcards:', err);
      setError(err instanceof Error ? err.message : 'Error al crear las tarjetas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 animate-float">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-2xl mr-3">🤖</span>
            Crear Tarjetas con IA
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleCreateFlashcards(); }} className="space-y-6">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Contenido para generar tarjetas
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Pega aquí el texto del que quieres generar tarjetas..."
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              La IA generará automáticamente tarjetas de estudio basadas en este contenido.
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generando...
                </>
              ) : (
                'Generar Tarjetas'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
