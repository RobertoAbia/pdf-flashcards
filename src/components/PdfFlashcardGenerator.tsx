'use client';

import { useState, useEffect } from 'react';
import { processPdf } from '@/services/pdf';
import { useFlashcardStore } from '@/store/flashcards';

interface PdfFlashcardGeneratorProps {
  onSubmit: (unit: string, flashcards: Array<{ front: string; back: string }>) => void;
  onClose: () => void;
}

export default function PdfFlashcardGenerator({ onSubmit, onClose }: PdfFlashcardGeneratorProps) {
  const { units, loadUnits } = useFlashcardStore();
  const [unit, setUnit] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
        setError('El archivo es demasiado grande. El tamaño máximo es 10MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !unit) {
      setError('Por favor, selecciona una unidad y un archivo PDF');
      return;
    }

    setIsLoading(true);
    setProgress(10);
    setError(null);

    try {
      setProgress(30);
      const flashcards = await processPdf(file);
      setProgress(100);
      
      if (!flashcards || flashcards.length === 0) {
        throw new Error('No se pudieron generar flashcards del PDF proporcionado');
      }
      
      console.log(`Se generaron ${flashcards.length} flashcards`);
      onSubmit(unit, flashcards);
      onClose(); // Cerrar el modal después de generar las flashcards
    } catch (error) {
      console.error('Error al procesar el PDF:', error);
      setError('Hubo un error al procesar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 animate-float">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-2xl mr-3">🤖</span>
            Generar desde PDF
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
              disabled={isLoading}
              required
            >
              <option value="">Seleccionar unidad...</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo PDF
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Sube un archivo</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">PDF hasta 10MB</p>
              </div>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Archivo seleccionado: {file.name}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {progress < 30 && "Preparando archivo..."}
                {progress >= 30 && progress < 90 && "Generando flashcards con IA..."}
                {progress >= 90 && "¡Casi listo!"}
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading || !file || !unit}
            >
              {isLoading ? 'Generando...' : 'Generar Tarjetas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
