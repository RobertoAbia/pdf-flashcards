"use client";

import { FolderIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Unit {
  id: string;
  name: string;
  description: string;
  totalCards: number;
}

// Mock data - esto se reemplazará con datos reales más adelante
const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Unidad 1',
    description: 'Introducción a la materia',
    totalCards: 25,
  },
  {
    id: '2',
    name: 'Unidad 2',
    description: 'Conceptos básicos',
    totalCards: 30,
  },
  {
    id: '3',
    name: 'Unidad 3',
    description: 'Temas avanzados',
    totalCards: 20,
  },
];

const UnitsList = () => {
  return (
    <div className="space-y-4">
      {mockUnits.map((unit) => (
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
                <p className="text-sm text-gray-500">{unit.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {unit.totalCards}
                </span>
                <p className="text-xs text-gray-500">tarjetas</p>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UnitsList;
