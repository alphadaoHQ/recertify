import { beforeEach, describe, expect, it, vi } from "vitest";
import { verifyCertificateViews, verifyReferral } from "@/lib/taskVerification";

// Mock Supabase
vi.mock("@/lib/supabaseClient", () => ({
  default: {
    from: vi.fn(),
  },
}));

describe("taskVerification", () => {
  describe("verifyCertificateViews", () => {
    it("should return success when user has viewed 5 or more certificates", async () => {
      const result = await verifyCertificateViews("user123", 5);
      expect(result.success).toBe(true);
      expect(result.message).toContain("verified");
    });

    it("should return success when user has viewed more than 5 certificates", async () => {
      const result = await verifyCertificateViews("user123", 10);
      expect(result.success).toBe(true);
    });

    it("should return failure when user has not viewed 5 certificates", async () => {
      const result = await verifyCertificateViews("user123", 3);
      expect(result.success).toBe(false);
      expect(result.message).toContain("only viewed 3/5");
    });

    it("should return failure when user has viewed 0 certificates", async () => {
      const result = await verifyCertificateViews("user123", 0);
      expect(result.success).toBe(false);
    });
  });

  describe("verifyReferral", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should return success when referred user has completed tasks", async () => {
      const mockSupabase = await import("@/lib/supabaseClient").then(
        (m) => m.default,
      );
      vi.mocked(mockSupabase.from).mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { claimed_task_ids: ["task1", "task2"] },
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await verifyReferral("referrer123", "referred456");
      expect(result.success).toBe(true);
    });

    it("should return failure when referred user not found", async () => {
      const mockSupabase = await import("@/lib/supabaseClient").then(
        (m) => m.default,
      );
      vi.mocked(mockSupabase.from).mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: null,
              error: new Error("not found"),
            }),
          }),
        }),
      } as any);

      const result = await verifyReferral("referrer123", "nonexistent");
      expect(result.success).toBe(false);
      expect(result.message).toContain("not found");
    });

    it("should return failure when referred user has not completed any tasks", async () => {
      const mockSupabase = await import("@/lib/supabaseClient").then(
        (m) => m.default,
      );
      vi.mocked(mockSupabase.from).mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { claimed_task_ids: [] },
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await verifyReferral("referrer123", "referred456");
      expect(result.success).toBe(false);
      expect(result.message).toContain("not completed");
    });
  });
});
