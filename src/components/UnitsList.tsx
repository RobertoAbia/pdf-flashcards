"use client";

import { FolderIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useFlashcardStore } from '@/store/flashcards';
import { useEffect, useState } from 'react';

interface Unit {
  id: string;
  name: string;
  description: string;
}

const UnitsList = () => {
  const { units, loadUnits } = useFlashcardStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await loadUnits();
      } catch (error) {
        console.error('Error loading units:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadUnits]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {units.map((unit) => (
        <Link
          key={unit.id}
          href={`/flashcards/${unit.id}`}
          className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FolderIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{unit.name}</h3>
                {unit.description && (
                  <p className="text-sm text-gray-500">{unit.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </Link>
      ))}

      {!isLoading && units.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">No hay unidades creadas aún. ¡Crea una nueva unidad para empezar!</p>
        </div>
      )}
    </div>
  );
};

export default UnitsList;
