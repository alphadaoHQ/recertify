import { NextRequest, NextResponse } from "next/server";
import { TelegramWebhookHandler } from "@/lib/TelegramWebhookHandler";

const handler = new TelegramWebhookHandler();

export async function POST(request: NextRequest) {
  const update = await request.json();
  const result = await handler.handleUpdate(update);

  if (result.ok) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Telegram webhook endpoint" });
}