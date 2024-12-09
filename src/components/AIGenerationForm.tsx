'use client';

import { useState } from 'react';
import PdfUploader from './PdfUploader';

interface AIGenerationFormProps {
  onSubmit: (unit: string, text: string) => void;
  onClose: () => void;
}

const UNITS = [
  { id: 'ancient', name: 'Historia Antigua', emoji: '🏛️' },
  { id: 'medieval', name: 'Edad Media', emoji: '⚔️' },
  { id: 'modern', name: 'Historia Moderna', emoji: '🎨' },
];

export default function AIGenerationForm({ onSubmit, onClose }: AIGenerationFormProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'text'>('pdf');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [freeText, setFreeText] = useState('');

  const handleSubmit = (text: string) => {
    if (!selectedUnit) {
      alert('Por favor, selecciona una unidad');
      return;
    }
    onSubmit(selectedUnit, text);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 animate-float">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-2xl mr-3">🤖</span>
            Generar con IA
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Unit Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona la unidad
          </label>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
          >
            <option value="">Seleccionar unidad...</option>
            {UNITS.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.emoji} {unit.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all ${
              activeTab === 'pdf'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center justify-center">
              <span className="text-xl mr-2">📄</span>
              Importar PDF
            </span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center justify-center">
              <span className="text-xl mr-2">✨</span>
              Texto libre
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {activeTab === 'pdf' ? (
            <div className="bg-gray-50 rounded-xl p-6">
              <PdfUploader onTextExtracted={(text) => handleSubmit(text)} />
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[200px]"
                placeholder="Pega aquí el texto del que quieres generar flashcards..."
              />
              <button
                onClick={() => handleSubmit(freeText)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                disabled={!selectedUnit || !freeText}
              >
                Generar flashcards
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 text-center">
          Las flashcards se generarán automáticamente utilizando IA para crear preguntas y respuestas relevantes.
        </div>
      </div>
    </div>
  );
}
