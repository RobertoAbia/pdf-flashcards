'use client';

interface CreateMethodSelectorProps {
  onSelectManual: () => void;
  onSelectPdf: () => void;
  isLoading?: boolean;
}

export default function CreateMethodSelector({ onSelectManual, onSelectPdf, isLoading = false }: CreateMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onSelectManual}
          disabled={isLoading}
          className="p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✏️</div>
          <h3 className="font-semibold mb-2">Crear Manualmente</h3>
          <p className="text-sm text-gray-600">
            Crea tus propias tarjetas escribiendo la pregunta y respuesta
          </p>
        </button>

        <button
          onClick={onSelectPdf}
          disabled={isLoading}
          className="p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
          <h3 className="font-semibold mb-2">Generar desde PDF</h3>
          <p className="text-sm text-gray-600">
            Sube un PDF y generaremos automáticamente las tarjetas con IA
          </p>
        </button>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center text-sm text-gray-600">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creando...
        </div>
      )}
    </div>
  );
}
