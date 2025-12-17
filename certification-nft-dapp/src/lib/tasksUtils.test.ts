import { describe, expect, it } from "vitest";
import { calculateLevel, completionRate } from "./tasksUtils";

describe("tasksUtils", () => {
  it("calculates level correctly", () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(499)).toBe(1);
    expect(calculateLevel(500)).toBe(2);
    expect(calculateLevel(1500)).toBe(4);
  });

  it("calculates completion rate", () => {
    expect(completionRate(0, 0)).toBe(0);
    expect(completionRate(5, 0)).toBe(0);
    expect(completionRate(5, 1)).toBe(20);
    expect(completionRate(3, 2)).toBe(67);
  });
});
