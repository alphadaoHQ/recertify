import { NextResponse } from "next/server";
import { getUserAchievements } from "@/lib/supabaseService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress } = body;
    if (!userAddress) {
      return NextResponse.json(
        { success: false, message: "Missing userAddress" },
        { status: 400 },
      );
    }

    const data = await getUserAchievements(userAddress);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("/api/user-achievements error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
