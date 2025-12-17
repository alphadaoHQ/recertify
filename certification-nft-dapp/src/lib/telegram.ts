import WebApp from "@twa-dev/sdk";

// Telegram WebApp SDK integration
let telegramWebApp: any = null;

// Initialize WebApp only on client side
if (typeof window !== "undefined") {
  telegramWebApp = WebApp;
}

export { telegramWebApp };

// Initialize Telegram WebApp
export const initTelegramWebApp = () => {
  try {
    if (telegramWebApp) {
      // Expand the WebApp to full height
      telegramWebApp.expand();

      // Set header color to match our theme
      telegramWebApp.setHeaderColor("#008080");

      // Enable closing confirmation (optional)
      telegramWebApp.enableClosingConfirmation();

      // Set background color to match our theme
      telegramWebApp.setBackgroundColor("#f9fafb"); // light mode default

      return true;
    }
    return false;
  } catch (error) {
    console.warn("Telegram WebApp initialization failed:", error);
    return false;
  }
};

// Get user information from Telegram
export const getTelegramUser = () => {
  try {
    return telegramWebApp?.initDataUnsafe?.user;
  } catch (error) {
    console.warn("Failed to get Telegram user:", error);
    return null;
  }
};

// Get WebApp data
export const getWebAppData = () => {
  try {
    if (telegramWebApp) {
      return {
        initData: telegramWebApp.initData,
        initDataUnsafe: telegramWebApp.initDataUnsafe,
        platform: telegramWebApp.platform,
        version: telegramWebApp.version,
      };
    }
    return null;
  } catch (error) {
    console.warn("Failed to get WebApp data:", error);
    return null;
  }
};

// Show alert using Telegram's native alert
export const showTelegramAlert = (message: string) => {
  try {
    if (telegramWebApp) {
      telegramWebApp.showAlert(message);
    } else {
      alert(message); // fallback
    }
  } catch (error) {
    console.warn("Failed to show Telegram alert:", error);
    alert(message); // fallback
  }
};

// Show confirmation dialog
export const showTelegramConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (telegramWebApp) {
        telegramWebApp.showConfirm(message, (confirmed: boolean) => {
          resolve(confirmed);
        });
      } else {
        resolve(confirm(message)); // fallback
      }
    } catch (error) {
      console.warn("Failed to show Telegram confirm:", error);
      resolve(confirm(message)); // fallback
    }
  });
};

// Close the WebApp
export const closeTelegramWebApp = () => {
  try {
    if (telegramWebApp) {
      telegramWebApp.close();
    }
  } catch (error) {
    console.warn("Failed to close Telegram WebApp:", error);
  }
};

// Check if running in Telegram
export const isInTelegram = () => {
  try {
    return telegramWebApp && telegramWebApp.platform !== "unknown";
  } catch {
    return false;
  }
};

// Haptic feedback
export const triggerHapticFeedback = (
  type: "light" | "medium" | "heavy" | "rigid" | "soft" = "light",
) => {
  try {
    if (telegramWebApp?.HapticFeedback) {
      switch (type) {
        case "light":
          telegramWebApp.HapticFeedback.impactOccurred("light");
          break;
        case "medium":
          telegramWebApp.HapticFeedback.impactOccurred("medium");
          break;
        case "heavy":
          telegramWebApp.HapticFeedback.impactOccurred("heavy");
          break;
        case "rigid":
          telegramWebApp.HapticFeedback.impactOccurred("rigid");
          break;
        case "soft":
          telegramWebApp.HapticFeedback.impactOccurred("soft");
          break;
      }
    }
  } catch (error) {
    console.warn("Haptic feedback not supported:", error);
  }
};

// Share URL using Telegram
export const shareUrl = (url: string, text?: string) => {
  try {
    if (telegramWebApp) {
      const shareText = text ? `${text}\n${url}` : url;
      telegramWebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
      );
    } else {
      // Fallback to clipboard
      navigator.clipboard?.writeText(url);
    }
  } catch (error) {
    console.warn("Failed to share URL:", error);
    // Fallback to clipboard
    navigator.clipboard?.writeText(url);
  }
};

// Open external link
export const openExternalLink = (url: string) => {
  try {
    if (telegramWebApp) {
      telegramWebApp.openLink(url);
    } else {
      window.open(url, "_blank");
    }
  } catch (error) {
    console.warn("Failed to open external link:", error);
    window.open(url, "_blank");
  }
};

// Set theme based on Telegram theme
export const setTelegramTheme = (isDarkMode: boolean) => {
  try {
    if (telegramWebApp) {
      if (isDarkMode) {
        telegramWebApp.setBackgroundColor("#111827"); // gray-900
        telegramWebApp.setHeaderColor("#1f2937"); // gray-800
      } else {
        telegramWebApp.setBackgroundColor("#f9fafb"); // gray-50
        telegramWebApp.setHeaderColor("#008080"); // teal
      }
    }
  } catch (error) {
    console.warn("Failed to set Telegram theme:", error);
  }
};
