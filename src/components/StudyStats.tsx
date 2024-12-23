'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FireIcon, TrophyIcon } from '@heroicons/react/24/outline';

const StudyStats = forwardRef((props, ref) => {
  const [streak, setStreak] = useState(0);
  const [masteryScore, setMasteryScore] = useState(0);

  const loadUserStats = async () => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('study_streak, mastery_score')
        .eq('id', user.id)
        .single();

      if (profile) {
        setStreak(profile.study_streak || 0);
        setMasteryScore(profile.mastery_score || 0);
      }
    }
  };

  useEffect(() => {
    loadUserStats();
  }, []);

  useImperativeHandle(ref, () => ({
    reloadStats: loadUserStats
  }));

  return (
    <div className="flex gap-3">
      {/* Racha */}
      <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center min-w-[100px]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <FireIcon className="h-5 w-5 text-purple-500" />
          <span className="text-sm font-medium text-purple-700">Racha</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-purple-900">{streak}</span>
          <span className="text-sm text-purple-600 ml-1.5">días</span>
        </div>
      </div>

      {/* Maestría */}
      <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center min-w-[100px]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <TrophyIcon className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-700">Maestría</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-yellow-900">{masteryScore.toFixed(2)}</span>
          <span className="text-sm text-yellow-600 ml-1.5">pts</span>
        </div>
      </div>
    </div>
  );
});

StudyStats.displayName = 'StudyStats';

export default StudyStats;
