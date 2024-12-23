'use client';

interface FlashcardMethodSelectorProps {
  onSelectManual: () => void;
  onSelectPdf: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function FlashcardMethodSelector(props: FlashcardMethodSelectorProps) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={props.onClose} />
      
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white rounded-3xl p-8 w-[600px] max-w-[95vw]">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Crear Nueva Tarjeta</h2>
            <button 
              onClick={props.onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manual Creation Option */}
            <button
              onClick={props.onSelectManual}
              className="group p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all text-left"
            >
              <span className="block text-3xl mb-3">✏️</span>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600">
                Crear Manualmente
              </h3>
              <p className="text-gray-600 text-sm">
                Crea tus propias tarjetas escribiendo la pregunta y respuesta
              </p>
            </button>

            {/* PDF Generation Option */}
            <button
              onClick={props.onSelectPdf}
              disabled={props.isLoading}
              className="group p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="block text-3xl mb-3">📄</span>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600">
                Generar desde PDF
              </h3>
              <p className="text-gray-600 text-sm">
                Sube un PDF y generaremos automáticamente las tarjetas con IA
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
