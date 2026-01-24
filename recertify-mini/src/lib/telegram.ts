'use client';

/**
 * Telegram Mini App Integration Utilities
 * Handles TON wallet authentication, sharing, and bot integration
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe: any;
        openTelegramLink: (url: string) => void;
        shareToStory: (blob: Blob, params?: any) => void;
        shareLinkToChat: (url: string) => void;
        openLink: (url: string) => void;
        MainButton: {
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
      };
    };
  }
}

export class TelegramAPI {
  static initMiniApp() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      return true;
    }
    return false;
  }

  static getUserData() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      return window.Telegram.WebApp.initDataUnsafe?.user || null;
    }
    return null;
  }

  static closeApp() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  }

  static openTelegramLink(url: string) {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  }

  static shareAchievement(title: string, points: number) {
    const shareText = `🎉 I just completed "${title}" on Recertify Mini and earned ${points} points! Join me in learning Web3. 🚀`;
    const telegramBotUrl = `https://t.me/share/url?url=https://t.me/recertify_mini_bot&text=${encodeURIComponent(shareText)}`;
    this.openTelegramLink(telegramBotUrl);
  }

  static inviteFriend() {
    const inviteText = 'Join me on Recertify Mini! Learn Web3 and blockchain through interactive quizzes and projects. 🚀';
    const botLink = `https://t.me/recertify_mini_bot/app`;
    const shareUrl = `https://t.me/share/url?url=${botLink}&text=${encodeURIComponent(inviteText)}`;
    this.openTelegramLink(shareUrl);
  }

  static setMainButtonAction(text: string, callback: () => void) {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.setText(text);
      window.Telegram.WebApp.MainButton.onClick(callback);
      window.Telegram.WebApp.MainButton.show();
    }
  }

  static hideMainButton() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.hide();
    }
  }
}

/**
 * TON Wallet Integration
 */
export class TONWalletAPI {
  static async connectWallet() {
    try {
      // Check if TonConnect is available
      if (typeof window !== 'undefined' && (window as any).tonConnect) {
        const tonConnect = (window as any).tonConnect;
        await tonConnect.beginConnection();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting TON wallet:', error);
      return false;
    }
  }

  static async getWalletAddress() {
    try {
      if (typeof window !== 'undefined' && (window as any).tonConnect) {
        const tonConnect = (window as any).tonConnect;
        const wallet = await tonConnect.wallet();
        return wallet?.address || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      return null;
    }
  }

  static async sendRewardTransaction(wallet: string, points: number) {
    try {
      // This would integrate with a backend that handles token distribution
      const response = await fetch('/api/rewards/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          points,
          timestamp: new Date().toISOString(),
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error sending reward:', error);
      return false;
    }
  }
}

/**
 * Analytics and Tracking for Telegram Mini App
 */
export class TelegramAnalytics {
  static trackEvent(eventName: string, params?: Record<string, any>) {
    if (typeof window !== 'undefined') {
      // Send to backend analytics
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          params,
          timestamp: new Date().toISOString(),
          user: TelegramAPI.getUserData(),
        }),
      }).catch(() => {
        // Silently fail
      });
    }
  }

  static trackQuizCompleted(quizId: string, score: number) {
    this.trackEvent('quiz_completed', { quizId, score });
  }

  static trackProjectCompleted(projectId: string) {
    this.trackEvent('project_completed', { projectId });
  }

  static trackTaskCompleted(taskId: string) {
    this.trackEvent('task_completed', { taskId });
  }
}
