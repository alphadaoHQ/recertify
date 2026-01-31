// Core types for the recertify-mini app

export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'DeFi' | 'NFTs' | 'Gaming' | 'Infrastructure' | 'Security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  pointsReward: number;
  progress: number; // 0-100
  quizCount: number;
  learningModules: LearningModule[];
  tags: string[];
  rating: number;
  completedCount: number;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  order: number;
  isCompleted: boolean;
  quizId?: string;
}

export interface EnhancedQuiz {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectIcon: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number; // in minutes
  points: number;
  questions: QuizQuestion[];
  prerequisites?: string[];
  learningPath?: string[];
  socialProof: {
    completedCount: number;
    averageScore: number;
    rating: number;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface UserStats {
  points: number;
  dailyStreak: number;
  completedQuizzes: string[];
  completedProjects: string[];
  achievements: Achievement[];
  level: number;
  rank: string;
  referralCount: number;
  lastCheckin: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  pointsReward: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  points: number;
  level: number;
  avatar?: string;
  badge?: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
  isAutoMode: boolean;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

// AI Features Types
export interface AIFeedback {
  id: string;
  userId: string;
  quizId: string;
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  feedback: string;
  suggestions: string[];
  timestamp: string;
}

export interface LearningState {
  userId: string;
  topicScores: Record<string, {
    totalAttempts: number;
    correctAnswers: number;
    averageScore: number;
    lastAttempt: string;
    masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  weakAreas: string[];
  recommendedTopics: string[];
  overallProgress: number;
  completed: boolean;
  lastUpdated: string;
}

export interface FraudDetection {
  userId: string;
  sessionId: string;
  quizId: string;
  riskScore: number;
  flags: {
    fastCompletion: boolean;
    identicalRetries: boolean;
    impossibleAccuracy: boolean;
    suspiciousPattern: boolean;
  };
  timeSpent: number;
  averageTimePerQuestion: number;
  retryCount: number;
  timestamp: string;
}

export interface QuizSubmission {
  quizId: string;
  userId: string;
  answers: number[];
  timeSpent: number;
  startTime: number;
  endTime: number;
  sessionId: string;
}