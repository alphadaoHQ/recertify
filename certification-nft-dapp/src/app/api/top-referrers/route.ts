import { NextResponse } from "next/server";
import { getTopReferrers } from "@/lib/supabaseService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const data = await getTopReferrers(limit);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("/api/top-referrers error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch top referrers" },
      { status: 500 },
    );
  }
}
