"use client";
import { useTonAddress } from "@tonconnect/ui-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { GalleryTab } from "@/components/GalleryTab";
import { HomeTab } from "@/components/HomeTab";
import { QuizTab } from "@/components/QuizTab";
import { TabBar } from "@/components/TabBar";
import { TasksTab } from "@/components/TasksTabRealtime";
import { WalletGate } from "@/components/WalletGate";
import { WelcomeModal } from "@/components/WelcomeModal";
import { useContractState } from "@/hooks/useContractState";
import {
  getTelegramUser,
  isInTelegram,
  setTelegramTheme,
  triggerHapticFeedback,
} from "@/lib/telegram";

const RewardsTab = dynamic(() => import("@/components/RewardsTab"), {
  ssr: false,
  loading: () => <div className="p-4">Loading rewards...</div>,
});

export default function Home() {
  const userAddress = useTonAddress();
  const { refetch } = useContractState();
  const [_successMessage, setSuccessMessage] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState({
    blockchain: false,
    ton: false,
    nfts: false,
  });
  const [showAlphaNotification, setShowAlphaNotification] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);

  const autoGoTimer = useRef<number | null>(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    // Default to dark mode if no theme is saved
    if (!savedTheme || savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // Initialize Telegram integration
    if (isInTelegram()) {
      const tgUser = getTelegramUser();
      setTelegramUser(tgUser);
      setTelegramTheme(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Update Telegram theme if in Telegram
    if (isInTelegram()) {
      setTelegramTheme(newTheme);
    }
  };

  const completedCourses = Object.values(courseProgress).filter(Boolean).length;
  const totalCourses = Object.keys(courseProgress).length;
  const _progressPercentage = (completedCourses / totalCourses) * 100;

  const handleTransactionSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
    setTimeout(refetch, 3000);
  };

  const _handleDisconnect = () => {
    if (typeof window === "undefined") return;
    try {
      Object.keys(localStorage).forEach((key) => {
        const k = key.toLowerCase();
        if (
          k.includes("tonconnect") ||
          k.includes("ton-connect") ||
          k.includes("ton:")
        ) {
          localStorage.removeItem(key);
        }
      });
      localStorage.removeItem("tonconnect");
    } catch (_e) { }
    setTimeout(() => location.reload(), 150);
  };

  const handleMarkAsRead = (course: keyof typeof courseProgress) => {
    setCourseProgress((prev) => {
      const updated = { ...prev, [course]: true };
      // Check if all courses are completed
      if (Object.values(updated).every((complete) => complete)) {
        setTimeout(() => setShowAlphaNotification(true), 500);
      }
      return updated;
    });
  };

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab || isTransitioning) return;

    // Add haptic feedback for tab changes in Telegram
    if (isInTelegram()) {
      triggerHapticFeedback("light");
    }

    setPreviousTab(activeTab);
    setIsTransitioning(true);

    // Switch tab immediately to avoid perceived lag; keep the animation state for 300ms
    setActiveTab(newTab);
    setTimeout(() => {
      setIsTransitioning(false);
      setPreviousTab(null);
    }, 300);
  };

  // Auto-go after some seconds, allow cancel or immediate "Go"
  const _handleCloseAlphaNotification = () => {
    if (autoGoTimer.current) {
      clearTimeout(autoGoTimer.current);
      autoGoTimer.current = null;
    }
    setShowAlphaNotification(false);
  };

  const handleGoAlpha = () => {
    if (autoGoTimer.current) {
      clearTimeout(autoGoTimer.current);
      autoGoTimer.current = null;
    }
    const el = document.getElementById("certificate-gallery");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setShowAlphaNotification(false);
  };

  useEffect(() => {
    if (showAlphaNotification) {
      // auto-navigate after 6 seconds
      autoGoTimer.current = window.setTimeout(() => {
        handleGoAlpha();
      }, 6000);
    }
    return () => {
      if (autoGoTimer.current) {
        clearTimeout(autoGoTimer.current);
        autoGoTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlphaNotification, handleGoAlpha]);

  return (
    <div
      className={`min-h-screen antialiased transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        } max-w-md mx-auto relative overflow-y-auto`}
    >
      <WelcomeModal
        isDarkMode={isDarkMode}
        showWelcomeModal={showWelcomeModal}
        setShowWelcomeModal={setShowWelcomeModal}
      />

      <main className="flex-1 px-4 py-6 pb-28 overflow-y-auto">
        {/* Tab Content */}
        <div className="telegram-tab-content min-h-[calc(100vh-160px)]">
          {activeTab === "home" && (
            <HomeTab
              isDarkMode={isDarkMode}
              isTransitioning={isTransitioning}
              previousTab={previousTab}
              handleTabChange={handleTabChange}
              courseProgress={courseProgress}
              handleMarkAsRead={handleMarkAsRead}
              activeTab={activeTab}
              toggleTheme={toggleTheme}
              userAddress={userAddress}
            />
          )}

          {activeTab === "tasks" && (
            userAddress ? (
              <TasksTab
                isDarkMode={isDarkMode}
                isTransitioning={isTransitioning}
                previousTab={previousTab}
                userAddress={userAddress}
              />
            ) : (
              <WalletGate isDarkMode={isDarkMode} tabName="Tasks" />
            )
          )}

          {activeTab === "gallery" && (
            userAddress ? (
              <GalleryTab
                isDarkMode={isDarkMode}
                isTransitioning={isTransitioning}
                previousTab={previousTab}
              />
            ) : (
              <WalletGate isDarkMode={isDarkMode} tabName="Gallery" />
            )
          )}

          {activeTab === "quiz" && (
            userAddress ? (
              <QuizTab
                isDarkMode={isDarkMode}
                userAddress={userAddress}
                telegramUser={telegramUser}
              />
            ) : (
              <WalletGate isDarkMode={isDarkMode} tabName="Quiz" />
            )
          )}

          {activeTab === "rewards" && (
            userAddress ? (
              <RewardsTab userAddress={userAddress} isDarkMode={isDarkMode} />
            ) : (
              <WalletGate isDarkMode={isDarkMode} tabName="Rewards" />
            )
          )}
        </div>
      </main>

      <TabBar
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />
    </div>
  );
}
