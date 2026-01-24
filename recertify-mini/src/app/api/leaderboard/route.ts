import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/leaderboard - Get leaderboard
 * GET /api/leaderboard?timeframe=week - Get leaderboard by timeframe
 */
export async function GET(req: NextRequest) {
  try {
    const timeframe = req.nextUrl.searchParams.get('timeframe') || 'all';
    const limit = req.nextUrl.searchParams.get('limit') || '100';

    // In production: fetch from database with timeframe filter
    const leaderboard = [
      {
        rank: 1,
        userId: '1',
        username: 'CryptoMaster',
        avatar: '👑',
        points: 5420,
        level: 12,
        badge: '🏆',
      },
      {
        rank: 2,
        userId: '2',
        username: 'BlockchainPro',
        avatar: '🔗',
        points: 4890,
        level: 11,
        badge: '⭐',
      },
      {
        rank: 3,
        userId: '3',
        username: 'DeFiGuru',
        avatar: '💰',
        points: 4520,
        level: 10,
        badge: '💎',
      },
    ];

    return NextResponse.json({
      leaderboard,
      timeframe,
      total: leaderboard.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
