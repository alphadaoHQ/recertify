import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Telegram Bot Webhook Handler
 * POST /api/telegram/webhook
 */

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    text?: string;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
    };
    data: string;
  };
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

export async function POST(req: NextRequest) {
  try {
    const body: TelegramUpdate = await req.json();

    // Handle regular messages
    if (body.message) {
      const { message } = body;
      const chatId = message.chat.id;
      const text = message.text || '';
      const userId = message.from.id;
      const userName = message.from.first_name;

      // Handle /start command
      if (text.includes('/start')) {
        await sendTelegramMessage(
          chatId,
          `Welcome to Recertify Mini, ${userName}! 🚀\n\nLearn Web3 and blockchain through interactive quizzes and projects.\n\nTap the button below to open the app.`,
          {
            inline_keyboard: [
              [
                {
                  text: '🚀 Open App',
                  web_app: {
                    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://recertify-mini.vercel.app'}?user=${userId}`,
                  },
                },
              ],
            ],
          }
        );
      }

      // Handle /help command
      if (text.includes('/help')) {
        await sendTelegramMessage(
          chatId,
          `Available commands:\n\n/start - Start the app\n/help - Show help\n/stats - View your stats\n/refer - Get referral link`
        );
      }

      // Handle /stats command
      if (text.includes('/stats')) {
        await sendTelegramMessage(
          chatId,
          `📊 Your Stats:\n\nPoints: 2150\nLevel: 5\nStreak: 7 days\nQuizzes: 18\nProjects: 3`
        );
      }

      // Handle /refer command
      if (text.includes('/refer')) {
        const referralLink = `https://t.me/recertify_mini_bot?start=ref_${userId}`;
        await sendTelegramMessage(
          chatId,
          `🔗 Your Referral Link:\n\n${referralLink}\n\nShare with friends and earn 100 points per referral!`
        );
      }
    }

    // Handle callback queries (button clicks)
    if (body.callback_query) {
      const { callback_query } = body;
      const { id: queryId, from, data } = callback_query;
      const userId = from.id;

      // Handle different callback data
      if (data.includes('join')) {
        await answerCallbackQuery(
          queryId,
          'Welcome! Open the app to get started.',
          true
        );
      }

      if (data.includes('share')) {
        // Trigger sharing modal
        await answerCallbackQuery(
          queryId,
          'Your achievement has been shared!',
          false
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Helper function to send Telegram messages
async function sendTelegramMessage(
  chatId: number,
  text: string,
  replyMarkup?: any
) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          ...(replyMarkup && { reply_markup: replyMarkup }),
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to send Telegram message:', await response.text());
    }

    return response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

// Helper function to answer callback queries
async function answerCallbackQuery(
  queryId: string,
  text: string,
  showAlert: boolean
) {
  try {
    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: queryId,
          text,
          show_alert: showAlert,
        }),
      }
    );
  } catch (error) {
    console.error('Error answering callback query:', error);
  }
}

/**
 * Verify Telegram bot token
 * GET /api/telegram/webhook?token=YOUR_TOKEN
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');

    if (!token || token !== BOT_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      webhookActive: true,
      botName: 'Recertify Mini Bot',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify webhook' },
      { status: 500 }
    );
  }
}
