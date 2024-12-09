'use client';

import { useState } from 'react';
import { UserCircleIcon, AcademicCapIcon, ClockIcon, FireIcon } from '@heroicons/react/24/outline';

interface UserStats {
  totalCards: number;
  studyStreak: number;
  totalStudyTime: number;
  completedSessions: number;
}

interface UserProfile {
  name: string;
  email: string;
  joinDate: Date;
  avatar: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    name: 'Usuario',
    email: 'usuario@ejemplo.com',
    joinDate: new Date('2024-01-01'),
    avatar: '/default-avatar.png'
  });

  const [stats] = useState<UserStats>({
    totalCards: 120,
    studyStreak: 7,
    totalStudyTime: 2160,
    completedSessions: 24
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    // Aquí iría la lógica para guardar los cambios en el backend
    console.log('Guardando cambios:', user);
  };

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours} horas`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="text-2xl mr-3">📊</span>
              Resumen de Actividad
            </h2>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Tarjetas</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCards}</p>
                <p className="text-sm text-gray-600">tarjetas creadas</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <FireIcon className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Racha</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">{stats.studyStreak} días</p>
                <p className="text-sm text-gray-600">estudiando sin parar</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Tiempo Total</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatStudyTime(stats.totalStudyTime)}</p>
                <p className="text-sm text-gray-600">de estudio</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-gray-800">Sesiones</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600">{stats.completedSessions}</p>
                <p className="text-sm text-gray-600">completadas</p>
              </div>
            </div>

            {/* Datos del usuario */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleSaveChanges}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
