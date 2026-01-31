import { NextRequest, NextResponse } from 'next/server';
import { LearningState } from '@/types';

/**
 * Adaptive Learning Engine - Tracks progress and adjusts difficulty
 * GET /api/learning/state - Get user's learning state
 * POST /api/learning/state - Update learning state after quiz completion
 */

// In-memory storage for demo - In production: use DynamoDB or similar
const learningStates = new Map<string, LearningState>();

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const learningState = learningStates.get(userId) || createInitialLearningState(userId);
    
    return NextResponse.json(learningState);
  } catch (error) {
    console.error('Learning State Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning state' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, quizId, category, difficulty, score, totalQuestions, timeSpent } = await req.json();

    if (!userId || !quizId || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const currentState = learningStates.get(userId) || createInitialLearningState(userId);
    const updatedState = updateLearningState(currentState, {
      quizId,
      category,
      difficulty,
      score,
      totalQuestions,
      timeSpent
    });

    learningStates.set(userId, updatedState);

    // Generate adaptive recommendations
    const recommendations = generateAdaptiveRecommendations(updatedState);

    return NextResponse.json({
      learningState: updatedState,
      recommendations,
      progressUpdate: {
        previousLevel: currentState.topicScores[category]?.masteryLevel || 'beginner',
        newLevel: updatedState.topicScores[category].masteryLevel,
        improved: updatedState.topicScores[category].averageScore > (currentState.topicScores[category]?.averageScore || 0)
      }
    });

  } catch (error) {
    console.error('Learning State Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update learning state' },
      { status: 500 }
    );
  }
}

function createInitialLearningState(userId: string): LearningState {
  return {
    userId,
    topicScores: {},
    weakAreas: [],
    recommendedTopics: ['DeFi', 'NFTs', 'Gaming'],
    overallProgress: 0,
    completed: false,
    lastUpdated: new Date().toISOString()
  };
}

function updateLearningState(
  currentState: LearningState, 
  quizResult: {
    quizId: string;
    category: string;
    difficulty: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
  }
): LearningState {
  const { category, score, totalQuestions, difficulty } = quizResult;
  const percentage = (score / totalQuestions) * 100;

  // Update topic scores
  const currentTopic = currentState.topicScores[category] || {
    totalAttempts: 0,
    correctAnswers: 0,
    averageScore: 0,
    lastAttempt: '',
    masteryLevel: 'beginner' as const
  };

  const newTotalAttempts = currentTopic.totalAttempts + 1;
  const newCorrectAnswers = currentTopic.correctAnswers + score;
  const newAverageScore = (newCorrectAnswers / (newTotalAttempts * totalQuestions)) * 100;

  // Determine mastery level based on performance and difficulty
  let masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner';
  
  if (newAverageScore >= 90 && difficulty === 'Advanced') {
    masteryLevel = 'expert';
  } else if (newAverageScore >= 85 && (difficulty === 'Intermediate' || difficulty === 'Advanced')) {
    masteryLevel = 'advanced';
  } else if (newAverageScore >= 75) {
    masteryLevel = 'intermediate';
  } else {
    masteryLevel = 'beginner';
  }

  const updatedTopicScores = {
    ...currentState.topicScores,
    [category]: {
      totalAttempts: newTotalAttempts,
      correctAnswers: newCorrectAnswers,
      averageScore: newAverageScore,
      lastAttempt: new Date().toISOString(),
      masteryLevel
    }
  };

  // Identify weak areas (topics with < 70% average score)
  const weakAreas = Object.entries(updatedTopicScores)
    .filter(([_, scores]) => scores.averageScore < 70)
    .map(([topic, _]) => topic);

  // Calculate overall progress
  const totalTopics = Object.keys(updatedTopicScores).length;
  const masteredTopics = Object.values(updatedTopicScores)
    .filter(scores => scores.masteryLevel === 'advanced' || scores.masteryLevel === 'expert').length;
  const overallProgress = totalTopics > 0 ? (masteredTopics / totalTopics) * 100 : 0;

  // Determine if learning is completed (80%+ mastery across all attempted topics)
  const completed = overallProgress >= 80 && totalTopics >= 3;

  // Generate recommended topics based on current progress
  const allTopics = ['DeFi', 'NFTs', 'Gaming', 'Security', 'Infrastructure'];
  const attemptedTopics = Object.keys(updatedTopicScores);
  const untriedTopics = allTopics.filter(topic => !attemptedTopics.includes(topic));
  
  let recommendedTopics: string[] = [];
  
  // Recommend weak areas first
  if (weakAreas.length > 0) {
    recommendedTopics = [...weakAreas];
  }
  
  // Then recommend new topics based on mastery progression
  if (masteryLevel === 'expert' || masteryLevel === 'advanced') {
    recommendedTopics = [...recommendedTopics, ...untriedTopics.slice(0, 2)];
  } else {
    // Focus on current topic until intermediate level
    recommendedTopics = [category, ...untriedTopics.slice(0, 1)];
  }

  return {
    ...currentState,
    topicScores: updatedTopicScores,
    weakAreas,
    recommendedTopics: [...new Set(recommendedTopics)].slice(0, 3),
    overallProgress,
    completed,
    lastUpdated: new Date().toISOString()
  };
}

function generateAdaptiveRecommendations(learningState: LearningState) {
  const recommendations = [];

  // Difficulty progression recommendations
  for (const [topic, scores] of Object.entries(learningState.topicScores)) {
    if (scores.masteryLevel === 'beginner' && scores.averageScore < 60) {
      recommendations.push({
        type: 'difficulty_adjustment',
        topic,
        message: `Consider reviewing ${topic} fundamentals before attempting more quizzes`,
        action: 'review_basics',
        priority: 'high'
      });
    } else if (scores.masteryLevel === 'intermediate' && scores.averageScore >= 80) {
      recommendations.push({
        type: 'difficulty_progression',
        topic,
        message: `You're ready for Advanced ${topic} challenges!`,
        action: 'try_advanced',
        priority: 'medium'
      });
    }
  }

  // Weak area recommendations
  if (learningState.weakAreas.length > 0) {
    recommendations.push({
      type: 'weak_area_focus',
      topic: learningState.weakAreas[0],
      message: `Focus on improving your ${learningState.weakAreas[0]} knowledge`,
      action: 'practice_weak_area',
      priority: 'high'
    });
  }

  // New topic recommendations
  if (learningState.recommendedTopics.length > 0) {
    const nextTopic = learningState.recommendedTopics[0];
    recommendations.push({
      type: 'new_topic',
      topic: nextTopic,
      message: `Ready to explore ${nextTopic}? Start with beginner level`,
      action: 'try_new_topic',
      priority: 'low'
    });
  }

  // Completion recommendations
  if (learningState.completed) {
    recommendations.push({
      type: 'completion',
      topic: 'certification',
      message: 'Congratulations! You\'re ready for certification',
      action: 'get_certificate',
      priority: 'high'
    });
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}