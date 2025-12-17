"use client";
import { CheckCircle2, Circle, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

type Category = "All" | "Social" | "Engagement" | "Learning" | "Referral";
type Frequency = "Daily" | "Weekly" | "Special";

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: Exclude<Category, "All">;
  frequency: Frequency;
  completed: boolean;
  claimed: boolean;
  progress: number; // 0-100 for multi-step tasks
  action?: string;
}

interface TasksTabProps {
  isDarkMode: boolean;
  isTransitioning: boolean;
  previousTab: string | null;
}

export function TasksTab({
  isDarkMode,
  isTransitioning,
  previousTab,
}: TasksTabProps) {
  const [categoryFilter, setCategoryFilter] = useState<Category>("All");

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "s1",
      title: "Follow on Twitter",
      description: "Follow our official Twitter account",
      reward: 50,
      category: "Social",
      frequency: "Special",
      completed: false,
      claimed: false,
      progress: 0,
      action: "twitter",
    },
    {
      id: "s2",
      title: "Join Telegram",
      description: "Join our Telegram community",
      reward: 50,
      category: "Social",
      frequency: "Special",
      completed: false,
      claimed: false,
      progress: 0,
      action: "telegram",
    },
    {
      id: "e1",
      title: "Daily Check-in",
      description: "Open the app and check in today",
      reward: 10,
      category: "Engagement",
      frequency: "Daily",
      completed: false,
      claimed: false,
      progress: 0,
      action: "checkin",
    },
    {
      id: "e2",
      title: "View Certificates",
      description: "View 5 certificates in the gallery",
      reward: 20,
      category: "Engagement",
      frequency: "Weekly",
      completed: false,
      claimed: false,
      progress: 0,
      action: "view",
    },
    {
      id: "l1",
      title: "Watch Tutorial",
      description: "Watch the beginner tutorial video",
      reward: 100,
      category: "Learning",
      frequency: "Special",
      completed: false,
      claimed: false,
      progress: 0,
      action: "watch",
    },
    {
      id: "r1",
      title: "Invite a Friend",
      description: "Invite someone who signs up",
      reward: 150,
      category: "Referral",
      frequency: "Special",
      completed: false,
      claimed: false,
      progress: 0,
      action: "referral",
    },
  ]);

  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [dailyStreak, _setDailyStreak] = useState<number>(3); // example

  useEffect(() => {
    // compute total claimed points
    const claimed = tasks
      .filter((t) => t.claimed)
      .reduce((s, t) => s + t.reward, 0);
    setTotalPoints(claimed);
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionRate = Math.round((completedCount / tasks.length) * 100);

  const filteredTasks =
    categoryFilter === "All"
      ? tasks
      : tasks.filter((t) => t.category === categoryFilter);

  const level = Math.max(1, Math.floor(totalPoints / 500) + 1);

  function startTask(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              progress: 100,
              completed: true,
            }
          : t,
      ),
    );
  }

  function claimTask(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id && t.completed && !t.claimed ? { ...t, claimed: true } : t,
      ),
    );
  }

  function renderBadge(frequency: Frequency) {
    const base = "inline-block text-xs px-2 py-0.5 rounded-full font-semibold";
    if (frequency === "Daily")
      return (
        <span className={`${base} bg-green-100 text-green-700`}>Daily</span>
      );
    if (frequency === "Weekly")
      return (
        <span className={`${base} bg-blue-100 text-blue-700`}>Weekly</span>
      );
    return (
      <span className={`${base} bg-purple-100 text-purple-700`}>Special</span>
    );
  }

  return (
    <div
      className={`transition-all duration-300 ${
        isTransitioning && previousTab === "tasks"
          ? "opacity-50"
          : "opacity-100"
      }`}
    >
      {/* Stats Dashboard */}
      <div className="rounded-2xl p-4 mb-4 border bg-gradient-to-r from-purple-700 via-purple-500 to-purple-950">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3
              className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#14171a]"}`}
            >
              Stats
            </h3>
            <p
              className={`text-xs ${isDarkMode ? "text-[#8899a6]" : "text-[#536471]"}`}
            >
              Overview of your progress
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#8899a6]">Level</p>
            <p className="font-bold text-xl">{level}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border bg-opacity-40">
            <p className="text-xs text-[#8899a6]">Total Points</p>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-lg">{totalPoints}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-opacity-40">
            <p className="text-xs text-[#8899a6]">Daily Streak</p>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span className="font-bold text-lg">{dailyStreak}d</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-opacity-40">
            <p className="text-xs text-[#8899a6]">Completion Rate</p>
            <div className="flex items-center gap-2">
              <div className="font-bold text-lg">{completionRate}%</div>
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-opacity-40">
            <p className="text-xs text-[#8899a6]">Categories</p>
            <div className="flex gap-2 mt-1">
              {(
                [
                  "All",
                  "Social",
                  "Engagement",
                  "Learning",
                  "Referral",
                ] as Category[]
              ).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`text-xs px-2 py-1 rounded-full border ${
                    categoryFilter === c
                      ? "bg-[#1da1f2] text-white border-transparent"
                      : "bg-transparent text-[#536471]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks list */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-xl transition-all duration-200 border ${task.completed ? "border-[#1da1f2]/40 bg-[#1da1f2]/8" : isDarkMode ? "bg-[#192734] border-[#2f3336]" : "bg-white border-[#e6edf2]"}`}
          >
            <div className="flex items-start gap-3">
              <div className="pt-1 flex-shrink-0">
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-[#1da1f2]" />
                ) : (
                  <Circle
                    className={`w-6 h-6 ${isDarkMode ? "text-[#536471]" : "text-[#bcc7cf]"}`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-semibold text-sm ${task.completed ? "text-[#1da1f2] line-through" : isDarkMode ? "text-white" : "text-[#14171a]"}`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {renderBadge(task.frequency)}
                  </div>
                </div>
                <p
                  className={`text-xs mt-1 ${isDarkMode ? "text-[#8899a6]" : "text-[#536471]"}`}
                >
                  {task.description}
                </p>

                {/* Progress bar (if needed) */}
                <div className="mt-3">
                  <div
                    className={`${isDarkMode ? "bg-[#2f3336]" : "bg-[#e6edf2]"} h-2 rounded-full overflow-hidden`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-[#1da1f2] to-[#6366f1] transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 text-right pt-1 flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 justify-end">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span
                    className={`font-bold text-sm ${task.completed ? "text-[#1da1f2]" : "text-yellow-400"}`}
                  >
                    +{task.reward}
                  </span>
                </div>

                {/* Action button */}
                {!task.completed && (
                  <button
                    onClick={() => startTask(task.id)}
                    className={`mt-2 px-3 py-1 text-xs rounded-md font-semibold ${isDarkMode ? "bg-[#1da1f2] text-white" : "bg-[#1da1f2] text-white"}`}
                  >
                    Start
                  </button>
                )}

                {task.completed && !task.claimed && (
                  <button
                    onClick={() => claimTask(task.id)}
                    className={`mt-2 px-3 py-1 text-xs rounded-md font-semibold ${isDarkMode ? "bg-yellow-400 text-black" : "bg-yellow-400 text-black"}`}
                  >
                    Claim
                  </button>
                )}

                {task.claimed && (
                  <button
                    disabled
                    className="mt-2 px-3 py-1 text-xs rounded-md font-semibold bg-gray-200 text-gray-500"
                  >
                    Claimed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Message */}
      {completedCount === tasks.length && (
        <div
          className={`mt-6 p-4 rounded-xl text-center border-2 ${isDarkMode ? "bg-[#1da1f2]/10 border-[#1da1f2]/50" : "bg-[#1da1f2]/5 border-[#1da1f2]/30"}`}
        >
          <p
            className={`font-semibold ${isDarkMode ? "text-[#1da1f2]" : "text-[#1da1f2]"}`}
          >
            🎉 All tasks completed! Keep checking back for new challenges.
          </p>
        </div>
      )}
    </div>
  );
}
