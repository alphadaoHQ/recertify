import {
  Project,
  ProjectTemplate,
  PartnershipConfig,
  ProjectCategory,
  DifficultyLevel,
  ProjectStatus,
  LearningModule,
  Quiz,
  QuizQuestion,
  PointsSystem,
  Reward,
  ProjectValidation,
  ProjectMetadata,
  ProjectRequirements,
  SocialProof,
  ProjectAnalytics
} from '../types/blockchain-projects';

// Project Templates for Backend Extensibility
const projectTemplatesData: Record<ProjectCategory, ProjectTemplate> = {
  [ProjectCategory.MEME]: {
    id: 'meme-template',
    name: 'Meme Token Template',
    category: ProjectCategory.MEME,
    defaultModules: [
      {
        title: 'Introduction to [PROJECT_NAME]',
        description: 'Learn about [PROJECT_NAME] and its place in meme culture',
        content: `# Welcome to [PROJECT_NAME]! 🚀

[PROJECT_DESCRIPTION]

## Key Features
- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]

## Getting Started
1. [STEP_1]
2. [STEP_2]
3. [STEP_3]

## Community
Join our community to stay updated and participate in governance.`,
        type: 'article',
        order: 1,
        estimatedTime: 15,
        difficulty: DifficultyLevel.BEGINNER,
        isRequired: true,
        resources: {
          links: ['[PROJECT_WEBSITE]'],
          downloads: [],
          references: ['Meme Token Documentation']
        }
      },
      {
        title: '[PROJECT_NAME] Tokenomics',
        description: 'Understanding the economic model of [PROJECT_NAME]',
        content: `# [PROJECT_NAME] Tokenomics 💰

## Supply Details
- **Total Supply**: [TOTAL_SUPPLY]
- **Circulating Supply**: [CIRCULATING_SUPPLY]
- **Burn Rate**: [BURN_RATE]

## Distribution
- **Team**: [TEAM_PERCENTAGE]%
- **Community**: [COMMUNITY_PERCENTAGE]%
- **Marketing**: [MARKETING_PERCENTAGE]%
- **Reserve**: [RESERVE_PERCENTAGE]%

## Utility
- [UTILITY_1]
- [UTILITY_2]
- [UTILITY_3]`,
        type: 'article',
        order: 2,
        estimatedTime: 20,
        difficulty: DifficultyLevel.INTERMEDIATE,
        isRequired: false,
        resources: {
          links: ['[WHITEPAPER_URL]'],
          downloads: ['[TOKENOMICS_PDF]'],
          references: ['Economic Documentation']
        }
      }
    ],
    defaultQuiz: {
      title: '[PROJECT_NAME] Knowledge Quiz',
      description: 'Test your understanding of [PROJECT_NAME]',
      questions: [
        {
          id: 'q1',
          question: 'What is the total supply of [PROJECT_NAME] tokens?',
          options: ['[OPTION_1]', '[OPTION_2]', '[OPTION_3]', '[OPTION_4]'],
          correctAnswer: 0,
          explanation: '[EXPLANATION_1]',
          points: 10,
          difficulty: DifficultyLevel.BEGINNER
        },
        {
          id: 'q2',
          question: 'Which blockchain is [PROJECT_NAME] built on?',
          options: ['[BLOCKCHAIN_1]', '[BLOCKCHAIN_2]', '[BLOCKCHAIN_3]', '[BLOCKCHAIN_4]'],
          correctAnswer: 1,
          explanation: '[EXPLANATION_2]',
          points: 10,
          difficulty: DifficultyLevel.BEGINNER
        },
        {
          id: 'q3',
          question: 'What makes [PROJECT_NAME] unique?',
          options: ['[UNIQUE_1]', '[UNIQUE_2]', '[UNIQUE_3]', '[UNIQUE_4]'],
          correctAnswer: 2,
          explanation: '[EXPLANATION_3]',
          points: 15,
          difficulty: DifficultyLevel.INTERMEDIATE
        }
      ],
      passingScore: 70,
      maxAttempts: 3,
      timeLimit: 15,
      points: {
        total: 35,
        perQuestion: 12,
        bonus: 10
      }
    },
    defaultRewards: [
      {
        type: 'badge',
        title: '[PROJECT_NAME] Enthusiast',
        description: 'Completed [PROJECT_NAME] learning module',
        icon: '/badges/[PROJECT_SLUG]-enthusiast.svg',
        value: 50,
        rarity: 'common',
        requirements: {
          action: 'module_completed',
          threshold: 1
        }
      },
      {
        type: 'certificate',
        title: '[PROJECT_NAME] Certified',
        description: 'Mastered [PROJECT_NAME] concepts',
        icon: '/certificates/[PROJECT_SLUG]-certified.svg',
        value: 200,
        rarity: 'rare',
        requirements: {
          action: 'quiz_passed',
          threshold: 1
        }
      }
    ],
    defaultPointsSystem: {
      projectId: '',
      actions: {
        module_completed: {
          points: 50,
          multiplier: 1.0,
          description: 'Complete a learning module'
        },
        quiz_passed: {
          points: 100,
          multiplier: 1.5,
          description: 'Pass the project quiz'
        },
        shared_project: {
          points: 25,
          maxDaily: 100,
          description: 'Share project with friends'
        }
      },
      bonuses: {
        streak: [5, 10, 20, 30],
        completion: 100,
        perfectScore: 50,
        speedBonus: 25,
        referralBonus: 75
      },
      levels: {
        1: {
          title: 'Beginner',
          requiredPoints: 0,
          rewards: ['basic-badge']
        },
        2: {
          title: 'Intermediate',
          requiredPoints: 100,
          rewards: ['intermediate-badge']
        },
        3: {
          title: 'Expert',
          requiredPoints: 500,
          rewards: ['expert-badge']
        }
      }
    },
    configuration: {
      customizableFields: [
        'name',
        'description',
        'logo',
        'banner',
        'website',
        'socialLinks',
        'tokenomics',
        'features'
      ],
      requiredFields: [
        'name',
        'slug',
        'category',
        'description',
        'website',
        'logo'
      ],
      optionalFields: [
        'whitepaper',
        'documentation',
        'partnerInfo',
        'customRewards'
      ]
    }
  },
  [ProjectCategory.GAMING]: {
    id: 'gaming-template',
    name: 'Gaming Project Template',
    category: ProjectCategory.GAMING,
    defaultModules: [
      {
        title: 'Introduction to [PROJECT_NAME]',
        description: 'Discover the world of [PROJECT_NAME]',
        content: `# Welcome to [PROJECT_NAME]! 🎮

[PROJECT_DESCRIPTION]

## Game Overview
- **Genre**: [GAME_GENRE]
- **Platform**: [GAME_PLATFORM]
- **Players**: [PLAYER_COUNT]

## Gameplay Features
- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]

## Getting Started
1. [STEP_1]
2. [STEP_2]
3. [STEP_3]`,
        type: 'article',
        order: 1,
        estimatedTime: 20,
        difficulty: DifficultyLevel.BEGINNER,
        isRequired: true,
        resources: {
          links: ['[GAME_WEBSITE]'],
          downloads: ['[GAME_CLIENT]'],
          references: ['Gaming Documentation']
        }
      }
    ],
    defaultQuiz: {
      title: '[PROJECT_NAME] Gaming Expert Quiz',
      description: 'Test your gaming knowledge',
      questions: [
        {
          id: 'q1',
          question: 'What type of game is [PROJECT_NAME]?',
          options: ['[TYPE_1]', '[TYPE_2]', '[TYPE_3]', '[TYPE_4]'],
          correctAnswer: 0,
          explanation: '[EXPLANATION_1]',
          points: 10,
          difficulty: DifficultyLevel.BEGINNER
        }
      ],
      passingScore: 70,
      maxAttempts: 3,
      timeLimit: 20,
      points: {
        total: 10,
        perQuestion: 10,
        bonus: 10
      }
    },
    defaultRewards: [
      {
        type: 'badge',
        title: '[PROJECT_NAME] Gamer',
        description: 'Completed [PROJECT_NAME] gaming module',
        icon: '/badges/[PROJECT_SLUG]-gamer.svg',
        value: 75,
        rarity: 'common',
        requirements: {
          action: 'module_completed',
          threshold: 1
        }
      }
    ],
    defaultPointsSystem: {
      projectId: '',
      actions: {
        module_completed: {
          points: 75,
          multiplier: 1.0,
          description: 'Complete a learning module'
        },
        quiz_passed: {
          points: 150,
          multiplier: 1.5,
          description: 'Pass the project quiz'
        }
      },
      bonuses: {
        streak: [10, 25, 50, 100],
        completion: 150,
        perfectScore: 75,
        speedBonus: 50,
        referralBonus: 100
      },
      levels: {
        1: {
          title: 'Novice Gamer',
          requiredPoints: 0,
          rewards: ['gamer-badge']
        },
        2: {
          title: 'Pro Player',
          requiredPoints: 500,
          rewards: ['pro-gamer-badge']
        },
        3: {
          title: 'Game Master',
          requiredPoints: 2000,
          rewards: ['master-gamer-badge']
        }
      }
    },
    configuration: {
      customizableFields: [
        'name',
        'description',
        'gameType',
        'platform',
        'features',
        'rewards'
      ],
      requiredFields: [
        'name',
        'slug',
        'category',
        'description',
        'gameType',
        'platform'
      ],
      optionalFields: [
        'tournamentSystem',
        'guildFeatures',
        'esportsIntegration'
      ]
    }
  },
  [ProjectCategory.NFTS]: {
    id: 'nft-template',
    name: 'NFT Project Template',
    category: ProjectCategory.NFTS,
    defaultModules: [
      {
        title: 'Introduction to [PROJECT_NAME]',
        description: 'Understanding [PROJECT_NAME] NFT ecosystem',
        content: `# Welcome to [PROJECT_NAME]! 🎨

[PROJECT_DESCRIPTION]

## NFT Collection Overview
- **Total Supply**: [TOTAL_SUPPLY]
- **Mint Price**: [MINT_PRICE]
- **Blockchain**: [BLOCKCHAIN]

## Key Features
- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]

## Getting Started
1. [STEP_1]
2. [STEP_2]
3. [STEP_3]`,
        type: 'article',
        order: 1,
        estimatedTime: 25,
        difficulty: DifficultyLevel.INTERMEDIATE,
        isRequired: true,
        resources: {
          links: ['[MARKETPLACE_URL]'],
          downloads: ['[COLLECTION_METADATA]'],
          references: ['NFT Documentation']
        }
      }
    ],
    defaultQuiz: {
      title: '[PROJECT_NAME] NFT Expert Quiz',
      description: 'Test your NFT trading knowledge',
      questions: [
        {
          id: 'q1',
          question: 'What is the total supply of [PROJECT_NAME] NFTs?',
          options: ['[SUPPLY_1]', '[SUPPLY_2]', '[SUPPLY_3]', '[SUPPLY_4]'],
          correctAnswer: 0,
          explanation: '[EXPLANATION_1]',
          points: 10,
          difficulty: DifficultyLevel.BEGINNER
        }
      ],
      passingScore: 75,
      maxAttempts: 3,
      timeLimit: 25,
      points: {
        total: 10,
        perQuestion: 10,
        bonus: 15
      }
    },
    defaultRewards: [
      {
        type: 'badge',
        title: '[PROJECT_NAME] Trader',
        description: 'Completed [PROJECT_NAME] trading course',
        icon: '/badges/[PROJECT_SLUG]-trader.svg',
        value: 100,
        rarity: 'rare',
        requirements: {
          action: 'module_completed',
          threshold: 1
        }
      }
    ],
    defaultPointsSystem: {
      projectId: '',
      actions: {
        module_completed: {
          points: 100,
          multiplier: 1.0,
          description: 'Complete a learning module'
        },
        quiz_passed: {
          points: 200,
          multiplier: 1.5,
          description: 'Pass the project quiz'
        }
      },
      bonuses: {
        streak: [7, 14, 30, 60],
        completion: 200,
        perfectScore: 100,
        speedBonus: 75,
        referralBonus: 150
      },
      levels: {
        1: {
          title: 'NFT Novice',
          requiredPoints: 0,
          rewards: ['nft-badge']
        },
        2: {
          title: 'Market Trader',
          requiredPoints: 1000,
          rewards: ['trader-badge']
        },
        3: {
          title: 'NFT Expert',
          requiredPoints: 5000,
          rewards: ['expert-badge']
        }
      }
    },
    configuration: {
      customizableFields: [
        'name',
        'description',
        'collectionSize',
        'blockchain',
        'marketplace',
        'features'
      ],
      requiredFields: [
        'name',
        'slug',
        'category',
        'description',
        'collectionSize',
        'blockchain'
      ],
      optionalFields: [
        'marketplaceIntegration',
        'tradingTools',
        'analyticsFeatures'
      ]
    }
  },
  [ProjectCategory.DEFI]: {
    id: 'defi-template',
    name: 'DeFi Protocol Template',
    category: ProjectCategory.DEFI,
    defaultModules: [
      {
        title: 'Introduction to [PROJECT_NAME]',
        description: 'Understanding [PROJECT_NAME] DeFi protocol',
        content: `# Welcome to [PROJECT_NAME]! 💰

[PROJECT_DESCRIPTION]

## Protocol Overview
- **Type**: [PROTOCOL_TYPE]
- **Blockchain**: [BLOCKCHAIN]`,
        type: 'article',
        order: 1,
        estimatedTime: 30,
        difficulty: DifficultyLevel.INTERMEDIATE,
        isRequired: true,
        resources: {
          links: ['[PROTOCOL_DOCS]'],
          downloads: ['[SMART_CONTRACTS]'],
          references: ['DeFi Documentation']
        }
      }
    ],
    defaultQuiz: {
      title: '[PROJECT_NAME] DeFi Expert Quiz',
      description: 'Test your DeFi knowledge',
      questions: [
        {
          id: 'q1',
          question: 'What type of DeFi protocol is [PROJECT_NAME]?',
          options: ['[TYPE_1]', '[TYPE_2]', '[TYPE_3]', '[TYPE_4]'],
          correctAnswer: 0,
          explanation: '[EXPLANATION_1]',
          points: 10,
          difficulty: DifficultyLevel.INTERMEDIATE
        }
      ],
      passingScore: 75,
      maxAttempts: 3,
      timeLimit: 30,
      points: {
        total: 10,
        perQuestion: 10,
        bonus: 15
      }
    },
    defaultRewards: [
      {
        type: 'badge',
        title: '[PROJECT_NAME] DeFi User',
        description: 'Completed [PROJECT_NAME] DeFi module',
        icon: '/badges/[PROJECT_SLUG]-defi.svg',
        value: 125,
        rarity: 'rare',
        requirements: {
          action: 'module_completed',
          threshold: 1
        }
      }
    ],
    defaultPointsSystem: {
      projectId: '',
      actions: {
        module_completed: {
          points: 125,
          multiplier: 1.0,
          description: 'Complete a learning module'
        },
        protocol_used: {
          points: 200,
          multiplier: 1.5,
          description: 'Use the protocol'
        }
      },
      bonuses: {
        streak: [14, 30, 60, 90],
        completion: 250,
        perfectScore: 125,
        speedBonus: 100,
        referralBonus: 200
      },
      levels: {
        1: {
          title: 'DeFi Beginner',
          requiredPoints: 0,
          rewards: ['defi-badge']
        },
        2: {
          title: 'DeFi User',
          requiredPoints: 1500,
          rewards: ['user-badge']
        },
        3: {
          title: 'DeFi Expert',
          requiredPoints: 7500,
          rewards: ['expert-badge']
        }
      }
    },
    configuration: {
      customizableFields: [
        'name',
        'description',
        'protocolType',
        'blockchain',
        'features'
      ],
      requiredFields: [
        'name',
        'slug',
        'category',
        'description',
        'protocolType',
        'blockchain'
      ],
      optionalFields: [
        'riskMetrics',
        'auditReports',
        'insuranceFeatures'
      ]
    }
  },
  [ProjectCategory.INFRASTRUCTURE]: {
    id: 'infrastructure-template',
    name: 'Infrastructure Project Template',
    category: ProjectCategory.INFRASTRUCTURE,
    defaultModules: [
      {
        title: 'Introduction to [PROJECT_NAME]',
        description: 'Understanding [PROJECT_NAME] infrastructure',
        content: `# Welcome to [PROJECT_NAME]! 🏗️

[PROJECT_DESCRIPTION]

## Infrastructure Overview
- **Type**: [INFRA_TYPE]
- **Purpose**: [PURPOSE]`,
        type: 'article',
        order: 1,
        estimatedTime: 35,
        difficulty: DifficultyLevel.ADVANCED,
        isRequired: true,
        resources: {
          links: ['[INFRA_DOCS]'],
          downloads: ['[TECHNICAL_SPECS]'],
          references: ['Infrastructure Documentation']
        }
      }
    ],
    defaultQuiz: {
      title: '[PROJECT_NAME] Infrastructure Expert Quiz',
      description: 'Test your infrastructure knowledge',
      questions: [
        {
          id: 'q1',
          question: 'What type of infrastructure is [PROJECT_NAME]?',
          options: ['[TYPE_1]', '[TYPE_2]', '[TYPE_3]', '[TYPE_4]'],
          correctAnswer: 0,
          explanation: '[EXPLANATION_1]',
          points: 15,
          difficulty: DifficultyLevel.ADVANCED
        }
      ],
      passingScore: 80,
      maxAttempts: 3,
      timeLimit: 35,
      points: {
        total: 15,
        perQuestion: 15,
        bonus: 20
      }
    },
    defaultRewards: [
      {
        type: 'badge',
        title: '[PROJECT_NAME] Infrastructure Expert',
        description: 'Completed [PROJECT_NAME] infrastructure module',
        icon: '/badges/[PROJECT_SLUG]-infra.svg',
        value: 150,
        rarity: 'epic',
        requirements: {
          action: 'module_completed',
          threshold: 1
        }
      }
    ],
    defaultPointsSystem: {
      projectId: '',
      actions: {
        module_completed: {
          points: 150,
          multiplier: 1.0,
          description: 'Complete a learning module'
        },
        infrastructure_used: {
          points: 300,
          multiplier: 2.0,
          description: 'Use the infrastructure'
        }
      },
      bonuses: {
        streak: [21, 45, 90, 180],
        completion: 300,
        perfectScore: 150,
        speedBonus: 125,
        referralBonus: 250
      },
      levels: {
        1: {
          title: 'Infrastructure Novice',
          requiredPoints: 0,
          rewards: ['infra-badge']
        },
        2: {
          title: 'Infrastructure User',
          requiredPoints: 2000,
          rewards: ['user-badge']
        },
        3: {
          title: 'Infrastructure Expert',
          requiredPoints: 10000,
          rewards: ['expert-badge']
        }
      }
    },
    configuration: {
      customizableFields: [
        'name',
        'description',
        'infraType',
        'technicalSpecs',
        'features'
      ],
      requiredFields: [
        'name',
        'slug',
        'category',
        'description',
        'infraType',
        'technicalSpecs'
      ],
      optionalFields: [
        'apiDocumentation',
        'integrationGuides',
        'performanceMetrics'
      ]
    }
  },
  [ProjectCategory.SOCIAL]: {
    id: 'social-template',
    name: 'Social Project Template',
    category: ProjectCategory.SOCIAL,
    defaultModules: [
      {
        title: 'Introduction to [PROJECT_NAME]',
        description: 'Understanding [PROJECT_NAME] social platform',
        content: `# Welcome to [PROJECT_NAME]! 🌐

[PROJECT_DESCRIPTION]

## Platform Overview
- **Type**: [PLATFORM_TYPE]
- **Features**: [FEATURES]`,
        type: 'article',
        order: 1,
        estimatedTime: 20,
        difficulty: DifficultyLevel.BEGINNER,
        isRequired: true,
        resources: {
          links: ['[PLATFORM_DOCS]'],
          downloads: ['[USER_GUIDE]'],
          references: ['Social Platform Documentation']
        }
      }
    ],
    defaultQuiz: {
      title: '[PROJECT_NAME] Social Platform Quiz',
      description: 'Test your social platform knowledge',
      questions: [
        {
          id: 'q1',
          question: 'What type of social platform is [PROJECT_NAME]?',
          options: ['[TYPE_1]', '[TYPE_2]', '[TYPE_3]', '[TYPE_4]'],
          correctAnswer: 0,
          explanation: '[EXPLANATION_1]',
          points: 10,
          difficulty: DifficultyLevel.BEGINNER
        }
      ],
      passingScore: 70,
      maxAttempts: 3,
      timeLimit: 20,
      points: {
        total: 10,
        perQuestion: 10,
        bonus: 10
      }
    },
    defaultRewards: [
      {
        type: 'badge',
        title: '[PROJECT_NAME] Social User',
        description: 'Completed [PROJECT_NAME] social module',
        icon: '/badges/[PROJECT_SLUG]-social.svg',
        value: 60,
        rarity: 'common',
        requirements: {
          action: 'module_completed',
          threshold: 1
        }
      }
    ],
    defaultPointsSystem: {
      projectId: '',
      actions: {
        module_completed: {
          points: 60,
          multiplier: 1.0,
          description: 'Complete a learning module'
        },
        social_interaction: {
          points: 30,
          multiplier: 1.0,
          description: 'Interact with the platform'
        }
      },
      bonuses: {
        streak: [5, 10, 20, 30],
        completion: 120,
        perfectScore: 60,
        speedBonus: 30,
        referralBonus: 90
      },
      levels: {
        1: {
          title: 'Social Novice',
          requiredPoints: 0,
          rewards: ['social-badge']
        },
        2: {
          title: 'Social User',
          requiredPoints: 500,
          rewards: ['user-badge']
        },
        3: {
          title: 'Social Expert',
          requiredPoints: 2500,
          rewards: ['expert-badge']
        }
      }
    },
    configuration: {
      customizableFields: [
        'name',
        'description',
        'platformType',
        'features',
        'community'
      ],
      requiredFields: [
        'name',
        'slug',
        'category',
        'description',
        'platformType'
      ],
      optionalFields: [
        'communityFeatures',
        'governanceModel',
        'rewardSystem'
      ]
    }
  }
};

