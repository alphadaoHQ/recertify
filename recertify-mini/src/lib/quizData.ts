// Enhanced quiz data with project integration and bitdegree.org inspiration

import { EnhancedQuiz } from '@/types';

export const ENHANCED_QUIZZES: EnhancedQuiz[] = [
  {
    id: 'defi-intro-quiz',
    title: 'DeFi Fundamentals Quiz',
    description: 'Test your knowledge of decentralized finance basics',
    projectId: 'defi-basics',
    projectIcon: '💰',
    category: 'DeFi',
    difficulty: 'Beginner',
    estimatedTime: 10,
    points: 50,
    questions: [
      {
        id: 'defi-q1',
        question: 'What does DeFi stand for?',
        options: [
          'Digital Finance',
          'Decentralized Finance',
          'Distributed Finance',
          'Democratic Finance'
        ],
        correctAnswer: 1,
        explanation: 'DeFi stands for Decentralized Finance, which refers to financial services built on blockchain technology.'
      },
      {
        id: 'defi-q2',
        question: 'What is a liquidity pool?',
        options: [
          'A swimming pool for crypto',
          'A collection of funds locked in a smart contract',
          'A type of cryptocurrency',
          'A bank account'
        ],
        correctAnswer: 1,
        explanation: 'A liquidity pool is a collection of funds locked in a smart contract, used to facilitate trading in decentralized exchanges.'
      },
      {
        id: 'defi-q3',
        question: 'What is yield farming?',
        options: [
          'Growing crops with crypto',
          'Earning rewards by staking or lending crypto',
          'Mining cryptocurrency',
          'Trading NFTs'
        ],
        correctAnswer: 1,
        explanation: 'Yield farming is the practice of staking or lending cryptocurrency assets to generate high returns or rewards.'
      }
    ],
    socialProof: {
      completedCount: 1250,
      averageScore: 85,
      rating: 4.8
    }
  },
  {
    id: 'nft-basics-quiz',
    title: 'NFT Fundamentals Quiz',
    description: 'Master the basics of non-fungible tokens',
    projectId: 'nft-creation',
    projectIcon: '🎨',
    category: 'NFTs',
    difficulty: 'Intermediate',
    estimatedTime: 15,
    points: 75,
    questions: [
      {
        id: 'nft-q1',
        question: 'What makes an NFT unique?',
        options: [
          'Its price',
          'Its non-interchangeable properties and unique token ID',
          'Its visual design',
          'Its blockchain'
        ],
        correctAnswer: 1,
        explanation: 'NFTs are unique because of their non-interchangeable properties and unique token ID on the blockchain.'
      },
      {
        id: 'nft-q2',
        question: 'Which Ethereum standard is commonly used for NFTs?',
        options: [
          'ERC-20',
          'ERC-721',
          'ERC-777',
          'ERC-1155 (only)'
        ],
        correctAnswer: 1,
        explanation: 'ERC-721 is the most common standard for NFTs, though ERC-1155 is also used for both fungible and non-fungible tokens.'
      },
      {
        id: 'nft-q3',
        question: 'What does minting an NFT mean?',
        options: [
          'Creating a physical coin',
          'Buying an NFT',
          'Publishing the token on the blockchain for the first time',
          'Selling an NFT'
        ],
        correctAnswer: 2,
        explanation: 'Minting an NFT means publishing the token on the blockchain for the first time, making it officially part of the blockchain.'
      },
      {
        id: 'nft-q4',
        question: 'Where are NFT metadata and files typically stored?',
        options: [
          'On the blockchain directly',
          'In centralized servers',
          'On IPFS or similar decentralized storage',
          'In the owner\'s computer'
        ],
        correctAnswer: 2,
        explanation: 'NFT metadata and files are typically stored on IPFS (InterPlanetary File System) or similar decentralized storage to ensure permanence.'
      }
    ],
    socialProof: {
      completedCount: 890,
      averageScore: 78,
      rating: 4.6
    }
  },
  {
    id: 'gaming-intro-quiz',
    title: 'Blockchain Gaming Quiz',
    description: 'Test your knowledge of play-to-earn and blockchain gaming',
    projectId: 'gaming-tokens',
    projectIcon: '🎮',
    category: 'Gaming',
    difficulty: 'Beginner',
    estimatedTime: 12,
    points: 60,
    questions: [
      {
        id: 'gaming-q1',
        question: 'What is Play-to-Earn (P2E)?',
        options: [
          'Buying games with crypto',
          'Gaming models where players can earn real-world value',
          'Free games',
          'Professional gaming'
        ],
        correctAnswer: 1,
        explanation: 'Play-to-Earn (P2E) refers to gaming models where players can earn real-world value through gameplay.'
      },
      {
        id: 'gaming-q2',
        question: 'What are game tokens in blockchain gaming?',
        options: [
          'Coins to buy games',
          'Cryptocurrency tokens used within game ecosystems',
          'NFT characters',
          'Game achievements'
        ],
        correctAnswer: 1,
        explanation: 'Game tokens are cryptocurrency tokens used within game ecosystems for various purposes like trading, staking, and governance.'
      },
      {
        id: 'gaming-q3',
        question: 'What is the main advantage of blockchain gaming?',
        options: [
          'Better graphics',
          'True ownership of in-game assets',
          'Faster gameplay',
          'Lower cost'
        ],
        correctAnswer: 1,
        explanation: 'The main advantage of blockchain gaming is true ownership of in-game assets, which players can trade, sell, or use across different games.'
      }
    ],
    socialProof: {
      completedCount: 1100,
      averageScore: 82,
      rating: 4.7
    }
  },
  {
    id: 'security-basics-quiz',
    title: 'Smart Contract Security Quiz',
    description: 'Challenge yourself with security best practices',
    projectId: 'security-auditing',
    projectIcon: '🔒',
    category: 'Security',
    difficulty: 'Advanced',
    estimatedTime: 20,
    points: 100,
    questions: [
      {
        id: 'security-q1',
        question: 'What is a reentrancy attack?',
        options: [
          'When a contract calls itself repeatedly',
          'When an external contract calls back into the original contract before completion',
          'When someone hacks the blockchain',
          'When a contract is deployed multiple times'
        ],
        correctAnswer: 1,
        explanation: 'A reentrancy attack occurs when an external contract calls back into the original contract before the original execution is complete.'
      },
      {
        id: 'security-q2',
        question: 'What is the "Checks-Effects-Interactions" pattern?',
        options: [
          'A way to test contracts',
          'A security pattern that orders operations to prevent reentrancy',
          'A method for user interaction',
          'A debugging technique'
        ],
        correctAnswer: 1,
        explanation: 'The Checks-Effects-Interactions pattern is a security pattern that orders operations (perform checks first, then update state, then interact with other contracts) to prevent reentrancy attacks.'
      },
      {
        id: 'security-q3',
        question: 'What is integer overflow/underflow?',
        options: [
          'When numbers get too big or too small for their data type',
          'When contracts use too much gas',
          'When there are too many users',
          'When calculations are wrong'
        ],
        correctAnswer: 0,
        explanation: 'Integer overflow/underflow occurs when numbers exceed the maximum or minimum values that can be represented by their data type.'
      },
      {
        id: 'security-q4',
        question: 'Why is it important to use OpenZeppelin contracts?',
        options: [
          'They are cheaper',
          'They are audited and tested standard implementations',
          'They have better features',
          'They are required by law'
        ],
        correctAnswer: 1,
        explanation: 'OpenZeppelin contracts provide audited and tested standard implementations that follow security best practices.'
      }
    ],
    socialProof: {
      completedCount: 320,
      averageScore: 71,
      rating: 4.8
    }
  }
];

export const QUIZ_CATEGORIES = [
  { id: 'all', name: 'All Quizzes', icon: '📝' },
  { id: 'defi', name: 'DeFi', icon: '💰' },
  { id: 'nfts', name: 'NFTs', icon: '🎨' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'security', name: 'Security', icon: '🔒' },
  { id: 'infrastructure', name: 'Infrastructure', icon: '⚙️' }
];

export const getQuizByProject = (projectId: string): EnhancedQuiz[] => {
  return ENHANCED_QUIZZES.filter(quiz => quiz.projectId === projectId);
};

export const getQuizById = (quizId: string): EnhancedQuiz | undefined => {
  return ENHANCED_QUIZZES.find(quiz => quiz.id === quizId);
};

export const getQuizzesByCategory = (category: string): EnhancedQuiz[] => {
  if (category === 'all') return ENHANCED_QUIZZES;
  return ENHANCED_QUIZZES.filter(quiz => quiz.category.toLowerCase() === category.toLowerCase());
};