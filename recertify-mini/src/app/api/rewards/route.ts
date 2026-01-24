import { NextRequest, NextResponse } from 'next/server';

interface RewardRequest {
  userId: string;
  quizId: string;
  score: number;
  projectId?: string;
}

interface RewardResponse {
  pointsEarned: number;
  bonusPoints?: number;
  levelUp?: boolean;
  newLevel?: number;
  achievement?: {
    id: string;
    title: string;
    pointsReward: number;
  };
  message: string;
}

const POINTS_CONFIG = {
  basePoints: 50,
  percentageBonus: 0.5, // 0.5 points per 1% score
  perfectScoreBonus: 100, // Extra bonus for 100%
  levelUpThreshold: 500,
};

const calculateRewards = (score: number): { points: number; bonus: number } => {
  let points = POINTS_CONFIG.basePoints;
  
  // Bonus based on score percentage
  points += Math.round(score * POINTS_CONFIG.percentageBonus);
  
  // Perfect score bonus
  let bonus = 0;
  if (score === 100) {
    bonus = POINTS_CONFIG.perfectScoreBonus;
  }
  
  return { points, bonus };
};

export async function POST(request: NextRequest) {
  try {
    const body: RewardRequest = await request.json();
    const { userId, quizId, score, projectId } = body;

    // Validate request
    if (!userId || !quizId || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, quizId, score' },
        { status: 400 }
      );
    }

    if (score < 0 || score > 100) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Calculate rewards
    const { points, bonus } = calculateRewards(score);
    const totalPoints = points + bonus;

    // Simulate getting user's current points (in real app, query database)
    const currentPoints = 350; // Mock value
    const newTotalPoints = currentPoints + totalPoints;

    // Check for level up
    const currentLevel = Math.floor(currentPoints / POINTS_CONFIG.levelUpThreshold) + 1;
    const newLevel = Math.floor(newTotalPoints / POINTS_CONFIG.levelUpThreshold) + 1;
    const levelUp = newLevel > currentLevel;

    // Check for achievements (mock)
    const achievements = [
      { threshold: 500, id: 'first-500', title: 'Milestone: 500 Points' },
      { threshold: 1000, id: 'first-1000', title: 'Milestone: 1000 Points' },
      { threshold: 5000, id: 'first-5000', title: 'Expert: 5000 Points' },
    ];

    let unlockedAchievement = null;
    for (const achievement of achievements) {
      if (newTotalPoints >= achievement.threshold && currentPoints < achievement.threshold) {
        unlockedAchievement = {
          id: achievement.id,
          title: achievement.title,
          pointsReward: 100
        };
        break;
      }
    }

    const response: RewardResponse = {
      pointsEarned: totalPoints,
      bonusPoints: bonus > 0 ? bonus : undefined,
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
      achievement: unlockedAchievement || undefined,
      message: `You earned ${totalPoints} points from completing this quiz!${
        bonus > 0 ? ` Bonus: +${bonus} points!` : ''
      }`
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error calculating rewards:', error);
    return NextResponse.json(
      { error: 'Failed to calculate rewards' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's reward history
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const limit = request.nextUrl.searchParams.get('limit') || '10';

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Mock reward history (in real app, query database)
    const history = [
      {
        id: '1',
        quizId: 'defi-intro-quiz',
        projectId: 'defi-basics',
        pointsEarned: 105,
        score: 95,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        bonusPoints: 10
      },
      {
        id: '2',
        quizId: 'liquidity-quiz',
        projectId: 'defi-basics',
        pointsEarned: 80,
        score: 75,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        bonusPoints: 0
      },
      {
        id: '3',
        quizId: 'nft-basics-quiz',
        projectId: 'nft-creation',
        pointsEarned: 150,
        score: 100,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        bonusPoints: 100
      }
    ].slice(0, parseInt(limit));

    return NextResponse.json({
      userId,
      totalPoints: 335,
      rewardHistory: history
    }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving reward history:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reward history' },
      { status: 500 }
    );
  }
}
