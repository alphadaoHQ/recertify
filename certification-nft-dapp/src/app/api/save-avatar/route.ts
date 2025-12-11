import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";
import crypto from "crypto";

function parseInitData(initData: string): Record<string, string> {
  const obj: Record<string, string> = {};
  const parts = initData.split("&");
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (!k) continue;
    obj[decodeURIComponent(k)] = decodeURIComponent(v || "");
  }
  return obj;
}

function verifyTelegramInitData(
  initData: string,
  botToken: string | undefined,
) {
  if (!botToken) return false;
  const data = parseInitData(initData);
  const hash = data.hash || data["hash"];
  if (!hash) return false;
  delete data.hash;

  const keys = Object.keys(data).sort();
  const dataCheckString = keys.map((k) => `${k}=${data[k]}`).join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, avatarUrl, initData, adminKey } = body || {};

    if (!userAddress || !avatarUrl) {
      return NextResponse.json(
        { success: false, message: "Missing userAddress or avatarUrl" },
        { status: 400 },
      );
    }

    // Allow trusted server calls using ADMIN_API_KEY env var
    const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
    if (adminKey && ADMIN_API_KEY && adminKey === ADMIN_API_KEY) {
      const { error } = await supabase
        .from("user_stats")
        .upsert(
          { user_address: userAddress, avatar_url: avatarUrl },
          { onConflict: "user_address" },
        );

      if (error) {
        console.warn("save-avatar upsert error (admin):", error);
        return NextResponse.json(
          { success: false, message: "DB upsert failed" },
          { status: 500 },
        );
      }

      // Insert audit record
      try {
        await supabase.from("avatar_audit").insert({
          user_address: userAddress,
          avatar_url: avatarUrl,
          method: "admin",
          metadata: JSON.stringify({
            by: "admin",
            adminKey: adminKey ? "****" : null,
          }),
        });
      } catch (auditErr) {
        console.warn("Failed to write avatar audit (admin):", auditErr);
      }

      return NextResponse.json({ success: true });
    }

    // Otherwise require Telegram initData verification
    if (!initData) {
      return NextResponse.json(
        { success: false, message: "Missing initData for verification" },
        { status: 401 },
      );
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const ok = verifyTelegramInitData(initData, TELEGRAM_BOT_TOKEN);
    if (!ok) {
      console.warn("Telegram initData verification failed");
      return NextResponse.json(
        { success: false, message: "Invalid Telegram initData" },
        { status: 401 },
      );
    }

    // Parse initData for richer metadata
    const parsedInit = initData ? parseInitData(initData) : {};
    const tgMeta: Record<string, any> = {};
    // Common Telegram user fields in WebApp initDataUnsafe.user
    if (parsedInit.id) tgMeta.id = parsedInit.id;
    if (parsedInit.first_name) tgMeta.first_name = parsedInit.first_name;
    if (parsedInit.last_name) tgMeta.last_name = parsedInit.last_name;
    if (parsedInit.username) tgMeta.username = parsedInit.username;
    if (parsedInit.photo_url) tgMeta.photo_url = parsedInit.photo_url;

    // Verified — upsert
    const { error } = await supabase
      .from("user_stats")
      .upsert(
        { user_address: userAddress, avatar_url: avatarUrl },
        { onConflict: "user_address" },
      );

    if (error) {
      console.warn("save-avatar upsert error:", error);
      return NextResponse.json(
        { success: false, message: "DB upsert failed" },
        { status: 500 },
      );
    }

    // Insert audit record for verified Telegram save
    try {
      await supabase.from("avatar_audit").insert({
        user_address: userAddress,
        avatar_url: avatarUrl,
        method: "telegram",
        metadata: JSON.stringify({
          initDataPresent: initData ? true : false,
          telegram: tgMeta,
        }),
      });
    } catch (auditErr) {
      console.warn("Failed to write avatar audit (telegram):", auditErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/save-avatar error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
