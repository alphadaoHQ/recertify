import {
  Project,
  ProjectCategory,
  DifficultyLevel,
  ProjectStatus,
  Quiz,
  LearningModule,
  SocialProof,
  ProjectAnalytics,
  PointsSystem,
  Reward,
  ProjectMetadata,
  ProjectRequirements,
  QuizQuestion,
  UserProjectProgress
} from '../types/blockchain-projects';

// Dogs Project Data
export const dogsProject: Project = {
  id: 'dogs-ton',
  name: 'Dogs',
  slug: 'dogs',
  category: ProjectCategory.MEME,
  status: ProjectStatus.ACTIVE,
  description: 'The most popular meme coin on TON blockchain featuring adorable dogs and community-driven development.',
  longDescription: 'Dogs is a community-driven meme token on The Open Network (TON) that combines the power of meme culture with serious blockchain technology. Built with love for dog lovers everywhere, Dogs aims to create the most engaging and fun cryptocurrency community on TON.',
  metadata: {
    logo: '/projects/dogs/logo.png',
    banner: '/projects/dogs/banner.jpg',
    website: 'https://dogs.ton',
    whitepaper: 'https://docs.dogs.ton/whitepaper',
    documentation: 'https://docs.dogs.ton',
    socialLinks: {
      twitter: 'https://twitter.com/DogsTON',
      telegram: 'https://t.me/DogsTON',
      discord: 'https://discord.gg/dogs'
    },
    tags: ['meme', 'community', 'ton', 'dogs', 'fun'],
    partnerships: ['TON Foundation', 'Tonkeeper']
  },
  requirements: {
    minLevel: 1,
    prerequisites: [],
    timeEstimate: {
      reading: 15,
      quiz: 10,
      total: 25
    },
    resources: {
      articles: [
        'https://blog.ton.org/what-is-dogs',
        'https://medium.com/dogs-ton/getting-started'
      ],
      videos: [
        'https://youtube.com/watch?v=dogs-intro'
      ],
      tools: [
        'Tonkeeper Wallet',
        'TON Explorer'
      ]
    }
  },
  difficulty: DifficultyLevel.BEGINNER,
  estimatedDuration: 25,
  modules: [
    {
      id: 'dogs-intro',
      projectId: 'dogs-ton',
      title: 'Introduction to Dogs',
      description: 'Learn what Dogs token is and its mission on TON blockchain',
      content: `# Welcome to Dogs! 🐕

Dogs is more than just another meme token - it's a community-driven movement on The Open Network (TON). 

## What Makes Dogs Special?

- **Community First**: Every decision is made with our community in mind
- **Fun & Engaging**: We believe crypto should be enjoyable
- **TON Native**: Built specifically for The Open Network ecosystem
- **Dog Lovers Unite**: A portion of fees goes to dog charities

## Key Features

- Zero-fee transactions within the Dogs ecosystem
- Community governance through DOGS voting
- Staking rewards for long-term holders
- NFT collections featuring rare dog breeds

## Getting Started

1. Get a TON wallet (we recommend Tonkeeper)
2. Join our Telegram community
3. Acquire some DOGS tokens
4. Participate in community events and voting

Ready to learn more? Let's dive deeper into the technical aspects!`,
      type: 'article',
      order: 1,
      estimatedTime: 10,
      difficulty: DifficultyLevel.BEGINNER,
      isRequired: true,
      resources: {
        links: ['https://dogs.ton/get-started'],
        downloads: [],
        references: ['TON Blockchain Documentation']
      }
    },
    {
      id: 'dogs-technical',
      projectId: 'dogs-ton',
      title: 'Technical Overview',
      description: 'Understanding the technical architecture of Dogs token',
      content: `# Dogs Technical Architecture 🛠️

## Tokenomics

- **Total Supply**: 1,000,000,000,000 DOGS
- **Circulating Supply**: 500,000,000,000 DOGS
- **Burn Rate**: 0.1% per transaction (auto-burn)
- **Staking APY**: Up to 15% annually

## Smart Contract Features

\`\`\`typescript
// Dogs Token Contract Interface
interface DogsToken {
  // Core functions
  transfer(to: address, amount: uint256): void;
  stake(amount: uint256, duration: uint256): void;
  vote(proposalId: uint256, support: boolean): void;
  
  // View functions
  balanceOf(account: address): uint256;
  stakedBalance(account: address): uint256;
  votingPower(account: address): uint256;
}
\`\`\`

## Security Measures

- Regular audits by CertiK and PeckShield
- Multi-signature wallet for treasury
- Time-locked contracts for major changes
- Community-driven security bounty program

## Integration Points

- **DEX Integration**: Listed on Ston.fi and Dedust
- **Wallet Support**: Tonkeeper, OpenMask, MyTonWallet
- **DeFi Protocols**: Lending and borrowing platforms
- **Gaming**: Integration with TON-based games`,
      type: 'article',
      order: 2,
      estimatedTime: 15,
      difficulty: DifficultyLevel.INTERMEDIATE,
      isRequired: false,
      resources: {
        links: ['https://github.com/dogs-ton/contracts'],
        downloads: ['https://github.com/dogs-ton/audits'],
        references: ['TON Smart Contract Documentation']
      }
    }
  ],
  quiz: {
    id: 'dogs-quiz',
    projectId: 'dogs-ton',
    title: 'Dogs Token Mastery Quiz',
    description: 'Test your knowledge about Dogs token and its ecosystem',
    questions: [
      {
        id: 'dogs-q1',
        question: 'What is the total supply of Dogs tokens?',
        options: [
          '100 billion DOGS',
          '1 trillion DOGS',
          '10 billion DOGS',
          '100 trillion DOGS'
        ],
        correctAnswer: 1,
        explanation: 'Dogs has a total supply of 1 trillion tokens, with half currently in circulation.',
        points: 10,
        difficulty: DifficultyLevel.BEGINNER
      },
      {
        id: 'dogs-q2',
        question: 'Which blockchain is Dogs built on?',
        options: [
          'Ethereum',
          'Binance Smart Chain',
          'The Open Network (TON)',
          'Solana'
        ],
        correctAnswer: 2,
        explanation: 'Dogs is a native TON blockchain token, taking advantage of TON\'s speed and low fees.',
        points: 10,
        difficulty: DifficultyLevel.BEGINNER
      },
      {
        id: 'dogs-q3',
        question: 'What percentage of each transaction is automatically burned?',
        options: [
          '0.01%',
          '0.1%',
          '1%',
          '10%'
        ],
        correctAnswer: 1,
        explanation: '0.1% of every transaction is automatically burned, creating deflationary pressure.',
        points: 15,
        difficulty: DifficultyLevel.INTERMEDIATE
      },
      {
        id: 'dogs-q4',
        question: 'Which of these is NOT a feature of Dogs token?',
        options: [
          'Community governance',
          'Staking rewards',
          'Zero-fee transactions',
          'Privacy transactions'
        ],
        correctAnswer: 3,
        explanation: 'Dogs focuses on transparency and community, not privacy features like anonymous transactions.',
        points: 15,
        difficulty: DifficultyLevel.INTERMEDIATE
      },
      {
        id: 'dogs-q5',
        question: 'What is the maximum staking APY for Dogs tokens?',
        options: [
          '5%',
          '10%',
          '15%',
          '25%'
        ],
        correctAnswer: 2,
        explanation: 'Dogs offers up to 15% APY for long-term stakers, with rates varying based on lock-up duration.',
        points: 20,
        difficulty: DifficultyLevel.ADVANCED
      }
    ],
    passingScore: 70,
    maxAttempts: 3,
    timeLimit: 15,
    points: {
      total: 70,
      perQuestion: 14,
      bonus: 10
    }
  },
  socialProof: {
    projectId: 'dogs-ton',
    totalUsers: 45000,
    activeUsers: 12000,
    completionRate: 78.5,
    averageRating: 4.6,
    totalReviews: 234,
    testimonials: [
      {
        userId: 'user123',
        username: 'CryptoDogLover',
        avatar: '/avatars/user123.jpg',
        rating: 5,
        comment: 'Great introduction to Dogs! The community is amazing and the token has real potential.',
        timestamp: new Date('2024-01-15'),
        verified: true
      },
      {
        userId: 'user456',
        username: 'TONEnthusiast',
        avatar: '/avatars/user456.jpg',
        rating: 4,
        comment: 'Good content, but would like more advanced technical details.',
        timestamp: new Date('2024-01-10'),
        verified: true
      }
    ],
    communityMetrics: {
      telegramMembers: 25000,
      twitterFollowers: 15000,
      discordMembers: 8000
    }
  },
  analytics: {
    projectId: 'dogs-ton',
    views: 125000,
    uniqueViews: 85000,
    enrollments: 45000,
    completions: 35325,
    averageCompletionTime: 28,
    dropOffPoints: [1, 3],
    popularModules: ['dogs-intro', 'dogs-technical'],
    quizStats: {
      attempts: 67000,
      passRate: 82.3,
      averageScore: 78.5
    },
    engagementMetrics: {
      timeSpent: 35,
      interactionRate: 0.85,
      shareRate: 0.12
    }
  },
  pointsSystem: {
    projectId: 'dogs-ton',
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
      perfect_score: {
        points: 50,
        multiplier: 2.0,
        description: 'Get 100% on quiz'
      },
      shared_project: {
        points: 25,
        maxDaily: 100,
        description: 'Share project with friends'
      },
      daily_login: {
        points: 10,
        maxDaily: 10,
        description: 'Login and check project daily'
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
        title: 'Puppy',
        requiredPoints: 0,
        rewards: ['basic-badge']
      },
      2: {
        title: 'Good Boy',
        requiredPoints: 100,
        rewards: ['bronze-badge']
      },
      3: {
        title: 'Alpha Dog',
        requiredPoints: 500,
        rewards: ['silver-badge', 'dogs-nft']
      }
    }
  },
  rewards: [
    {
      id: 'dogs-basic',
      type: 'badge',
      title: 'Dogs Enthusiast',
      description: 'Completed the Dogs learning module',
      icon: '/badges/dogs-basic.svg',
      value: 50,
      rarity: 'common',
      requirements: {
        projectId: 'dogs-ton',
        action: 'module_completed',
        threshold: 1
      }
    },
    {
      id: 'dogs-master',
      type: 'certificate',
      title: 'Dogs Certified',
      description: 'Mastered Dogs token concepts',
      icon: '/certificates/dogs-master.svg',
      value: 200,
      rarity: 'rare',
      requirements: {
        projectId: 'dogs-ton',
        action: 'quiz_passed',
        threshold: 1
      }
    }
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-20'),
  featured: true,
  priority: 1,
  partnerInfo: {
    partnerName: 'Dogs Foundation',
    partnerLogo: '/partners/dogs-foundation.png',
    partnershipType: 'official',
    benefits: ['Exclusive content', 'Direct support', 'Early access to features']
  }
};

