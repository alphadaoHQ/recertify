import { NextResponse } from "next/server";
import { incrementReferralCount } from "@/lib/supabaseService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referrerAddress } = body;
    if (!referrerAddress) {
      return NextResponse.json(
        { success: false, message: "Missing referrerAddress" },
        { status: 400 },
      );
    }

    const ok = await incrementReferralCount(referrerAddress);
    if (!ok)
      return NextResponse.json(
        { success: false, message: "Failed to increment" },
        { status: 500 },
      );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/increment-referral error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
