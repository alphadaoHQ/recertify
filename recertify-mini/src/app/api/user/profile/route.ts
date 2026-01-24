import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/user/profile - Get user profile
 * PUT /api/user/profile - Update user profile
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // In production: fetch from database
    const userProfile = {
      id: userId,
      name: 'Crypto Learner',
      avatar: '👨‍💻',
      email: 'user@example.com',
      walletAddress: '0x742d...3d0',
      joinDate: '2024-01-15',
      stats: {
        points: 2150,
        level: 5,
        dailyStreak: 7,
        completedQuizzes: 18,
        completedProjects: 3,
        achievements: 12,
      },
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const body = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // In production: update in database
    const updatedProfile = {
      id: userId,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
