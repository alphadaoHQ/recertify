import { 
  ProjectManager, 
  PointsCalculator, 
  blockchainProjectTemplates 
} from '../lib/projectManager';
import { 
  Project, 
  ProjectCategory, 
  DifficultyLevel,
  UserProjectProgress 
} from '../types/blockchain-projects';

// Example Usage of the Project Management System

// 1. Initialize the Project Manager
const projectManager = ProjectManager.getInstance();

// 2. Create a new project using a template
export function createNewMemeProject() {
  const projectData = {
    id: 'new-meme-coin',
    name: 'PepeFrog',
    slug: 'pepefrog',
    description: 'The hottest new meme coin on TON blockchain featuring everyone\'s favorite frog!',
    longDescription: 'PepeFrog combines the iconic Pepe meme with cutting-edge blockchain technology to create the most fun and engaging cryptocurrency community on The Open Network.',
    difficulty: DifficultyLevel.BEGINNER,
    featured: true,
    priority: 1,
    metadata: {
      logo: '/projects/pepefrog/logo.png',
      banner: '/projects/pepefrog/banner.jpg',
      website: 'https://pepefrog.ton',
      whitepaper: 'https://docs.pepefrog.ton/whitepaper',
      socialLinks: {
        twitter: 'https://twitter.com/PepeFrog',
        telegram: 'https://t.me/pepefrog',
        discord: 'https://discord.gg/pepefrog'
      },
      tags: ['meme', 'pepe', 'ton', 'community', 'fun'],
      partnerships: ['TON Foundation']
    }
  };

  const partnerConfig = {
    partnerId: 'pepefrog-foundation',
    partnerName: 'PepeFrog Foundation',
    partnerType: 'nft_platform' as const,
    projects: ['new-meme-coin'],
    branding: {
      logo: '/partners/pepefrog.png',
      colors: ['#00FF00', '#00AA00']
    },
    features: {
      coBranding: true,
      customRewards: true,
      dedicatedSupport: false,
      analyticsAccess: false
    },
    integration: {
      apiEndpoints: ['https://api.pepefrog.ton/v1'],
      webhooks: ['https://webhook.pepefrog.ton/events'],
      authentication: 'JWT'
    }
  };

  return projectManager.createProjectFromTemplate(
    ProjectCategory.MEME,
    projectData,
    partnerConfig
  );
}

// 3. Calculate points for user activities
export function calculateUserPoints(userProgress: UserProjectProgress) {
  // Module completion points
  const modulePoints = PointsCalculator.calculateModulePoints(
    50, // base points
    DifficultyLevel.BEGINNER,
    userProgress.timeSpent,
    25, // estimated time
    5 // streak days
  );

  // Quiz completion points
  const quizPoints = PointsCalculator.calculateQuizPoints(
    100, // base points
    userProgress.quizScore || 0,
    100, // max score
    userProgress.quizAttempts,
    12, // time spent
    15 // time limit
  );

  return {
    modulePoints,
    quizPoints,
    totalPoints: modulePoints + quizPoints + userProgress.pointsEarned
  };
}

// 4. Get available templates for backend integration
export function getAvailableTemplates() {
  return Object.entries(blockchainProjectTemplates).map(([category, template]) => ({
    category,
    name: template.name,
    description: `Template for ${category} projects`,
    customizableFields: template.configuration.customizableFields,
    requiredFields: template.configuration.requiredFields,
    estimatedModules: template.defaultModules.length,
    estimatedQuizQuestions: template.defaultQuiz.questions.length,
    baseRewards: template.defaultRewards.length
  }));
}

