import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, query from database
const MOCK_QUIZZES = {
  'defi-intro-quiz': {
    id: 'defi-intro-quiz',
    title: 'DeFi Fundamentals Quiz',
    completed: false,
    score: null,
    attempts: 0,
  },
};

/**
 * GET /api/quizzes - Get all quizzes
 * GET /api/quizzes?category=DeFi - Get quizzes by category
 * GET /api/quizzes/:id - Get specific quiz
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const id = params?.id;
    const category = req.nextUrl.searchParams.get('category');
    const userId = req.headers.get('x-user-id');

    if (id) {
      // Get specific quiz
      const quiz = MOCK_QUIZZES[id as keyof typeof MOCK_QUIZZES];
      if (!quiz) {
        return NextResponse.json(
          { error: 'Quiz not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(quiz);
    }

    if (category) {
      // Get quizzes by category
      // In production: filter from database
      return NextResponse.json({
        quizzes: [],
        category,
        total: 0,
      });
    }

    // Get all quizzes
    return NextResponse.json({
      quizzes: Object.values(MOCK_QUIZZES),
      total: Object.keys(MOCK_QUIZZES).length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quizzes/:id/submit - Submit quiz answers
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const { answers, timeSpent } = await req.json();
    const id = params?.id;
    const userId = req.headers.get('x-user-id');

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID required' },
        { status: 400 }
      );
    }

    // Calculate score (in production: validate and save to database)
    const score = answers.filter((a: any) => a.isCorrect).length;
    const percentage = Math.round((score / answers.length) * 100);
    const passed = percentage >= 70;

    return NextResponse.json({
      quizId: id,
      userId,
      score,
      percentage,
      passed,
      timeSpent,
      pointsEarned: passed ? 50 : 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
