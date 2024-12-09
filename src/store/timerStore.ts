import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  soundEnabled: boolean;
}

interface TimerStats {
  completedPomodoros: number;
  totalStudyTime: number;
  dailyStreak: number;
  lastSessionDate: string;
}

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
}

interface TimerStore {
  settings: TimerSettings;
  stats: TimerStats;
  timer: TimerState;
  updateSettings: (newSettings: Partial<TimerSettings>) => void;
  updateStats: (type: 'completedPomodoros' | 'totalStudyTime') => void;
  playSound: () => void;
  toggleSound: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  toggleTimer: () => void;
  resetTimer: (mode?: TimerMode) => void;
  setTimeLeft: (time: number) => void;
  switchMode: (mode: TimerMode) => void;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => {
      let interval: NodeJS.Timeout | null = null;

      const startTimer = () => {
        if (interval) return;
        
        interval = setInterval(() => {
          const state = get();
          if (state.timer.timeLeft <= 0) {
            if (state.timer.mode === 'pomodoro') {
              state.updateStats('completedPomodoros');
              if (state.settings.soundEnabled) {
                state.playSound();
              }
              const nextMode = state.stats.completedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak';
              state.switchMode(nextMode);
            } else {
              state.switchMode('pomodoro');
            }
          } else {
            set((state) => ({
              timer: {
                ...state.timer,
                timeLeft: state.timer.timeLeft - 1,
              },
            }));
          }
        }, 1000);

        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: true,
          },
        }));
      };

      const pauseTimer = () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: false,
          },
        }));
      };

      const audioContext = typeof window !== 'undefined' ? new AudioContext() : null;

      const playSound = () => {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      };

      return {
        settings: {
          pomodoro: 25,
          shortBreak: 5,
          longBreak: 15,
          autoStartBreaks: true,
          soundEnabled: true,
        },
        stats: {
          completedPomodoros: 0,
          totalStudyTime: 0,
          dailyStreak: 0,
          lastSessionDate: new Date().toISOString(),
        },
        timer: {
          timeLeft: 25 * 60,
          isRunning: false,
          mode: 'pomodoro',
        },
        updateSettings: (newSettings) =>
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          })),
        updateStats: (type) =>
          set((state) => {
            const newStats = { ...state.stats };
            const today = new Date().toISOString().split('T')[0];
            const lastDate = new Date(state.stats.lastSessionDate).toISOString().split('T')[0];

            if (type === 'completedPomodoros') {
              newStats.completedPomodoros += 1;
              newStats.totalStudyTime += state.settings.pomodoro;
            }

            if (today !== lastDate) {
              if (today === new Date(new Date(lastDate).getTime() + 86400000).toISOString().split('T')[0]) {
                newStats.dailyStreak += 1;
              } else {
                newStats.dailyStreak = 1;
              }
            }

            newStats.lastSessionDate = new Date().toISOString();
            return { stats: newStats };
          }),
        playSound,
        toggleSound: () =>
          set((state) => ({
            settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
          })),
        startTimer,
        pauseTimer,
        toggleTimer: () => {
          const state = get();
          if (state.timer.isRunning) {
            state.pauseTimer();
          } else {
            state.startTimer();
          }
        },
        resetTimer: (mode) => {
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
          set((state) => ({
            timer: {
              timeLeft: state.settings[mode || state.timer.mode] * 60,
              isRunning: false,
              mode: mode || state.timer.mode,
            },
          }));
        },
        setTimeLeft: (time) =>
          set((state) => ({
            timer: {
              ...state.timer,
              timeLeft: time,
            },
          })),
        switchMode: (mode) => {
          const state = get();
          if (state.timer.isRunning) {
            state.pauseTimer();
          }
          state.resetTimer(mode);
        },
      };
    },
    {
      name: 'timer-storage',
    }
  )
);