// 5. Validate project data before creation
export function validateProjectConfiguration(
  category: ProjectCategory,
  projectData: Partial<Project>
) {
  const template = blockchainProjectTemplates[category];
  
  if (!template) {
    return {
      valid: false,
      errors: [`No template available for category: ${category}`]
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

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

  // Check for best practices
  if (projectData.description && projectData.description.length < 50) {
    warnings.push('Description should be at least 50 characters for better SEO');
  }

  if (!projectData.metadata?.socialLinks?.telegram) {
    warnings.push('Telegram link is highly recommended for TON projects');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// 6. Generate project analytics mock data
export function generateProjectAnalytics(projectId: string) {
  return {
    projectId,
    views: Math.floor(Math.random() * 100000) + 10000,
    uniqueViews: Math.floor(Math.random() * 50000) + 5000,
    enrollments: Math.floor(Math.random() * 10000) + 1000,
    completions: Math.floor(Math.random() * 8000) + 500,
    averageCompletionTime: Math.floor(Math.random() * 60) + 15,
    dropOffPoints: [1, 2, 3].slice(0, Math.floor(Math.random() * 3) + 1),
    popularModules: ['module-1', 'module-2'],
    quizStats: {
      attempts: Math.floor(Math.random() * 20000) + 2000,
      passRate: Math.random() * 0.3 + 0.7, // 70-100%
      averageScore: Math.random() * 30 + 70 // 70-100
    },
    engagementMetrics: {
      timeSpent: Math.floor(Math.random() * 90) + 20,
      interactionRate: Math.random() * 0.4 + 0.6, // 60-100%
      shareRate: Math.random() * 0.2 + 0.05 // 5-25%
    }
  };
}

// 7. Backend API integration examples
export const backendAPIExamples = {
  // Create project endpoint
  createProject: `
    POST /api/projects
    Content-Type: application/json
    
    {
      "category": "meme",
      "projectData": {
        "name": "New Meme Coin",
        "slug": "new-meme-coin",
        "description": "Amazing meme project",
        "website": "https://newmeme.ton",
        "difficulty": "beginner",
        "featured": true
      },
      "partnerConfig": {
        "partnerId": "partner-123",
        "partnerName": "Partner Name",
        "branding": {
          "logo": "/partners/partner.png",
          "colors": ["#FF0000", "#00FF00"]
        }
      }
    }
  `,

  // Get project templates
  getTemplates: `
    GET /api/projects/templates
    
    Response:
    {
      "templates": [
        {
          "category": "meme",
          "name": "Meme Token Template",
          "requiredFields": ["name", "slug", "description", "website"],
          "customizableFields": ["logo", "banner", "socialLinks"]
        }
      ]
    }
  `,

  // Update project
  updateProject: `
    PUT /api/projects/:projectId
    Content-Type: application/json
    
    {
      "description": "Updated description",
      "featured": false,
      "metadata": {
        "socialLinks": {
          "twitter": "https://twitter.com/updated"
        }
      }
    }
  `,

  // Get project analytics
  getAnalytics: `
    GET /api/projects/:projectId/analytics?period=30d
    
    Response:
    {
      "views": 50000,
      "enrollments": 5000,
      "completions": 4200,
      "completionRate": 84,
      "quizStats": {
        "passRate": 87,
        "averageScore": 82
      }
    }
  `
};

// 8. Database schema examples (for reference)
export const databaseSchema = {
  projects: `
    CREATE TABLE projects (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      category ENUM('meme', 'gaming', 'nfts', 'defi', 'infrastructure', 'social'),
      status ENUM('active', 'upcoming', 'completed', 'paused') DEFAULT 'active',
      description TEXT,
      long_description TEXT,
      metadata JSON,
      requirements JSON,
      difficulty ENUM('beginner', 'intermediate', 'advanced', 'expert'),
      estimated_duration INT,
      points_system JSON,
      featured BOOLEAN DEFAULT FALSE,
      priority INT DEFAULT 999,
      partner_info JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `,

  learning_modules: `
    CREATE TABLE learning_modules (
      id VARCHAR(255) PRIMARY KEY,
      project_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      content LONGTEXT,
      type ENUM('article', 'video', 'interactive', 'tutorial'),
      \`order\` INT NOT NULL,
      estimated_time INT,
      difficulty ENUM('beginner', 'intermediate', 'advanced', 'expert'),
      is_required BOOLEAN DEFAULT TRUE,
      resources JSON,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `,

  quizzes: `
    CREATE TABLE quizzes (
      id VARCHAR(255) PRIMARY KEY,
      project_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      questions JSON,
      passing_score INT,
      max_attempts INT,
      time_limit INT,
      points JSON,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `,

  user_progress: `
    CREATE TABLE user_progress (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      project_id VARCHAR(255) NOT NULL,
      status ENUM('not_started', 'in_progress', 'completed', 'certified'),
      started_at TIMESTAMP,
      completed_at TIMESTAMP,
      last_activity_at TIMESTAMP,
      time_spent INT DEFAULT 0,
      modules_completed JSON,
      current_module VARCHAR(255),
      quiz_attempts INT DEFAULT 0,
      quiz_score INT,
      quiz_passed BOOLEAN DEFAULT FALSE,
      points_earned INT DEFAULT 0,
      achievements JSON,
      certificate JSON,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `
};

// 9. Configuration management
export const configurationExamples = {
  // Environment variables
  env: `
    # Project Management Configuration
    PROJECT_TEMPLATES_PATH=./config/project-templates.json
    DEFAULT_PROJECT_DIFFICULTY=beginner
    MAX_MODULES_PER_PROJECT=10
    MAX_QUESTIONS_PER_QUIZ=50
    
    # Points System
    BASE_MODULE_POINTS=50
    BASE_QUIZ_POINTS=100
    STREAK_MULTIPLIER=0.1
    
    # Partner Integration
    ENABLE_PARTNER_BRANDING=true
    MAX_PARTNERS_PER_PROJECT=5
    PARTNER_API_TIMEOUT=30000
  `,

  // Configuration file
  config: `
    {
      "projectManagement": {
        "autoValidation": true,
        "requirePartnerApproval": false,
        "maxProjectsPerCategory": 100,
        "defaultTemplate": "meme"
      },
      "pointsSystem": {
        "enabled": true,
        "multipliers": {
          "difficulty": {
            "beginner": 1.0,
            "intermediate": 1.25,
            "advanced": 1.5,
            "expert": 2.0
          },
          "streak": {
            "7": 1.05,
            "30": 1.1
          },
          "speed": 1.1
        }
      },
      "partnerships": {
        "enabled": true,
        "requireVerification": true,
        "customRewards": true,
        "analyticsAccess": false
      }
    }
  `
};

// 10. Usage examples for frontend integration
export const frontendUsage = {
  // React component example
  reactComponent: `
    import { useState, useEffect } from 'react';
    import { ProjectManager } from '../lib/projectManager';
    import { Project, ProjectCategory } from '../types/blockchain-projects';

    export function ProjectGallery() {
      const [projects, setProjects] = useState<Project[]>([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const manager = ProjectManager.getInstance();
        const allProjects = manager.getFeaturedProjects();
        setProjects(allProjects);
        setLoading(false);
      }, []);

      if (loading) return <div>Loading...</div>;

      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="border rounded-lg p-4">
              <img src={project.metadata.logo} alt={project.name} className="w-16 h-16" />
              <h3 className="text-lg font-bold">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {project.category}
                </span>
                <span className="text-sm text-gray-500">
                  {project.estimatedDuration} min
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }
  `,

  // API service example
  apiService: `
    import axios from 'axios';

    class ProjectService {
      private baseURL = '/api/projects';

      async getProjects(category?: ProjectCategory) {
        const params = category ? { category } : {};
        const response = await axios.get(this.baseURL, { params });
        return response.data;
      }

      async getProject(id: string) {
        const response = await axios.get(\`\${this.baseURL}/\${id}\`);
        return response.data;
      }

      async createProject(category: ProjectCategory, projectData: Partial<Project>) {
        const response = await axios.post(this.baseURL, {
          category,
          projectData
        });
        return response.data;
      }

      async updateProject(id: string, updates: Partial<Project>) {
        const response = await axios.put(\`\${this.baseURL}/\${id}\`, updates);
        return response.data;
      }

      async getProjectAnalytics(id: string, period: string = '30d') {
        const response = await axios.get(\`\${this.baseURL}/\${id}/analytics\`, {
          params: { period }
        });
        return response.data;
      }
    }

    export const projectService = new ProjectService();
  `
};