// Backend Utilities for Project Management
export class ProjectManager {
  private static instance: ProjectManager;
  private projects: Map<string, Project> = new Map();
  private templates: Map<ProjectCategory, ProjectTemplate> = new Map();

  constructor() {
    // Initialize templates
    Object.entries(projectTemplatesData).forEach(([category, template]) => {
      this.templates.set(category as ProjectCategory, template);
    });
  }

  static getInstance(): ProjectManager {
    if (!ProjectManager.instance) {
      ProjectManager.instance = new ProjectManager();
    }
    return ProjectManager.instance;
  }

  // Create new project from template
  createProjectFromTemplate(
    category: ProjectCategory,
    projectData: Partial<Project>,
    partnerConfig?: PartnershipConfig
  ): Project {
    const template = this.templates.get(category);
    if (!template) {
      throw new Error(`No template found for category: ${category}`);
    }

    // Validate required fields
    this.validateProjectData(projectData, template);

    // Create project from template
    const project: Project = {
      id: projectData.id || this.generateId(),
      name: projectData.name || '',
      slug: projectData.slug || this.generateSlug(projectData.name || ''),
      category,
      status: ProjectStatus.ACTIVE,
      description: projectData.description || '',
      longDescription: projectData.longDescription || projectData.description || '',
      metadata: this.createMetadata(projectData, template),
      requirements: this.createRequirements(projectData, template),
      difficulty: projectData.difficulty || DifficultyLevel.BEGINNER,
      estimatedDuration: this.calculateEstimatedDuration(template),
      modules: this.createModules(projectData, template),
      quiz: this.createQuiz(projectData, template),
      socialProof: this.createSocialProof(projectData),
      analytics: this.createAnalytics(projectData),
      pointsSystem: this.createPointsSystem(projectData, template),
      rewards: this.createRewards(projectData, template),
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: projectData.featured || false,
      priority: projectData.priority || 999,
      partnerInfo: partnerConfig ? this.createPartnerInfo(partnerConfig) : undefined
    };

    // Store project
    this.projects.set(project.id, project);
    return project;
  }

