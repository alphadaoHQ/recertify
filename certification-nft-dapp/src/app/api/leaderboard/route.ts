import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/supabaseService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const data = await getLeaderboard(limit);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("/api/leaderboard error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
