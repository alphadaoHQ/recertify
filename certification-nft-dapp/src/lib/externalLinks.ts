/**
 * External links and resources configuration
 * Centralized location for social media, tutorials, and external URLs
 */

export const EXTERNAL_LINKS = {
  // Social Media
  twitter: "https://x.com/Alpha_Daos",
  telegram: "https://t.me/AlphaDAOs",
  telegramUsername: "AlphaDAOs", // Telegram username for referral links

  // Tutorial videos
  tutorialVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // TODO: Replace with actual tutorial URL
  nftGuide: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // TODO: Replace with actual NFT guide

  // Documentation
  docs: "https://docs.example.com",
  faq: "https://example.com/faq",

  // Referral links (with base URL) - kept for backward compatibility
  referralBase: "https://certification-nft.example.com",
} as const;

/**
 * Generate a Telegram-style referral link using a referral code
 * Format: t.me/AlphaDAOs/{referralCode}
 */
export function generateTelegramReferralLink(referralCode: string): string {
  if (!referralCode) {
    return EXTERNAL_LINKS.telegram; // Fallback to group link if no code
  }
  return `https://t.me/${EXTERNAL_LINKS.telegramUsername}/${referralCode}`;
}

/**
 * Generate a shareable referral link for a user (legacy function for backward compatibility)
 * @deprecated Use generateTelegramReferralLink with referral code instead
 */
export function generateReferralLink(userAddress: string): string {
  return `${EXTERNAL_LINKS.referralBase}?ref=${userAddress}`;
}

/**
 * Generate share text for social media
 */
export function generateShareText(referralLink: string): string {
  return `Join me on the Alpha DAOs certification NFT dApp! 🚀\n\nEarn rewards by completing tasks and minting certificates.\n\nUse my referral link: ${referralLink}\n\n#web3 #blockchain #nft`;
}

/**
 * Open external link with fallback to clipboard
 */
export async function shareOrCopyLink(
  link: string,
  text: string,
): Promise<void> {
  try {
    // Try native Web Share API first
    if (navigator.share) {
      await navigator.share({
        title: "Alpha DAOs Certification NFT",
        text: text,
        url: link,
      });
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(link);
      console.log("Link copied to clipboard");
    }
  } catch (err) {
    console.warn("Share failed, attempting clipboard fallback:", err);
    try {
      await navigator.clipboard.writeText(link);
    } catch (clipboardErr) {
      console.error("Clipboard copy also failed:", clipboardErr);
    }
  }
}
