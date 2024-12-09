import { useTimerStore } from '@/store/timerStore';

export const TimerStats = () => {
  const stats = useTimerStore((state) => state.stats);

  return (
    <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Estadísticas de Estudio</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.completedPomodoros}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Pomodoros Completados</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {Math.round(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Tiempo Total de Estudio</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.dailyStreak}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Racha Diaria</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {new Date(stats.lastSessionDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Última Sesión</p>
        </div>
      </div>
    </div>
  );
};
