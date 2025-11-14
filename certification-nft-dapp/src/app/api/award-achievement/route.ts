import { NextResponse } from "next/server";
import { awardAchievement } from "@/lib/supabaseService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, achievementId } = body;
    if (!userAddress || !achievementId) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 },
      );
    }

    const ok = await awardAchievement(userAddress, achievementId);
    if (!ok)
      return NextResponse.json(
        { success: false, message: "Failed to award achievement" },
        { status: 500 },
      );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/award-achievement error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
