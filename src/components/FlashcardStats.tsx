'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useFlashcardStore } from '@/store/flashcards';
import { AcademicCapIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline';

export default function FlashcardStats() {
  const { getTotalFlashcards } = useFlashcardStore();
  const [masteryScore, setMasteryScore] = useState<number>(0);
  const [studyStreak, setStudyStreak] = useState<number>(0);
  const totalCards = getTotalFlashcards();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('mastery_score, study_streak')
          .eq('id', user.id)
          .single();

        if (profile) {
          setMasteryScore(Math.round(profile.mastery_score));
          setStudyStreak(profile.study_streak);
        }
      }
    };

    // Suscribirse a cambios en el perfil
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        },
        (payload) => {
          if (payload.new.mastery_score !== undefined) {
            setMasteryScore(Math.round(payload.new.mastery_score));
          }
          if (payload.new.study_streak !== undefined) {
            setStudyStreak(payload.new.study_streak);
          }
        }
      )
      .subscribe();

    loadStats();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="space-y-4">
      {/* Total de tarjetas */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-center">
        <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
          <AcademicCapIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <div className="text-2xl font-bold text-blue-600">{totalCards}</div>
          <div className="text-sm text-gray-600">tarjetas creadas</div>
        </div>
      </div>

      {/* Puntuación de maestría */}
      <div className="bg-yellow-50 rounded-xl p-4 flex items-center">
        <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
          <TrophyIcon className="h-6 w-6 text-yellow-600" />
        </div>
        <div className="ml-4">
          <div className="text-2xl font-bold text-yellow-600">{masteryScore}%</div>
          <div className="text-sm text-gray-600">puntuación de maestría</div>
        </div>
      </div>

      {/* Racha de estudio */}
      <div className="bg-green-50 rounded-xl p-4 flex items-center">
        <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
          <FireIcon className="h-6 w-6 text-green-600" />
        </div>
        <div className="ml-4">
          <div className="text-2xl font-bold text-green-600">{studyStreak} días</div>
          <div className="text-sm text-gray-600">racha de estudio</div>
        </div>
      </div>
    </div>
  );
}