  // Update existing project
  updateProject(projectId: string, updates: Partial<Project>): Project {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date()
    };

    this.projects.set(projectId, updatedProject);
    return updatedProject;
  }

  // Get project by ID
  getProject(projectId: string): Project | undefined {
    return this.projects.get(projectId);
  }

  // Get all projects
  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  // Get projects by category
  getProjectsByCategory(category: ProjectCategory): Project[] {
    return this.getAllProjects().filter(p => p.category === category);
  }

  // Get featured projects
  getFeaturedProjects(): Project[] {
    return this.getAllProjects().filter(p => p.featured);
  }

  // Search projects
  searchProjects(query: string): Project[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllProjects().filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.slug.toLowerCase().includes(lowerQuery) ||
      p.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Validate project data
  private validateProjectData(projectData: Partial<Project>, template: ProjectTemplate): void {
    const errors: string[] = [];

    // Check required fields
    template.configuration.requiredFields.forEach(field => {
      if (!projectData[field as keyof Project]) {
        errors.push(`Required field missing: ${field}`);
      }
    });

    // Validate slug format
    if (projectData.slug && !/^[a-z0-9-]+$/.test(projectData.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }

    // Validate category
    if (projectData.category && !Object.values(ProjectCategory).includes(projectData.category)) {
      errors.push('Invalid project category');
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }

  // Helper methods for creating project components
  private createMetadata(projectData: Partial<Project>, template: ProjectTemplate): ProjectMetadata {
    return {
      logo: projectData.metadata?.logo || `/projects/${projectData.slug}/logo.png`,
      banner: projectData.metadata?.banner || `/projects/${projectData.slug}/banner.jpg`,
      website: projectData.metadata?.website || '',
      whitepaper: projectData.metadata?.whitepaper,
      documentation: projectData.metadata?.documentation,
      socialLinks: projectData.metadata?.socialLinks || {},
      tags: projectData.metadata?.tags || [],
      partnerships: projectData.metadata?.partnerships || []
    };
  }

  private createRequirements(projectData: Partial<Project>, template: ProjectTemplate): ProjectRequirements {
    return {
      minLevel: projectData.requirements?.minLevel || 1,
      prerequisites: projectData.requirements?.prerequisites || [],
      timeEstimate: projectData.requirements?.timeEstimate || {
        reading: 15,
        quiz: 10,
        total: 25
      },
      resources: projectData.requirements?.resources || {
        articles: [],
        videos: [],
        tools: []
      }
    };
  }

  private createModules(projectData: Partial<Project>, template: ProjectTemplate): LearningModule[] {
    return template.defaultModules.map((module, index) => ({
      id: `${projectData.slug}-module-${index + 1}`,
      projectId: projectData.id || '',
      ...module,
      content: this.replacePlaceholders(module.content, projectData)
    }));
  }

  private createQuiz(projectData: Partial<Project>, template: ProjectTemplate): Quiz {
    return {
      id: `${projectData.slug}-quiz`,
      projectId: projectData.id || '',
      ...template.defaultQuiz,
      questions: template.defaultQuiz.questions.map(q => ({
        ...q,
        question: this.replacePlaceholders(q.question, projectData),
        options: q.options.map(opt => this.replacePlaceholders(opt, projectData)),
        explanation: this.replacePlaceholders(q.explanation, projectData)
      }))
    };
  }

  private createSocialProof(projectData: Partial<Project>): SocialProof {
    return {
      projectId: projectData.id || '',
      totalUsers: 0,
      activeUsers: 0,
      completionRate: 0,
      averageRating: 0,
      totalReviews: 0,
      testimonials: [],
      communityMetrics: {}
    };
  }

  private createAnalytics(projectData: Partial<Project>): ProjectAnalytics {
    return {
      projectId: projectData.id || '',
      views: 0,
      uniqueViews: 0,
      enrollments: 0,
      completions: 0,
      averageCompletionTime: 0,
      dropOffPoints: [],
      popularModules: [],
      quizStats: {
        attempts: 0,
        passRate: 0,
        averageScore: 0
      },
      engagementMetrics: {
        timeSpent: 0,
        interactionRate: 0,
        shareRate: 0
      }
    };
  }

  private createPointsSystem(projectData: Partial<Project>, template: ProjectTemplate): PointsSystem {
    return {
      ...template.defaultPointsSystem,
      projectId: projectData.id || ''
    };
  }

  private createRewards(projectData: Partial<Project>, template: ProjectTemplate): Reward[] {
    return template.defaultRewards.map((reward, index) => ({
      id: `${projectData.slug}-reward-${index + 1}`,
      ...reward,
      title: this.replacePlaceholders(reward.title, projectData),
      description: this.replacePlaceholders(reward.description, projectData),
      icon: this.replacePlaceholders(reward.icon, projectData),
      requirements: {
        ...reward.requirements,
        projectId: projectData.id
      }
    }));
  }

  private createPartnerInfo(partnerConfig: PartnershipConfig): any {
    return {
      partnerName: partnerConfig.partnerName,
      partnerLogo: partnerConfig.branding.logo,
      partnershipType: 'official',
      benefits: partnerConfig.features.coBranding ? ['Co-branding', 'Custom rewards'] : []
    };
  }

  private calculateEstimatedDuration(template: ProjectTemplate): number {
    return template.defaultModules.reduce((total, module) => total + module.estimatedTime, 0) + 15;
  }

  private replacePlaceholders(text: string, projectData: Partial<Project>): string {
    const placeholders: Record<string, string> = {
      '[PROJECT_NAME]': projectData.name || '',
      '[PROJECT_DESCRIPTION]': projectData.description || '',
      '[PROJECT_SLUG]': projectData.slug || '',
      '[PROJECT_WEBSITE]': projectData.metadata?.website || '',
      '[TOTAL_SUPPLY]': projectData.metadata?.tags?.find(tag => tag.includes('supply')) || 'N/A',
      '[BLOCKCHAIN]': projectData.metadata?.tags?.find(tag => ['ton', 'ethereum', 'solana'].includes(tag.toLowerCase())) || 'N/A'
    };

    let result = text;
    Object.entries(placeholders).forEach(([placeholder, value]) => {
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    return result;
  }

  private generateId(): string {
    return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

// Points and Rewards Calculation Logic
export class PointsCalculator {
  // Calculate points for completing a module
  static calculateModulePoints(
    basePoints: number,
    difficulty: DifficultyLevel,
    timeSpent: number,
    estimatedTime: number,
    streakDays: number
  ): number {
    let points = basePoints;

    // Difficulty multiplier
    const difficultyMultipliers = {
      [DifficultyLevel.BEGINNER]: 1.0,
      [DifficultyLevel.INTERMEDIATE]: 1.25,
      [DifficultyLevel.ADVANCED]: 1.5,
      [DifficultyLevel.EXPERT]: 2.0
    };
    points *= difficultyMultipliers[difficulty];

    // Time bonus (complete within estimated time)
    if (timeSpent <= estimatedTime) {
      points *= 1.1;
    }

    // Streak bonus
    if (streakDays >= 7) {
      points *= 1.05;
    }
    if (streakDays >= 30) {
      points *= 1.1;
    }

    return Math.round(points);
  }

  // Calculate quiz points
  static calculateQuizPoints(
    basePoints: number,
    score: number,
    maxScore: number,
    attempts: number,
    timeSpent: number,
    timeLimit?: number
  ): number {
    let points = basePoints;

    // Score multiplier
    const scorePercentage = score / maxScore;
    points *= scorePercentage;

    // Perfect score bonus
    if (score === maxScore) {
      points += 50;
    }

    // Attempts penalty
    if (attempts > 1) {
      points *= Math.max(0.5, 1 - (attempts - 1) * 0.2);
    }

    // Time bonus
    if (timeLimit && timeSpent <= timeLimit * 0.5) {
      points *= 1.1;
    }

    return Math.round(points);
  }

  // Calculate level from points
  static calculateLevel(totalPoints: number, levelThresholds: number[]): number {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (totalPoints >= levelThresholds[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  // Calculate rewards eligibility
  static isEligibleForReward(
    userProgress: any,
    reward: Reward,
    userStats: any
  ): boolean {
    // Check project-specific requirements
    if (reward.requirements.projectId && userProgress.projectId !== reward.requirements.projectId) {
      return false;
    }

    // Check action requirements
    switch (reward.requirements.action) {
      case 'module_completed':
        return userProgress.modulesCompleted.length > 0;
      case 'quiz_passed':
        return userProgress.quizPassed;
      case 'perfect_score':
        return userProgress.quizScore === 100;
      case 'all_modules_completed':
        return userProgress.modulesCompleted.length === userProgress.totalModules;
      case 'time_based':
        return userProgress.timeSpent >= (reward.requirements.threshold || 0);
      default:
        return false;
    }
  }
}

// Export templates for external use
export const blockchainProjectTemplates = projectTemplatesData;