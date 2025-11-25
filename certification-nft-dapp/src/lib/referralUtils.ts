/**
 * Utility functions for generating and managing referral codes
 */

/**
 * Generate a unique alphanumeric referral code
 * Format: 8 characters using uppercase letters and numbers (0-9, A-Z)
 * Example: "A1B2C3D4"
 */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate referral code format (8 alphanumeric characters)
 */
export function isValidReferralCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}

