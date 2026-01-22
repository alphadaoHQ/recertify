// Core Project Types
export enum ProjectCategory {
  MEME = 'meme',
  GAMING = 'gaming',
  NFTS = 'nfts',
  DEFI = 'defi',
  INFRASTRUCTURE = 'infrastructure',
  SOCIAL = 'social'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum ProjectStatus {
  ACTIVE = 'active',
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  PAUSED = 'paused'
}

export interface ProjectMetadata {
  logo: string;
  banner: string;
  website: string;
  whitepaper?: string;
  documentation?: string;
  socialLinks: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    github?: string;
    medium?: string;
  };
  tags: string[];
  partnerships: string[];
}

export interface ProjectRequirements {
  minLevel?: number;
  prerequisites?: string[];
  timeEstimate: {
    reading: number; // minutes
    quiz: number; // minutes
    total: number; // minutes
  };
  resources: {
    articles: string[];
    videos: string[];
    tools: string[];
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  difficulty: DifficultyLevel;
}

export interface Quiz {
  id: string;
  projectId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number; // minutes
  points: {
    total: number;
    perQuestion: number;
    bonus: number;
  };
}

export interface LearningModule {
  id: string;
  projectId: string;
  title: string;
  description: string;
  content: string;
  type: 'article' | 'video' | 'interactive' | 'tutorial';
  order: number;
  estimatedTime: number; // minutes
  difficulty: DifficultyLevel;
  isRequired: boolean;
  resources: {
    links: string[];
    downloads: string[];
    references: string[];
  };
}

export interface SocialProof {
  projectId: string;
  totalUsers: number;
  activeUsers: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  testimonials: Array<{
    userId: string;
    username: string;
    avatar: string;
    rating: number;
    comment: string;
    timestamp: Date;
    verified: boolean;
  }>;
  communityMetrics: {
    telegramMembers?: number;
    twitterFollowers?: number;
    discordMembers?: number;
  };
}

export interface ProjectAnalytics {
  projectId: string;
  views: number;
  uniqueViews: number;
  enrollments: number;
  completions: number;
  averageCompletionTime: number;
  dropOffPoints: number[];
  popularModules: string[];
  quizStats: {
    attempts: number;
    passRate: number;
    averageScore: number;
  };
  engagementMetrics: {
    timeSpent: number;
    interactionRate: number;
    shareRate: number;
  };
}

export interface Reward {
  id: string;
  type: 'points' | 'badge' | 'certificate' | 'nft' | 'token';
  title: string;
  description: string;
  icon: string;
  value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    projectId?: string;
    action: string;
    threshold?: number;
  };
}

export interface PointsSystem {
  projectId: string;
  actions: {
    [key: string]: {
      points: number;
      multiplier?: number;
      maxDaily?: number;
      description: string;
    };
  };
  bonuses: {
    streak: number[];
    completion: number;
    perfectScore: number;
    speedBonus: number;
    referralBonus: number;
  };
  levels: {
    [key: number]: {
      title: string;
      requiredPoints: number;
      rewards: string[];
    };
  };
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  longDescription: string;
  metadata: ProjectMetadata;
  requirements: ProjectRequirements;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // total minutes
  modules: LearningModule[];
  quiz: Quiz;
  socialProof: SocialProof;
  analytics: ProjectAnalytics;
  pointsSystem: PointsSystem;
  rewards: Reward[];
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  priority: number;
  partnerInfo?: {
    partnerName: string;
    partnerLogo: string;
    partnershipType: 'official' | 'educational' | 'integration';
    benefits: string[];
  };
}

// User Progress Types
export interface UserProjectProgress {
  userId: string;
  projectId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'certified';
  startedAt?: Date;
  completedAt?: Date;
  lastActivityAt: Date;
  timeSpent: number;
  modulesCompleted: string[];
  currentModule?: string;
  quizAttempts: number;
  quizScore?: number;
  quizPassed: boolean;
  pointsEarned: number;
  achievements: string[];
  certificate?: {
    id: string;
    issuedAt: Date;
    verificationCode: string;
  };
}

export interface UserStats {
  userId: string;
  totalPoints: number;
  level: number;
  projectsCompleted: number;
  quizzesPassed: number;
  totalTimeSpent: number;
  streakDays: number;
  lastActiveDate: Date;
  rank: number;
  badges: string[];
  certificates: string[];
  referrals: {
    count: number;
    pointsEarned: number;
  };
}

// Backend Extensibility Types
export interface ProjectTemplate {
  id: string;
  name: string;
  category: ProjectCategory;
  defaultModules: Omit<LearningModule, 'id' | 'projectId'>[];
  defaultQuiz: Omit<Quiz, 'id' | 'projectId'>;
  defaultRewards: Omit<Reward, 'id'>[];
  defaultPointsSystem: PointsSystem;
  configuration: {
    customizableFields: string[];
    requiredFields: string[];
    optionalFields: string[];
  };
}

export interface PartnershipConfig {
  partnerId: string;
  partnerName: string;
  partnerType: 'exchange' | 'wallet' | 'game' | 'nft_platform' | 'defi_protocol';
  projects: string[];
  branding: {
    logo: string;
    colors: string[];
    customCSS?: string;
  };
  features: {
    coBranding: boolean;
    customRewards: boolean;
    dedicatedSupport: boolean;
    analyticsAccess: boolean;
  };
  integration: {
    apiEndpoints: string[];
    webhooks: string[];
    authentication: string;
  };
}

// API Response Types
export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  filters: {
    category?: ProjectCategory;
    difficulty?: DifficultyLevel;
    status?: ProjectStatus;
    featured?: boolean;
  };
}

export interface ProjectDetailResponse {
  project: Project;
  userProgress?: UserProjectProgress;
  relatedProjects: Project[];
}

// Validation Types
export interface ProjectValidation {
  rules: {
    [key: string]: {
      required: boolean;
      type: string;
      minLength?: number;
      maxLength?: number;
      pattern?: string;
      custom?: (value: any) => boolean;
    };
  };
  errors: {
    [key: string]: string[];
  };
}

