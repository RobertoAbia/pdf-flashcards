'use client';

interface CreateMethodSelectorProps {
  onSelectMethod: (method: 'manual' | 'pdf') => void;
  onClose: () => void;
}

export default function CreateMethodSelector({ onSelectMethod, onClose }: CreateMethodSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 animate-float">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-2xl mr-3">✨</span>
            Crear Nueva Tarjeta
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectMethod('manual')}
            className="p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✏️</div>
            <h3 className="font-semibold mb-2">Crear Manualmente</h3>
            <p className="text-sm text-gray-600">
              Crea tus propias tarjetas escribiendo la pregunta y respuesta
            </p>
          </button>

          <button
            onClick={() => onSelectMethod('pdf')}
            className="p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
            <h3 className="font-semibold mb-2">Generar desde PDF</h3>
            <p className="text-sm text-gray-600">
              Sube un PDF y generaremos automáticamente las tarjetas con IA
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
