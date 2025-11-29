import supabase from "@/lib/supabaseClient";
import { getOrCreateTelegramUser, incrementReferralCount, saveUserStats, loadUserStats } from "@/lib/supabaseService";

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
  };
}

export class TelegramWebhookHandler {
  private botToken: string | undefined;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
  }

  async handleUpdate(update: TelegramUpdate): Promise<{ ok: boolean; error?: string }> {
    try {
      if (!update.message) {
        return { ok: true };
      }

      const { message } = update;
      const { from, chat, text } = message;

      if (text?.startsWith("/start")) {
        await this.handleStartCommand(from, chat, text);
      }

      return { ok: true };
    } catch (error) {
      console.error("Telegram webhook error:", error);
      return { ok: false, error: "Internal server error" };
    }
  }

  private async handleStartCommand(
    from: TelegramUpdate['message']['from'],
    chat: TelegramUpdate['message']['chat'],
    text: string
  ): Promise<void> {
    try {
      // Parse referral code
      const referralCode = this.parseReferralCode(text);

      // Get or create user in database
      const user = await getOrCreateTelegramUser(
        from.id,
        from.username,
        from.first_name,
        from.last_name
      );

      if (!user) {
        console.error("Failed to create Telegram user");
        await this.sendTelegramMessage(chat.id, "Error: Failed to register user.");
        return;
      }

      // Get profile photo
      const avatarUrl = await this.getUserProfilePhoto(from.id);

      // Save to user_stats (using telegram_id as user_address)
      const userAddress = from.id.toString();
      const userStats = {
        points: 0,
        daily_streak: 0,
        claimed_task_ids: [],
        avatar_url: avatarUrl || undefined,
        referral_count: 0,
      };
      const statsSaved = await saveUserStats(userAddress, userStats);
      if (!statsSaved) {
        console.error("Failed to save user stats");
      }

      // Handle referral if present
      if (referralCode) {
        const referralHandled = await this.handleReferral(referralCode, userAddress);
        if (!referralHandled) {
          console.warn("Referral handling failed for code:", referralCode);
        }
      }

      // Send welcome message
      const username = user.username || user.first_name || "User";
      let welcomeMessage = `Hi ${username}, welcome to Recertify!`;
      if (avatarUrl) {
        welcomeMessage += " Your profile photo has been saved.";
      }
      if (referralCode) {
        welcomeMessage += " Thanks for joining via referral!";
      }
      await this.sendTelegramMessage(chat.id, welcomeMessage);
    } catch (error) {
      console.error("Error in /start handling:", error);
      await this.sendTelegramMessage(chat.id, "Error: Something went wrong during registration.");
    }
  }

  private async sendTelegramMessage(chatId: number, text: string): Promise<void> {
    if (!this.botToken) {
      console.error("TELEGRAM_BOT_TOKEN not set");
      return;
    }

    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      });
      if (!response.ok) {
        console.error("Failed to send Telegram message:", await response.text());
      }
    } catch (error) {
      console.error("Error sending Telegram message:", error);
    }
  }

  private async getUserProfilePhoto(telegramId: number): Promise<string | null> {
    if (!this.botToken) {
      console.error("TELEGRAM_BOT_TOKEN not set");
      return null;
    }

    try {
      // Get profile photos
      const photosUrl = `https://api.telegram.org/bot${this.botToken}/getUserProfilePhotos?user_id=${telegramId}&limit=1`;
      const photosResponse = await fetch(photosUrl);
      const photosData = await photosResponse.json();

      if (!photosData.ok || !photosData.result.photos || photosData.result.photos.length === 0) {
        console.log("No profile photo found for user", telegramId);
        return null;
      }

      const photo = photosData.result.photos[0][0]; // Get the highest resolution
      const fileId = photo.file_id;

      // Get file path
      const fileUrl = `https://api.telegram.org/bot${this.botToken}/getFile?file_id=${fileId}`;
      const fileResponse = await fetch(fileUrl);
      const fileData = await fileResponse.json();

      if (!fileData.ok) {
        console.error("Failed to get file info:", fileData);
        return null;
      }

      const filePath = fileData.result.file_path;
      const downloadUrl = `https://api.telegram.org/file/bot${this.botToken}/${filePath}`;

      // Download the image
      const imageResponse = await fetch(downloadUrl);
      if (!imageResponse.ok) {
        console.error("Failed to download image:", imageResponse.status);
        return null;
      }

      const imageBuffer = await imageResponse.arrayBuffer();

      // Upload to Supabase storage
      const fileName = `telegram_${telegramId}_${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) {
        console.error("Failed to upload to Supabase:", error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error getting profile photo:", error);
      return null;
    }
  }

  private parseReferralCode(text: string): string | null {
    const match = text.match(/^\/start\s+(\w+)$/);
    return match ? match[1] : null;
  }

  private async handleReferral(referralCode: string, newUserId: string): Promise<boolean> {
    try {
      // Find referrer by referral code
      const { data: referrer, error } = await supabase
        .from('user_stats')
        .select('user_address, points')
        .eq('referral_code', referralCode)
        .single();

      if (error || !referrer) {
        console.log("Referrer not found for code:", referralCode);
        return false;
      }

      // Increment referral count
      const success = await incrementReferralCount(referrer.user_address);
      if (!success) {
        console.error("Failed to increment referral count");
        return false;
      }

      // Award points to referrer (e.g., 10 points)
      const currentStats = await loadUserStats(referrer.user_address);
      if (!currentStats) {
        console.error("Failed to load referrer stats");
        return false;
      }
      const newPoints = (currentStats.points || 0) + 10;
      const updatedStats = { ...currentStats, points: newPoints };
      delete (updatedStats as any).user_address; // Remove user_address for save
      const statsSuccess = await saveUserStats(referrer.user_address, updatedStats);
      if (!statsSuccess) {
        console.error("Failed to award points to referrer");
        return false;
      }

      console.log(`Awarded 10 points to referrer ${referrer.user_address} for new user ${newUserId}`);
      return true;
    } catch (error) {
      console.error("Error handling referral:", error);
      return false;
    }
  }
}