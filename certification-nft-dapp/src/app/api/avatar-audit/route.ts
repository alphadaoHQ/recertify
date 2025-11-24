import { NextResponse } from "next/server";
import { getAvatarAuditPaginated, getAllAvatarAuditsPaginated } from "@/lib/supabaseService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const user = url.searchParams.get("user");
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");
    const adminKey = url.searchParams.get("adminKey");

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const pageSize = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 20;

    const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
    const isAdmin = adminKey && ADMIN_API_KEY && adminKey === ADMIN_API_KEY;

    // If admin key is provided and valid, allow listing all audits
    if (isAdmin) {
      const result = await getAllAvatarAuditsPaginated(page, pageSize);
      return NextResponse.json({ success: true, ...result });
    }

    // Otherwise, require user param and return user-scoped results
    if (!user) {
      return NextResponse.json({ success: false, message: "Missing user param (or provide valid adminKey)" }, { status: 400 });
    }

    const result = await getAvatarAuditPaginated(user, page, pageSize);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("/api/avatar-audit error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
