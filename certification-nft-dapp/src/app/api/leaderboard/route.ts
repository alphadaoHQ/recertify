import { NextResponse } from "next/server";
import { getLeaderboard, getUserRank } from "@/lib/supabaseService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const typeParam = url.searchParams.get("type") || "alltime"; // daily | weekly | alltime
    const userAddressParam = url.searchParams.get("userAddress");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const data = await getLeaderboard(
      limit,
      typeParam as "daily" | "weekly" | "alltime",
    );

    let userRank = null;
    if (userAddressParam) {
      userRank = await getUserRank(
        userAddressParam,
        typeParam as "daily" | "weekly" | "alltime",
      );
    }

    return NextResponse.json({ success: true, data, userRank });
  } catch (err) {
    console.error("/api/leaderboard error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
