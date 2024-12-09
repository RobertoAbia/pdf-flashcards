'use client';

import { useState } from 'react';
import { PlusIcon } from "@heroicons/react/24/outline";
import UnitsList from "@/components/UnitsList";
import CreateUnitModal from '@/components/CreateUnitModal';

export default function FlashcardsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-3"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nueva Unidad</span>
          </button>
        </div>

        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center">
              <span className="text-3xl mr-3">📚</span>
              Unidades de Estudio
            </h2>
            <UnitsList />
          </div>
        </section>
      </div>

      {showCreateModal && (
        <CreateUnitModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
