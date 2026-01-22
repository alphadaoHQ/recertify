// Enhanced project data for bitdegree.org-inspired learning paths

import { ProjectCard } from '@/types';

export const PROJECTS_DATA: ProjectCard[] = [
  {
    id: 'defi-basics',
    title: 'DeFi Fundamentals',
    description: 'Learn the basics of decentralized finance, from liquidity pools to yield farming strategies.',
    icon: '💰',
    category: 'DeFi',
    difficulty: 'Beginner',
    estimatedTime: '45 min',
    pointsReward: 100,
    progress: 0,
    quizCount: 3,
    learningModules: [
      {
        id: 'defi-intro',
        title: 'Introduction to DeFi',
        description: 'Understanding the DeFi ecosystem',
        duration: 15,
        order: 1,
        isCompleted: false,
        quizId: 'defi-intro-quiz'
      },
      {
        id: 'liquidity-pools',
        title: 'Liquidity Pools',
        description: 'How liquidity pools work',
        duration: 20,
        order: 2,
        isCompleted: false,
        quizId: 'liquidity-quiz'
      },
      {
        id: 'yield-farming',
        title: 'Yield Farming Basics',
        description: 'Introduction to yield farming',
        duration: 10,
        order: 3,
        isCompleted: false,
        quizId: 'yield-quiz'
      }
    ],
    tags: ['DeFi', 'Finance', 'Blockchain'],
    rating: 4.8,
    completedCount: 1250
  },
  {
    id: 'nft-creation',
    title: 'NFT Creation & Trading',
    description: 'Master the art of creating, minting, and trading NFTs on various blockchain platforms.',
    icon: '🎨',
    category: 'NFTs',
    difficulty: 'Intermediate',
    estimatedTime: '60 min',
    pointsReward: 150,
    progress: 0,
    quizCount: 4,
    learningModules: [
      {
        id: 'nft-basics',
        title: 'NFT Fundamentals',
        description: 'Understanding NFTs and their use cases',
        duration: 15,
        order: 1,
        isCompleted: false,
        quizId: 'nft-basics-quiz'
      },
      {
        id: 'smart-contracts',
        title: 'NFT Smart Contracts',
        description: 'ERC-721 and ERC-1155 standards',
        duration: 20,
        order: 2,
        isCompleted: false,
        quizId: 'contracts-quiz'
      },
      {
        id: 'minting',
        title: 'Minting Process',
        description: 'How to mint NFTs',
        duration: 15,
        order: 3,
        isCompleted: false,
        quizId: 'minting-quiz'
      },
      {
        id: 'trading',
        title: 'NFT Trading',
        description: 'Marketplaces and trading strategies',
        duration: 10,
        order: 4,
        isCompleted: false,
        quizId: 'trading-quiz'
      }
    ],
    tags: ['NFT', 'Art', 'Trading', 'Smart Contracts'],
    rating: 4.6,
    completedCount: 890
  },
  {
    id: 'gaming-tokens',
    title: 'Blockchain Gaming Tokens',
    description: 'Explore the intersection of gaming and blockchain with play-to-earn mechanics.',
    icon: '🎮',
    category: 'Gaming',
    difficulty: 'Beginner',
    estimatedTime: '40 min',
    pointsReward: 120,
    progress: 0,
    quizCount: 3,
    learningModules: [
      {
        id: 'gaming-intro',
        title: 'Blockchain Gaming Introduction',
        description: 'Overview of blockchain gaming',
        duration: 15,
        order: 1,
        isCompleted: false,
        quizId: 'gaming-intro-quiz'
      },
      {
        id: 'play-to-earn',
        title: 'Play-to-Earn Mechanics',
        description: 'Understanding P2E models',
        duration: 15,
        order: 2,
        isCompleted: false,
        quizId: 'p2e-quiz'
      },
      {
        id: 'game-tokens',
        title: 'Game Tokens & Economy',
        description: 'Tokenomics in gaming',
        duration: 10,
        order: 3,
        isCompleted: false,
        quizId: 'tokens-quiz'
      }
    ],
    tags: ['Gaming', 'P2E', 'Tokens', 'Metaverse'],
    rating: 4.7,
    completedCount: 1100
  },
  {
    id: 'infrastructure-nodes',
    title: 'Blockchain Infrastructure',
    description: 'Deep dive into blockchain infrastructure, nodes, and network maintenance.',
    icon: '⚙️',
    category: 'Infrastructure',
    difficulty: 'Advanced',
    estimatedTime: '90 min',
    pointsReward: 200,
    progress: 0,
    quizCount: 5,
    learningModules: [
      {
        id: 'node-basics',
        title: 'Node Fundamentals',
        description: 'Understanding blockchain nodes',
        duration: 20,
        order: 1,
        isCompleted: false,
        quizId: 'node-basics-quiz'
      },
      {
        id: 'consensus',
        title: 'Consensus Mechanisms',
        description: 'PoW, PoS, and other mechanisms',
        duration: 25,
        order: 2,
        isCompleted: false,
        quizId: 'consensus-quiz'
      },
      {
        id: 'network-security',
        title: 'Network Security',
        description: 'Securing blockchain networks',
        duration: 20,
        order: 3,
        isCompleted: false,
        quizId: 'security-quiz'
      },
      {
        id: 'scaling',
        title: 'Scaling Solutions',
        description: 'Layer 2 and scaling',
        duration: 15,
        order: 4,
        isCompleted: false,
        quizId: 'scaling-quiz'
      },
      {
        id: 'maintenance',
        title: 'Node Maintenance',
        description: 'Running and maintaining nodes',
        duration: 10,
        order: 5,
        isCompleted: false,
        quizId: 'maintenance-quiz'
      }
    ],
    tags: ['Infrastructure', 'Nodes', 'Security', 'Scaling'],
    rating: 4.9,
    completedCount: 450
  },
  {
    id: 'security-auditing',
    title: 'Smart Contract Security',
    description: 'Learn smart contract security best practices and auditing techniques.',
    icon: '🔒',
    category: 'Security',
    difficulty: 'Advanced',
    estimatedTime: '75 min',
    pointsReward: 180,
    progress: 0,
    quizCount: 4,
    learningModules: [
      {
        id: 'security-basics',
        title: 'Security Fundamentals',
        description: 'Common vulnerabilities',
        duration: 20,
        order: 1,
        isCompleted: false,
        quizId: 'security-basics-quiz'
      },
      {
        id: 'auditing',
        title: 'Auditing Process',
        description: 'How to audit smart contracts',
        duration: 25,
        order: 2,
        isCompleted: false,
        quizId: 'auditing-quiz'
      },
      {
        id: 'tools',
        title: 'Security Tools',
        description: 'Tools for security analysis',
        duration: 15,
        order: 3,
        isCompleted: false,
        quizId: 'tools-quiz'
      },
      {
        id: 'best-practices',
        title: 'Security Best Practices',
        description: 'Industry standards',
        duration: 15,
        order: 4,
        isCompleted: false,
        quizId: 'practices-quiz'
      }
    ],
    tags: ['Security', 'Auditing', 'Smart Contracts', 'Best Practices'],
    rating: 4.8,
    completedCount: 320
  },
  {
    id: 'dao-governance',
    title: 'DAO Governance',
    description: 'Understand decentralized autonomous organizations and governance models.',
    icon: '🏛️',
    category: 'DeFi',
    difficulty: 'Intermediate',
    estimatedTime: '55 min',
    pointsReward: 140,
    progress: 0,
    quizCount: 3,
    learningModules: [
      {
        id: 'dao-basics',
        title: 'DAO Fundamentals',
        description: 'What are DAOs',
        duration: 20,
        order: 1,
        isCompleted: false,
        quizId: 'dao-basics-quiz'
      },
      {
        id: 'governance',
        title: 'Governance Models',
        description: 'Different governance approaches',
        duration: 20,
        order: 2,
        isCompleted: false,
        quizId: 'governance-quiz'
      },
      {
        id: 'voting',
        title: 'Voting Mechanisms',
        description: 'How voting works in DAOs',
        duration: 15,
        order: 3,
        isCompleted: false,
        quizId: 'voting-quiz'
      }
    ],
    tags: ['DAO', 'Governance', 'DeFi', 'Voting'],
    rating: 4.5,
    completedCount: 670
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Projects', icon: '📚' },
  { id: 'defi', name: 'DeFi', icon: '💰' },
  { id: 'nfts', name: 'NFTs', icon: '🎨' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'infrastructure', name: 'Infrastructure', icon: '⚙️' },
  { id: 'security', name: 'Security', icon: '🔒' }
];

export const DIFFICULTY_LEVELS = [
  { id: 'beginner', name: 'Beginner', color: '#4CAF50' },
  { id: 'intermediate', name: 'Intermediate', color: '#FF9800' },
  { id: 'advanced', name: 'Advanced', color: '#F44336' }
];