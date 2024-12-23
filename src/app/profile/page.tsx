'use client';

import { useEffect, useState } from 'react';
import { UserCircleIcon, AcademicCapIcon, ClockIcon, FireIcon } from '@heroicons/react/24/outline';
import { getCurrentProfile, upsertProfile } from '@/lib/user';
import type { Profile } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getCurrentProfile();
        if (userProfile) {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Error al cargar el perfil');
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!profile) return;
    setError(null);

    setProfile(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null);
  };

  const handleSaveChanges = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);

    try {
      console.log('Current profile state:', profile);
      
      const updatedProfile = await upsertProfile({
        full_name: profile.full_name,
        study_streak: profile.study_streak,
        last_study_date: profile.last_study_date,
        total_flashcards_created: profile.total_flashcards_created,
        total_pomodoros_completed: profile.total_pomodoros_completed,
        mastery_score: profile.mastery_score,
      });

      console.log('Profile updated:', updatedProfile);

      // Recargar el perfil para obtener los datos actualizados
      const reloadedProfile = await getCurrentProfile();
      if (reloadedProfile) {
        setProfile(reloadedProfile);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al guardar los cambios');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/'; 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError('Error al cerrar sesión');
    }
  };

  const formatStudyTime = () => {
    if (!profile?.total_pomodoros_completed) return '0 horas';
    const totalMinutes = profile.total_pomodoros_completed;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (totalMinutes < 60) return `${totalMinutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <div className="p-8">
          {/* Perfil */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <UserCircleIcon className="w-6 h-6 mr-2" />
              Perfil
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={profile?.full_name || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="text-2xl mr-3">📊</span>
              Estadísticas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Tarjetas</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{profile?.total_flashcards_created || 0}</p>
                <p className="text-sm text-gray-600">tarjetas creadas</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Tiempo</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatStudyTime()}</p>
                <p className="text-sm text-gray-600">de estudio</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <FireIcon className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Racha</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">{profile?.study_streak || 0}</p>
                <p className="text-sm text-gray-600">días seguidos</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">🏆</span>
                  <h3 className="font-semibold text-gray-800">Maestría</h3>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{profile?.mastery_score || 0}%</p>
                <p className="text-sm text-gray-600">puntuación</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Cerrar sesión
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
