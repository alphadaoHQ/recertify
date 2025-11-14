/**
 * API route for verifying task completions
 * POST /api/verify-task
 *
 * Body:
 * {
 *   userAddress: string;
 *   taskId: string;
 *   verificationType: 'twitter' | 'telegram' | 'nft_mint' | 'referral';
 *   metadata?: { [key: string]: any };
 * }
 */

import {
  verifyNFTMint,
  verifyReferral,
  verifyTelegramJoin,
  verifyTwitterFollow,
} from "@/lib/taskVerification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, taskId, verificationType, metadata } = body;

    if (!userAddress || !taskId || !verificationType) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    let result: { success: boolean; message: string };

    switch (verificationType) {
      case "twitter":
        result = await verifyTwitterFollow(userAddress);
        break;
      case "telegram":
        result = await verifyTelegramJoin(userAddress);
        break;
      case "nft_mint":
        result = await verifyNFTMint(userAddress);
        break;
      case "referral":
        if (!metadata?.referredAddress) {
          return Response.json(
            {
              success: false,
              message: "Missing referred address for referral verification",
            },
            { status: 400 },
          );
        }
        result = await verifyReferral(userAddress, metadata.referredAddress);
        break;
      default:
        return Response.json(
          { success: false, message: "Unknown verification type" },
          { status: 400 },
        );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Task verification error:", error);
    return Response.json(
      { success: false, message: "Verification failed" },
      { status: 500 },
    );
  }
}
