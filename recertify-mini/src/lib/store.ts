import { create } from 'zustand';
import { UserStats, Achievement, LeaderboardEntry } from '@/types';

interface UserState {
  user: {
    id: string;
    name: string;
    avatar: string;
    telegramId?: number;
    walletAddress?: string;
  } | null;
  stats: UserStats;
  achievements: Achievement[];
  setUser: (user: any) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  addPoints: (points: number) => void;
  completeQuiz: (quizId: string) => void;
  completeProject: (projectId: string) => void;
  unlockAchievement: (achievement: Achievement) => void;
  addStreak: () => void;
  resetStreak: () => void;
}

const defaultStats: UserStats = {
  points: 0,
  dailyStreak: 0,
  completedQuizzes: [],
  completedProjects: [],
  achievements: [],
  level: 1,
  rank: 'Novice',
  referralCount: 0,
  lastCheckin: new Date().toISOString(),
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  stats: defaultStats,
  achievements: [],

  setUser: (user) =>
    set({ user }),

  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),

  addPoints: (points) =>
    set((state) => {
      const newPoints = state.stats.points + points;
      const newLevel = Math.floor(newPoints / 500) + 1;
      const ranks = ['Novice', 'Learner', 'Scholar', 'Master', 'Expert', 'Legendary'];
      const rank = ranks[Math.min(Math.floor(newPoints / 1000), ranks.length - 1)];

      return {
        stats: {
          ...state.stats,
          points: newPoints,
          level: newLevel,
          rank,
        },
      };
    }),

  completeQuiz: (quizId) =>
    set((state) => {
      if (state.stats.completedQuizzes.includes(quizId)) {
        return state;
      }
      return {
        stats: {
          ...state.stats,
          completedQuizzes: [...state.stats.completedQuizzes, quizId],
        },
      };
    }),

  completeProject: (projectId) =>
    set((state) => {
      if (state.stats.completedProjects.includes(projectId)) {
        return state;
      }
      return {
        stats: {
          ...state.stats,
          completedProjects: [...state.stats.completedProjects, projectId],
        },
      };
    }),

  unlockAchievement: (achievement) =>
    set((state) => {
      const exists = state.achievements.find((a) => a.id === achievement.id);
      if (exists) return state;

      return {
        achievements: [...state.achievements, achievement],
        stats: {
          ...state.stats,
          achievements: [...state.stats.achievements, achievement],
        },
      };
    }),

  addStreak: () =>
    set((state) => {
      const lastCheckin = new Date(state.stats.lastCheckin);
      const today = new Date();
      const isConsecutive = 
        lastCheckin.getDate() === today.getDate() - 1 &&
        lastCheckin.getMonth() === today.getMonth();

      if (isConsecutive) {
        return {
          stats: {
            ...state.stats,
            dailyStreak: state.stats.dailyStreak + 1,
            lastCheckin: today.toISOString(),
          },
        };
      }

      return state;
    }),

  resetStreak: () =>
    set((state) => ({
      stats: {
        ...state.stats,
        dailyStreak: 0,
      },
    })),
}));

// Quiz State
interface QuizRunnerState {
  currentQuiz: string | null;
  currentQuestionIndex: number;
  answers: (number | null)[];
  score: number;
  timeStarted: number | null;
  isRunning: boolean;
  startQuiz: (quizId: string, questionCount: number) => void;
  submitAnswer: (questionIndex: number, answer: number) => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizRunnerState>((set) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  timeStarted: null,
  isRunning: false,

  startQuiz: (quizId, questionCount) =>
    set({
      currentQuiz: quizId,
      currentQuestionIndex: 0,
      answers: Array(questionCount).fill(null),
      score: 0,
      timeStarted: Date.now(),
      isRunning: true,
    }),

  submitAnswer: (questionIndex, answer) =>
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[questionIndex] = answer;
      return { answers: newAnswers };
    }),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  endQuiz: () =>
    set({
      isRunning: false,
    }),

  resetQuiz: () =>
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      timeStarted: null,
      isRunning: false,
    }),
}));

// UI State
interface UIState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  notification: {
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  notification: {
    open: false,
    message: '',
    type: 'info',
  },

  toggleDarkMode: () =>
    set((state) => ({ isDarkMode: !state.isDarkMode })),

  setDarkMode: (isDark) =>
    set({ isDarkMode: isDark }),

  showNotification: (message, type) =>
    set({
      notification: {
        open: true,
        message,
        type,
      },
    }),

  hideNotification: () =>
    set({
      notification: {
        open: false,
        message: '',
        type: 'info',
      },
    }),
}));
