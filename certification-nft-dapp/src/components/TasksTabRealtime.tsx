'use client';
import { CheckCircle2, Circle, Sparkles, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useAnimateOnScroll } from '@/hooks/useAnimateOnScroll';
import { StreakDisplay } from '@/components/StreakDisplay';
import { EXTERNAL_LINKS, generateTelegramReferralLink, generateShareText, shareOrCopyLink } from '@/lib/externalLinks';
import { isInTelegram, openExternalLink, shareUrl, triggerHapticFeedback } from '@/lib/telegram';
import {
  getTodayDateString,
  hasCheckedInToday,
  loadUserStats,
  saveUserStats,
  shouldResetCheckIn,
  getOrCreateReferralCode,
  recordPointClaim,
} from '@/lib/supabaseService';

const RewardsTab = dynamic(() => import('@/components/RewardsTab'), {
  ssr: false,
  loading: () => <div className="p-3">Loading rewards...</div>,
});

type Category = 'All' | 'Social' | 'Engagement' | 'Learning' | 'Referral';
type Frequency = 'Daily' | 'Weekly' | 'Special';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: Exclude<Category, 'All'>;
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
  userAddress?: string | null;
}

export function TasksTab({ isDarkMode, isTransitioning, previousTab, userAddress }: TasksTabProps) {
  const [categoryFilter, setCategoryFilter] = useState<Category>('All');
  // Note: Category filter is set to "All" and not used for filtering, as per user request to display all tasks without categories

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 's1',
      title: 'Follow on Twitter',
      description: 'Follow our official Twitter account',
      reward: 50,
      category: 'Social',
      frequency: 'Special',
      completed: false,
      claimed: false,
      progress: 0,
      action: 'twitter',
    },
    {
      id: 's2',
      title: 'Join Telegram',
      description: 'Join our Telegram community',
      reward: 50,
      category: 'Social',
      frequency: 'Special',
      completed: false,
      claimed: false,
      progress: 0,
      action: 'telegram',
    },
    {
      id: 'e1',
      title: 'Daily Check-in',
      description: 'Open the app and check in today',
      reward: 10, // Base reward, will be modified by streak bonus
      category: 'Engagement',
      frequency: 'Daily',
      completed: false,
      claimed: false,
      progress: 0,
      action: 'checkin',
    },
    {
      id: 'e2',
      title: 'View Certificates',
      description: 'View 5 certificates in the gallery',
      reward: 20,
      category: 'Engagement',
      frequency: 'Weekly',
      completed: false,
      claimed: false,
      progress: 0,
      action: 'view',
    },
    {
      id: 'l1',
      title: 'Watch Tutorial',
      description: 'Watch the beginner tutorial video',
      reward: 100,
      category: 'Learning',
      frequency: 'Special',
      completed: false,
      claimed: false,
      progress: 0,
      action: 'watch',
    },
    {
      id: 'r1',
      title: 'Invite a Friend',
      description: 'Invite someone who signs up',
      reward: 150,
      category: 'Referral',
      frequency: 'Special',
      completed: false,
      claimed: false,
      progress: 0,
      action: 'referral',
    },
  ]);

  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [dailyStreak, setDailyStreak] = useState<number>(3);
  const [lastCheckinDate, setLastCheckinDate] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useAnimateOnScroll();

  useEffect(() => {
    // compute total claimed points
    const claimed = tasks.filter((t) => t.claimed).reduce((s, t) => s + t.reward, 0);
    setTotalPoints(claimed);
  }, [tasks]);

  useEffect(() => {
    // load from supabase or localStorage when userAddress available
    async function load() {
      setIsLoading(true);
      if (!userAddress) {
        setIsLoading(false);
        return;
      }

      const stats = await loadUserStats(userAddress);
      if (stats) {
        setTotalPoints(stats.points || 0);
        setDailyStreak(stats.daily_streak || 0);
        setLastCheckinDate(stats.last_checkin);
        if (Array.isArray(stats.claimed_task_ids)) {
          setTasks((prev) =>
            prev.map((t) => ({
              ...t,
              claimed: stats.claimed_task_ids.includes(t.id),
            })),
          );
        }

        // Reset daily check-in task if new day
        if (shouldResetCheckIn(stats.last_checkin)) {
          setTasks((prev) =>
            prev.map((t) => (t.id === 'e1' ? { ...t, completed: false, claimed: false, progress: 0 } : t)),
          );
        }
      }
      setIsLoading(false);
    }

    load();
  }, [userAddress]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionRate = Math.round((completedCount / tasks.length) * 100);

  const filteredTasks = tasks; // Display all tasks without category filtering

  const level = Math.max(1, Math.floor(totalPoints / 500) + 1);
  const [showRewards, setShowRewards] = useState(false);

  // Calculate dynamic check-in reward based on streak
  const getCheckinReward = () => {
    const baseReward = 10;
    if (dailyStreak >= 7) {
      return baseReward * 2; // 100% bonus for 7+ day streak
    } else if (dailyStreak >= 3) {
      return Math.round(baseReward * 1.5); // 50% bonus for 3+ day streak
    }
    return baseReward;
  };

  async function persistUserStats(address: string) {
    const claimedTaskIds = tasks.filter((t) => t.claimed).map((t) => t.id);
    const points = tasks.filter((t) => t.claimed).reduce((s, t) => s + t.reward, 0);
    const today = getTodayDateString();

    // Update local state
    setTotalPoints(points);
    setLastCheckinDate(today);

    // Save to both localStorage and Supabase
    await saveUserStats(address, {
      points,
      daily_streak: dailyStreak,
      claimed_task_ids: claimedTaskIds,
      last_checkin: today,
    });
  }

  function openLink(url: string) {
    if (isInTelegram()) {
      openExternalLink(url);
    } else {
      try {
        window.open(url, '_blank');
      } catch (_e) { }
    }
  }

  async function startTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    switch (task.action) {
      case 'twitter':
        openLink(EXTERNAL_LINKS.twitter);
        break;
      case 'telegram':
        openLink(EXTERNAL_LINKS.telegram);
        break;
      case 'watch':
        openLink(EXTERNAL_LINKS.tutorialVideo);
        break;
      case 'view': {
        const el = document.getElementById('certificate-gallery');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'referral':
        if (userAddress) {
          // Get or create referral code for the user
          const referralCode = await getOrCreateReferralCode(userAddress);
          if (referralCode) {
            const referralLink = generateTelegramReferralLink(referralCode);
            const shareText = generateShareText(referralLink);
            if (isInTelegram()) {
              shareUrl(referralLink, shareText);
            } else {
              await shareOrCopyLink(referralLink, shareText);
            }
          } else {
            console.error('Failed to generate referral code');
          }
        }
        break;
      case 'checkin':
        // Only allow one check-in per day
        if (!hasCheckedInToday(lastCheckinDate)) {
          // Check if this is a consecutive day (yesterday was the last check-in)
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          const isConsecutive = lastCheckinDate === yesterdayStr;

          if (isConsecutive) {
            setDailyStreak((s) => s + 1);
          } else {
            // Reset streak if not consecutive
            setDailyStreak(1);
          }
        }
        break;
      default:
        break;
    }

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true, progress: 100 } : t)));
  }

  async function claimTask(id: string) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    if (!t.completed || t.claimed) return;

    // Add haptic feedback for claiming tasks in Telegram
    if (isInTelegram()) {
      triggerHapticFeedback('medium');
    }

    // Calculate streak bonus for daily check-in
    let bonusMultiplier = 1;
    let bonusMessage = '';
    if (t.id === 'e1') {
      // Daily Check-in task
      if (dailyStreak >= 7) {
        bonusMultiplier = 2.0; // 100% bonus for 7+ day streak
        bonusMessage = '🔥 7-Day Streak Bonus!';
      } else if (dailyStreak >= 3) {
        bonusMultiplier = 1.5; // 50% bonus for 3+ day streak
        bonusMessage = '✨ Streak Bonus!';
      }
    }

    const finalReward = Math.round(t.reward * bonusMultiplier);

    // Update task with final reward for display
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, claimed: true, reward: finalReward } : x)));

    if (userAddress) {
      // Update points calculation to include bonus
      const claimedTaskIds = tasks.filter((task) => task.claimed || task.id === id).map((task) => task.id);
      const points = tasks
        .filter((task) => task.claimed || task.id === id)
        .reduce((s, task) => {
          if (task.id === id) {
            return s + finalReward; // Use the bonus-adjusted reward
          }
          return s + task.reward;
        }, 0);

      const today = getTodayDateString();

      // Save to both localStorage and Supabase
      await saveUserStats(userAddress, {
        points,
        daily_streak: dailyStreak,
        claimed_task_ids: claimedTaskIds,
        last_checkin: today,
      });

      // Record the claim to point_claims table for audit trail
      const claimType = t.id === 'e1' ? 'daily_checkin' : 'task';
      await recordPointClaim(
        userAddress,
        claimType,
        t.id,
        finalReward,
        bonusMultiplier,
        {
          task_title: t.title,
          task_category: t.category,
          task_frequency: t.frequency,
          streak_day: t.id === 'e1' ? dailyStreak : undefined,
        }
      );

      // Show bonus notification if applicable
      if (bonusMessage && isInTelegram()) {
        // Could add a toast notification here
        console.log(`${bonusMessage} +${finalReward} points!`);
      }

      // award first-claim achievement via server API
      try {
        await fetch(`/api/award-achievement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userAddress, achievementId: 'first_claim' }),
        });
      } catch (_e) { }

      // If this was the "View Certificates" task, award certificate viewer badge
      if (t.id === 'e2') {
        try {
          await fetch(`/api/award-achievement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress, achievementId: 'cert_viewer' }),
          });
        } catch (_e) { }
      }

      // Award 7-day streak badge if streak threshold met
      try {
        if (dailyStreak >= 7) {
          await fetch(`/api/award-achievement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress, achievementId: 'streak_7' }),
          });
        }
      } catch (_e) { }
    }
  }

  function renderBadge(frequency: Frequency) {
    const base = 'inline-block text-xs px-3 py-1 rounded-full font-medium';
    if (frequency === 'Daily')
      return (
        <span
          className={`${base} ${isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}
        >
          Daily
        </span>
      );
    if (frequency === 'Weekly')
      return (
        <span
          className={`${base} ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}
        >
          Weekly
        </span>
      );
    return (
      <span
        className={`${base} ${isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}
      >
        Special
      </span>
    );
  }

  return (
    <div
      className={`transition-all duration-300 ${isTransitioning && previousTab === 'tasks' ? 'opacity-50' : 'opacity-100'}`}
    >
      {/* Stats Dashboard */}
      <div
        className={`mx-4 mt-4 mb-6 rounded-3xl p-6 shadow-lg ${isDarkMode
          ? 'bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl border border-purple-700/50'
          : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
          }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Stats</h3>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Overview of your progress
            </p>
          </div>

          <div className="text-right">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Level</p>
            <p className={`font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{level}</p>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowRewards((s) => !s)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all hover:scale-105 ${isDarkMode
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/25'
              : 'bg-blue-600 text-white shadow-sm'
              }`}
          >
            {showRewards ? 'Back to Tasks' : 'Rewards'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-2xl ${isDarkMode
              ? 'bg-gradient-to-br from-purple-800/60 to-blue-800/60 border border-purple-600/30'
              : 'bg-gray-50/80 border border-gray-200/50'
              }`}
          >
            <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Points
            </p>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {totalPoints}
              </span>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl ${isDarkMode
              ? 'bg-gradient-to-br from-purple-800/60 to-blue-800/60 border border-purple-600/30'
              : 'bg-gray-50/80 border border-gray-200/50'
              }`}
          >
            <StreakDisplay
              streak={dailyStreak}
              lastCheckinDate={lastCheckinDate}
              isDarkMode={isDarkMode}
              compact={true}
            />
          </div>

          <div
            className={`p-4 rounded-2xl ${isDarkMode
              ? 'bg-gradient-to-br from-purple-800/60 to-blue-800/60 border border-purple-600/30'
              : 'bg-gray-50/80 border border-gray-200/50'
              }`}
          >
            <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Completion Rate
            </p>
            <div className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {completionRate}%
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl ${isDarkMode
              ? 'bg-gradient-to-br from-purple-800/60 to-blue-800/60 border border-purple-600/30'
              : 'bg-gray-50/80 border border-gray-200/50'
              }`}
          >
            <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tasks
            </p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white font-medium">
                All Tasks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks list or Rewards tab */}
      {showRewards ? (
        <div className="mt-2">
          <RewardsTab userAddress={userAddress} isDarkMode={isDarkMode} />
        </div>
      ) : (
        <div className="px-4 space-y-4">
          {isLoading
            ? // Loading placeholders - iOS style
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className={`p-6 rounded-3xl shadow-lg animate-pulse ${isDarkMode
                  ? 'bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-xl border border-purple-700/50'
                  : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="pt-1 flex-shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-3/4`}
                      />
                      <div
                        className={`h-5 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-16`}
                      />
                    </div>
                    <div
                      className={`h-3 rounded mb-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-1/2`}
                    />
                    <div
                      className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} w-full`}
                    />
                  </div>
                  <div className="flex-shrink-0 text-right pt-1 flex flex-col items-end gap-2">
                    <div
                      className={`h-4 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-12`}
                    />
                    <div
                      className={`h-8 rounded-lg mt-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-16`}
                    />
                  </div>
                </div>
              </div>
            ))
            : filteredTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => !task.completed ? startTask(task.id) : !task.claimed ? claimTask(task.id) : null}
                className={`w-full px-4 py-3 rounded-full transition-all duration-200 border flex items-center gap-3 hover:border-purple-500/60 ${task.completed
                    ? task.claimed
                      ? 'border-gray-600/40 bg-gray-800/30'
                      : 'border-purple-500/50 bg-purple-500/10'
                    : isDarkMode
                      ? 'bg-[#0d0d0d] border-[#2f3336] hover:bg-[#1a1a1a]'
                      : 'bg-white border-[#e6edf2] hover:bg-gray-50'
                  }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${task.completed
                    ? 'bg-purple-500/20'
                    : isDarkMode
                      ? 'bg-[#1a1a1a]'
                      : 'bg-gray-100'
                  }`}>
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0 text-left">
                  <h4
                    className={`font-medium text-xs truncate ${task.completed
                        ? task.claimed
                          ? 'text-gray-500 line-through'
                          : 'text-white'
                        : isDarkMode
                          ? 'text-white'
                          : 'text-[#14171a]'
                      }`}
                  >
                    {task.title}
                  </h4>
                </div>

                {/* Points */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span
                    className={`font-semibold text-xs ${task.completed
                        ? task.claimed
                          ? 'text-gray-500'
                          : 'text-purple-400'
                        : 'text-white'
                      }`}
                  >
                    +{task.id === 'e1' && !task.claimed ? getCheckinReward() : task.reward}
                  </span>
                </div>
              </button>
            ))}
        </div>
      )}

      {/* Completed Message */}
      {completedCount === tasks.length && !isLoading && (
        <div
          className={`mx-4 mt-6 p-6 rounded-3xl text-center shadow-lg ${isDarkMode
            ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-700/50'
            : 'bg-blue-50/80 backdrop-blur-xl border border-blue-200/50'
            }`}
        >
          <p className={`font-bold text-xl ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`}>
            🎉 All tasks completed! Keep checking back for new challenges.
          </p>
        </div>
      )}
    </div>
  );
}