// Notcoin Project Data
export const notcoinProject: Project = {
  id: 'notcoin',
  name: 'Notcoin',
  slug: 'notcoin',
  category: ProjectCategory.GAMING,
  status: ProjectStatus.ACTIVE,
  description: 'The viral Telegram-based clicker game that evolved into a serious gaming ecosystem on TON.',
  longDescription: 'Notcoin started as a simple Telegram clicker game and exploded into one of the largest gaming communities on The Open Network. With millions of players and a sophisticated gaming ecosystem, Notcoin represents the future of blockchain gaming.',
  metadata: {
    logo: '/projects/notcoin/logo.png',
    banner: '/projects/notcoin/banner.jpg',
    website: 'https://notcoin.app',
    documentation: 'https://docs.notcoin.app',
    socialLinks: {
      twitter: 'https://twitter.com/Notcoin',
      telegram: 'https://t.me/notcoin',
      discord: 'https://discord.gg/notcoin'
    },
    tags: ['gaming', 'clicker', 'telegram', 'ton', 'viral'],
    partnerships: ['Telegram', 'TON Foundation', 'Open Builders']
  },
  requirements: {
    minLevel: 1,
    prerequisites: [],
    timeEstimate: {
      reading: 20,
      quiz: 15,
      total: 35
    },
    resources: {
      articles: [
        'https://blog.notcoin.app/introduction',
        'https://medium.com/notcoin/game-mechanics'
      ],
      videos: [
        'https://youtube.com/watch?v=notcoin-gameplay'
      ],
      tools: [
        'Telegram App',
        'Notcoin Bot',
        'TON Wallet'
      ]
    }
  },
  difficulty: DifficultyLevel.BEGINNER,
  estimatedDuration: 35,
  modules: [
    {
      id: 'notcoin-intro',
      projectId: 'notcoin',
      title: 'Introduction to Notcoin',
      description: 'Discover the phenomenon that took Telegram by storm',
      content: `# Welcome to Notcoin! 🎮

Notcoin isn\'t just a game - it\'s a cultural phenomenon that introduced millions to blockchain gaming through the familiar interface of Telegram.

## The Notcoin Story

What started as a simple experiment in viral game mechanics became one of the most successful blockchain games ever created. With over 30 million players at its peak, Notcoin proved that blockchain gaming could achieve mainstream adoption.

## Game Mechanics

- **Click to Earn**: Tap the coin to accumulate NOT tokens
- **League System**: Progress through different leagues based on your mining speed
- **Boosts**: Use various power-ups to increase your earnings
- **Referral System**: Invite friends and earn bonuses
- **Daily Tasks**: Complete challenges for extra rewards

## Why Notcoin Matters

- **Onboarding Gateway**: First crypto experience for millions
- **Social Gaming**: Combines social media with gaming
- **Low Barrier**: No complex setup required
- **Real Value**: In-game earnings have real-world value

## The Evolution

Notcoin has evolved from a simple clicker to a comprehensive gaming ecosystem including:
- Tournament systems
- Guild mechanics  
- NFT collectibles
- Play-to-earn mechanics
- Cross-game integrations`,
      type: 'article',
      order: 1,
      estimatedTime: 15,
      difficulty: DifficultyLevel.BEGINNER,
      isRequired: true,
      resources: {
        links: ['https://notcoin.app/get-started'],
        downloads: [],
        references: ['Telegram Gaming Documentation']
      }
    },
    {
      id: 'notcoin-advanced',
      projectId: 'notcoin',
      title: 'Advanced Gaming Strategies',
      description: 'Master the art of Notcoin with pro strategies',
      content: `# Advanced Notcoin Strategies 🏆

Ready to take your Notcoin game to the next level? Here are the strategies used by top players.

## Optimization Techniques

### 1. Boost Management
- Save multi-tap boosts for league transitions
- Use energy boosts during active gaming sessions
- Combine boosts for maximum effect

### 2. League Timing
- Plan your league promotions carefully
- Maximize earnings before each promotion
- Understand the reset mechanics

### 3. Referral Strategy
- Focus on quality over quantity
- Help your referrals stay active
- Build a sustainable downline

## Economic Analysis

### Token Economics
\`\`\`typescript
interface NotcoinEconomics {
  totalSupply: "100B NOT";
  dailyEmission: "0.5% of remaining supply";
  burnRate: "10% of transaction fees";
  stakingRewards: "Up to 20% APY";
}
\`\`\`

### Earning Calculations
- Base mining: 1 NOT per tap
- League multipliers: 1x to 100x
- Boost multipliers: Up to 10x
- Referral bonuses: 5% of referral earnings

## Competitive Gaming

### Tournament Preparation
- Practice consistently
- Study top player strategies
- Optimize your boost usage
- Join competitive communities

### Guild Dynamics
- Choose active guilds
- Contribute to guild goals
- Participate in guild events
- Leverage guild bonuses

## Future Developments

Notcoin continues to evolve with:
- New game modes
- Cross-chain compatibility
- Advanced tournament systems
- Professional gaming circuits`,
      type: 'article',
      order: 2,
      estimatedTime: 20,
      difficulty: DifficultyLevel.INTERMEDIATE,
      isRequired: false,
      resources: {
        links: ['https://docs.notcoin.app/strategies'],
        downloads: ['https://notcoin.app/calculator'],
        references: ['Game Theory Documentation']
      }
    }
  ],
  quiz: {
    id: 'notcoin-quiz',
    projectId: 'notcoin',
    title: 'Notcoin Gaming Expert Quiz',
    description: 'Test your knowledge of Notcoin gaming mechanics and strategies',
    questions: [
      {
        id: 'notcoin-q1',
        question: 'What was the peak number of Notcoin players?',
        options: [
          '10 million',
          '30 million',
          '50 million',
          '100 million'
        ],
        correctAnswer: 1,
        explanation: 'Notcoin reached over 30 million players at its peak, making it one of the most successful blockchain games.',
        points: 10,
        difficulty: DifficultyLevel.BEGINNER
      },
      {
        id: 'notcoin-q2',
        question: 'Which platform is Notcoin primarily built on?',
        options: [
          'Discord',
          'WhatsApp',
          'Telegram',
          'Facebook'
        ],
        correctAnswer: 2,
        explanation: 'Notcoin is built entirely on Telegram, leveraging its massive user base and bot capabilities.',
        points: 10,
        difficulty: DifficultyLevel.BEGINNER
      },
      {
        id: 'notcoin-q3',
        question: 'What is the maximum boost multiplier in Notcoin?',
        options: [
          '5x',
          '10x',
          '25x',
          '50x'
        ],
        correctAnswer: 1,
        explanation: 'The maximum boost multiplier is 10x, which can be combined with other bonuses for even greater effects.',
        points: 15,
        difficulty: DifficultyLevel.INTERMEDIATE
      },
      {
        id: 'notcoin-q4',
        question: 'How much of referral earnings do you receive as a bonus?',
        options: [
          '1%',
          '5%',
          '10%',
          '25%'
        ],
        correctAnswer: 1,
        explanation: 'You receive 5% of your referrals\' earnings as a bonus, making referrals an important strategy.',
        points: 15,
        difficulty: DifficultyLevel.INTERMEDIATE
      },
      {
        id: 'notcoin-q5',
        question: 'What is the daily emission rate of NOT tokens?',
        options: [
          '0.1% of remaining supply',
          '0.5% of remaining supply',
          '1% of remaining supply',
          '2% of remaining supply'
        ],
        correctAnswer: 1,
        explanation: 'Notcoin emits 0.5% of the remaining token supply daily, creating a controlled inflation model.',
        points: 20,
        difficulty: DifficultyLevel.ADVANCED
      }
    ],
    passingScore: 70,
    maxAttempts: 3,
    timeLimit: 20,
    points: {
      total: 70,
      perQuestion: 14,
      bonus: 10
    }
  },
  socialProof: {
    projectId: 'notcoin',
    totalUsers: 125000,
    activeUsers: 35000,
    completionRate: 82.3,
    averageRating: 4.8,
    totalReviews: 567,
    testimonials: [
      {
        userId: 'user789',
        username: 'GameMaster',
        avatar: '/avatars/user789.jpg',
        rating: 5,
        comment: 'Amazing game! The strategies section really helped me improve my earnings.',
        timestamp: new Date('2024-01-18'),
        verified: true
      }
    ],
    communityMetrics: {
      telegramMembers: 5000000,
      twitterFollowers: 250000,
      discordMembers: 100000
    }
  },
  analytics: {
    projectId: 'notcoin',
    views: 450000,
    uniqueViews: 320000,
    enrollments: 125000,
    completions: 102875,
    averageCompletionTime: 38,
    dropOffPoints: [1],
    popularModules: ['notcoin-intro', 'notcoin-advanced'],
    quizStats: {
      attempts: 180000,
      passRate: 85.7,
      averageScore: 82.3
    },
    engagementMetrics: {
      timeSpent: 45,
      interactionRate: 0.92,
      shareRate: 0.25
    }
  },
  pointsSystem: {
    projectId: 'notcoin',
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
      },
      tournament_won: {
        points: 500,
        multiplier: 2.0,
        description: 'Win a Notcoin tournament'
      },
      guild_contribution: {
        points: 100,
        maxDaily: 300,
        description: 'Contribute to guild goals'
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
        rewards: ['pro-gamer-badge', 'notcoin-skin']
      },
      3: {
        title: 'Notcoin Master',
        requiredPoints: 2000,
        rewards: ['master-gamer-badge', 'exclusive-nft']
      }
    }
  },
  rewards: [
    {
      id: 'notcoin-gamer',
      type: 'badge',
      title: 'Notcoin Gamer',
      description: 'Completed Notcoin learning modules',
      icon: '/badges/notcoin-gamer.svg',
      value: 75,
      rarity: 'common',
      requirements: {
        projectId: 'notcoin',
        action: 'module_completed',
        threshold: 1
      }
    },
    {
      id: 'notcoin-champion',
      type: 'nft',
      title: 'Notcoin Champion NFT',
      description: 'Exclusive NFT for top performers',
      icon: '/nfts/notcoin-champion.png',
      value: 500,
      rarity: 'epic',
      requirements: {
        projectId: 'notcoin',
        action: 'quiz_passed',
        threshold: 1
      }
    }
  ],
  createdAt: new Date('2024-01-05'),
  updatedAt: new Date('2024-01-20'),
  featured: true,
  priority: 2,
  partnerInfo: {
    partnerName: 'Notcoin Team',
    partnerLogo: '/partners/notcoin.png',
    partnershipType: 'official',
    benefits: ['Gaming insights', 'Tournament access', 'Exclusive content']
  }
};

