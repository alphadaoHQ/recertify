export function calculateLevel(points: number) {
  // simple level formula: every 500 points => level up
  return Math.max(1, Math.floor(points / 500) + 1);
}

export function completionRate(totalTasks: number, completedTasks: number) {
  if (totalTasks <= 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}