// Magic Eden Project Data
export const magicEdenProject: Project = {
  id: 'magic-eden',
  name: 'Magic Eden',
  slug: 'magic-eden',
  category: ProjectCategory.NFTS,
  status: ProjectStatus.ACTIVE,
  description: 'Leading NFT marketplace expanding to TON blockchain with comprehensive trading tools.',
  longDescription: 'Magic Eden is the premier NFT marketplace that\'s now expanding to The Open Network (TON). With industry-leading trading tools, deep liquidity, and a user-friendly interface, Magic Eden is bringing professional NFT trading to the TON ecosystem.',
  metadata: {
    logo: '/projects/magic-eden/logo.png',
    banner: '/projects/magic-eden/banner.jpg',
    website: 'https://magiceden.io',
    documentation: 'https://docs.magiceden.io',
    socialLinks: {
      twitter: 'https://twitter.com/MagicEden',
      discord: 'https://discord.gg/magiceden',
      github: 'https://github.com/magiceden'
    },
    tags: ['nft', 'marketplace', 'trading', 'ton', 'defi'],
    partnerships: ['TON Foundation', 'Solana Foundation', 'OpenSea']
  },
  requirements: {
    minLevel: 2,
    prerequisites: ['basic-nft-knowledge'],
    timeEstimate: {
      reading: 25,
      quiz: 20,
      total: 45
    },
    resources: {
      articles: [
        'https://blog.magiceden.io/ton-expansion',
        'https://docs.magiceden.io/trading-guide'
      ],
      videos: [
        'https://youtube.com/watch?v=magic-eden-ton'
      ],
      tools: [
        'Magic Eden Platform',
        'TON Wallet',
        'NFT Analytics Tools'
      ]
    }
  },
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedDuration: 45,
  modules: [
    {
      id: 'magic-eden-intro',
      projectId: 'magic-eden',
      title: 'Magic Eden on TON',
      description: 'Understanding the leading NFT marketplace\'s TON expansion',
      content: `# Welcome to Magic Eden on TON! 🎨

Magic Eden, the leading NFT marketplace across multiple blockchains, has expanded to The Open Network (TON), bringing professional-grade NFT trading tools to the ecosystem.

## About Magic Eden

Founded in 2021, Magic Eden has become the go-to platform for NFT trading, featuring:
- **Multi-chain Support**: Solana, Ethereum, Polygon, and now TON
- **Advanced Trading Tools**: Professional analytics and insights
- **Deep Liquidity**: High volume and active trading
- **User-Friendly Interface**: Intuitive design for all experience levels

## Why TON Expansion?

The TON blockchain offers unique advantages for NFTs:
- **Low Fees**: Minimal transaction costs
- **High Speed**: Fast confirmations
- **Large User Base**: Integration with Telegram
- **Growing Ecosystem**: Rapidly expanding dApp landscape

## Key Features on TON

### 1. NFT Marketplace
- Browse and discover TON NFT collections
- Advanced filtering and search capabilities
- Real-time price charts and analytics
- Bulk trading tools

### 2. Launchpad
- New NFT project launches
- Fair distribution mechanisms
- Community voting and curation
- Early access opportunities

### 3. Analytics Dashboard
- Collection performance metrics
- Floor price tracking
- Volume and sales analytics
- Market sentiment indicators

### 4. Creator Tools
- No-code NFT creation
- Royalty management
- Marketing and promotion tools
- Community building features

## Getting Started

1. **Set up TON Wallet**: Connect your Tonkeeper or other TON wallet
2. **Fund Your Wallet**: Add TON for transaction fees
3. **Explore Collections**: Browse available NFT collections
4. **Make Your First Trade**: Buy or sell NFTs with confidence

## Trading Strategies

### For Beginners
- Start with established collections
- Use dollar-cost averaging
- Set price alerts
- Learn basic chart reading

### For Advanced Traders
- Technical analysis
- Floor price sweeps
- Sniping opportunities
- Cross-market arbitrage`,
      type: 'article',
      order: 1,
      estimatedTime: 20,
      difficulty: DifficultyLevel.INTERMEDIATE,
      isRequired: true,
      resources: {
        links: ['https://magiceden.io/ton'],
        downloads: ['https://docs.magiceden.io/api'],
        references: ['NFT Trading Documentation']
      }
    },
    {
      id: 'magic-eden-advanced',
      projectId: 'magic-eden',
      title: 'Advanced NFT Trading',
      description: 'Professional trading strategies and tools',
      content: `# Advanced NFT Trading with Magic Eden 📊

Ready to level up your NFT trading game? This module covers professional strategies and tools used by successful traders.

## Market Analysis Techniques

### 1. Fundamental Analysis
- **Project Team**: Background and experience
- **Community Engagement**: Social media metrics and activity
- **Utility**: Real-world use cases and integration
- **Scarcity**: Total supply and distribution

### 2. Technical Analysis
\`\`\`typescript
interface NFTMetrics {
  floorPrice: number;
  volume24h: number;
  marketCap: number;
  holders: number;
  sales24h: number;
  averagePrice: number;
}
\`\`\`

#### Key Indicators
- **Floor Price**: Lowest price for NFT in collection
- **Volume**: Trading volume over time periods
- **Sales Count**: Number of transactions
- **Unique Holders**: Wallet diversity metric
- **Market Cap**: Floor price × total supply

### 3. Sentiment Analysis
- Social media monitoring
- Community discussion analysis
- Influencer activity tracking
- News and announcement impact

## Trading Strategies

### 1. Floor Sweeping
- Buy multiple NFTs at floor price
- Goal: Reduce floor price and create buying pressure
- Risk: High capital requirement
- Reward: Potential for quick profits

### 2. Sniping
- Purchase underpriced listings
- Requires fast execution and monitoring
- Tools: Bots and alerts
- Risk: Competition and gas wars

### 3. Long-term Holding
- Invest in quality projects
- Dollar-cost average approach
- Focus on fundamentals
- Risk: Market volatility

### 4. Flipping
- Buy low, sell high quick trades
- Market timing crucial
- Requires active monitoring
- Risk: Missed opportunities

## Risk Management

### Portfolio Diversification
- Spread across multiple collections
- Different risk levels
- Various blockchain ecosystems
- Balance blue-chips and experimental projects

### Position Sizing
- Never risk more than you can afford
- Use stop-loss orders when available
- Take profits incrementally
- Keep emergency fund separate

### Market Cycles
- Recognize bull and bear markets
- Adjust strategy accordingly
- Don\'t fight the trend
- Stay patient during downturns

## Tools and Resources

### Analytics Platforms
- Magic Eden Analytics
- DappRadar
- NFTGo
- CryptoSlam

### Trading Tools
- TradingView for charting
- Discord/Twitter for alpha
- Telegram groups for signals
- Custom bots for automation

### Portfolio Management
- NFT portfolio trackers
- Spreadsheet templates
- DeFi dashboard integration
- Tax reporting tools

## Professional Tips

### 1. Information Advantage
- Join alpha groups
- Follow key influencers
- Monitor developer activity
- Track whale movements

### 2. Execution Excellence
- Use limit orders
- Time transactions carefully
- Consider gas fees
- Have exit strategies

### 3. Psychology Management
- Control FOMO and FUD
- Stick to your strategy
- Learn from mistakes
- Stay disciplined

## Future Trends

### Emerging Opportunities
- Cross-chain NFTs
- Dynamic NFTs
- Gaming NFTs
- Real-world asset tokenization

### Technology Developments
- Layer 2 scaling solutions
- Improved marketplace features
- Enhanced analytics tools
- Better user experiences`,
      type: 'article',
      order: 2,
      estimatedTime: 25,
      difficulty: DifficultyLevel.ADVANCED,
      isRequired: false,
      resources: {
        links: ['https://docs.magiceden.io/advanced'],
        downloads: ['https://github.com/magiceden/tools'],
        references: ['DeFi Documentation', 'Trading Psychology Resources']
      }
    }
  ],
  quiz: {
    id: 'magic-eden-quiz',
    projectId: 'magic-eden',
    title: 'Magic Eden NFT Trading Expert Quiz',
    description: 'Test your knowledge of NFT trading and Magic Eden platform',
    questions: [
      {
        id: 'magic-eden-q1',
        question: 'When was Magic Eden founded?',
        options: [
          '2020',
          '2021',
          '2022',
          '2023'
        ],
        correctAnswer: 1,
        explanation: 'Magic Eden was founded in 2021 and quickly became the leading NFT marketplace on Solana before expanding to other chains.',
        points: 10,
        difficulty: DifficultyLevel.BEGINNER
      },
      {
        id: 'magic-eden-q2',
        question: 'Which of these blockchains does Magic Eden NOT support?',
        options: [
          'Solana',
          'Ethereum',
          'Bitcoin',
          'TON'
        ],
        correctAnswer: 2,
        explanation: 'Magic Eden supports Solana, Ethereum, Polygon, and TON, but does not currently support Bitcoin NFTs.',
        points: 10,
        difficulty: DifficultyLevel.BEGINNER
      },
      {
        id: 'magic-eden-q3',
        question: 'What is the most important metric for evaluating NFT collection health?',
        options: [
          'Twitter followers',
          'Discord members',
          'Unique holders ratio',
          'Website traffic'
        ],
        correctAnswer: 2,
        explanation: 'The unique holders ratio (unique holders / total supply) is crucial for understanding distribution and decentralization.',
        points: 15,
        difficulty: DifficultyLevel.INTERMEDIATE
      },
      {
        id: 'magic-eden-q4',
        question: 'What does "floor sweeping" mean in NFT trading?',
        options: [
          'Cleaning the marketplace',
          'Buying multiple NFTs at floor price',
          'Selling at the lowest price',
          'Removing listings'
        ],
        correctAnswer: 1,
        explanation: 'Floor sweeping involves purchasing multiple NFTs at the current floor price, often to create buying pressure.',
        points: 15,
        difficulty: DifficultyLevel.INTERMEDIATE
      },
      {
        id: 'magic-eden-q5',
        question: 'What is the recommended maximum portfolio allocation to a single NFT collection?',
        options: [
          '5%',
          '10%',
          '25%',
          '50%'
        ],
        correctAnswer: 1,
        explanation: 'Professional traders recommend allocating no more than 5-10% to a single collection to manage risk effectively.',
        points: 20,
        difficulty: DifficultyLevel.ADVANCED
      }
    ],
    passingScore: 75,
    maxAttempts: 3,
    timeLimit: 25,
    points: {
      total: 70,
      perQuestion: 14,
      bonus: 15
    }
  },
  socialProof: {
    projectId: 'magic-eden',
    totalUsers: 35000,
    activeUsers: 8000,
    completionRate: 71.2,
    averageRating: 4.7,
    totalReviews: 189,
    testimonials: [
      {
        userId: 'user101',
        username: 'NFTTrader',
        avatar: '/avatars/user101.jpg',
        rating: 5,
        comment: 'Comprehensive guide to NFT trading! The advanced strategies section is invaluable.',
        timestamp: new Date('2024-01-19'),
        verified: true
      }
    ],
    communityMetrics: {
      twitterFollowers: 500000,
      discordMembers: 200000,
      telegramMembers: 50000
    }
  },
  analytics: {
    projectId: 'magic-eden',
    views: 280000,
    uniqueViews: 195000,
    enrollments: 35000,
    completions: 24920,
    averageCompletionTime: 48,
    dropOffPoints: [1, 2],
    popularModules: ['magic-eden-intro', 'magic-eden-advanced'],
    quizStats: {
      attempts: 52000,
      passRate: 78.9,
      averageScore: 76.4
    },
    engagementMetrics: {
      timeSpent: 55,
      interactionRate: 0.78,
      shareRate: 0.18
    }
  },
  pointsSystem: {
    projectId: 'magic-eden',
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
      },
      first_trade: {
        points: 150,
        multiplier: 2.0,
        description: 'Complete first NFT trade'
      },
      volume_milestone: {
        points: 300,
        multiplier: 1.5,
        description: 'Reach trading volume milestones'
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
        rewards: ['trader-badge', 'reduced-fees']
      },
      3: {
        title: 'NFT Expert',
        requiredPoints: 5000,
        rewards: ['expert-badge', 'exclusive-access']
      }
    }
  },
  rewards: [
    {
      id: 'magic-eden-trader',
      type: 'badge',
      title: 'Magic Eden Trader',
      description: 'Completed Magic Eden trading course',
      icon: '/badges/magic-eden-trader.svg',
      value: 100,
      rarity: 'rare',
      requirements: {
        projectId: 'magic-eden',
        action: 'module_completed',
        threshold: 1
      }
    },
    {
      id: 'magic-eden-expert',
      type: 'certificate',
      title: 'NFT Trading Expert',
      description: 'Certified NFT trading professional',
      icon: '/certificates/nft-expert.svg',
      value: 500,
      rarity: 'epic',
      requirements: {
        projectId: 'magic-eden',
        action: 'quiz_passed',
        threshold: 1
      }
    }
  ],
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-20'),
  featured: true,
  priority: 3,
  partnerInfo: {
    partnerName: 'Magic Eden',
    partnerLogo: '/partners/magic-eden.png',
    partnershipType: 'official',
    benefits: ['Trading insights', 'Market data', 'Professional tools']
  }
};

// Export all projects
export const initialProjects: Project[] = [
  dogsProject,
  notcoinProject,
  magicEdenProject
];

// Sample user progress data
export const sampleUserProgress: UserProjectProgress = {
  userId: 'user123',
  projectId: 'dogs-ton',
  status: 'completed',
  startedAt: new Date('2024-01-15'),
  completedAt: new Date('2024-01-16'),
  lastActivityAt: new Date('2024-01-16'),
  timeSpent: 28,
  modulesCompleted: ['dogs-intro', 'dogs-technical'],
  quizAttempts: 1,
  quizScore: 85,
  quizPassed: true,
  pointsEarned: 170,
  achievements: ['dogs-basic', 'dogs-master'],
  certificate: {
    id: 'cert-dogs-123',
    issuedAt: new Date('2024-01-16'),
    verificationCode: 'DOGS-2024-ABC123'
  }
};