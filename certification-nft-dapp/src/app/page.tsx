"use client";
import { useTonAddress } from "@tonconnect/ui-react";
import { useState, useEffect, useRef } from "react";
import { useContractState } from "@/hooks/useContractState";
import { Header } from "@/components/Header";
import { WelcomeModal } from "@/components/WelcomeModal";
import { HomeTab } from "@/components/HomeTab";
import { GalleryTab } from "@/components/GalleryTab";
import { TasksTab } from "@/components/TasksTabRealtime";
import { AdminTab } from "@/components/AdminTab";
import { TabBar } from "@/components/TabBar";
import dynamic from "next/dynamic";
const RewardsTab = dynamic(() => import("@/components/RewardsTab"), {
  ssr: false,
  loading: () => <div className="p-4">Loading rewards...</div>,
});

export default function Home() {
  const userAddress = useTonAddress();
  const { isOwner, isAdmin, refetch } = useContractState();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState({
    blockchain: false,
    ton: false,
    nfts: false,
  });
  const [showAlphaNotification, setShowAlphaNotification] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
  };

  const completedCourses = Object.values(courseProgress).filter(Boolean).length;
  const totalCourses = Object.keys(courseProgress).length;
  const progressPercentage = (completedCourses / totalCourses) * 100;

  const handleTransactionSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
    setTimeout(refetch, 3000);
  };

  const handleDisconnect = () => {
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
    } catch (_e) {}
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
  const handleCloseAlphaNotification = () => {
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
  }, [showAlphaNotification]);

  return (
    <div
      className={`min-h-screen antialiased transition-colors duration-300 ${
        isDarkMode
          ? "bg-[#15202b] text-white"
          : "bg-white text-[#14171a]"
      } max-w-md mx-auto relative overflow-y-auto`}
    >
      <WelcomeModal
        isDarkMode={isDarkMode}
        showWelcomeModal={showWelcomeModal}
        setShowWelcomeModal={setShowWelcomeModal}
      />

      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        {/* Tab Content */}
        <div className="telegram-tab-content min-h-[calc(100vh-140px)]">
          {activeTab === 'home' && (
            <HomeTab
              isDarkMode={isDarkMode}
              isTransitioning={isTransitioning}
              previousTab={previousTab}
              handleTabChange={handleTabChange}
              courseProgress={courseProgress}
              handleMarkAsRead={handleMarkAsRead}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksTab
              isDarkMode={isDarkMode}
              isTransitioning={isTransitioning}
              previousTab={previousTab}
              userAddress={userAddress}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryTab
              isDarkMode={isDarkMode}
              isTransitioning={isTransitioning}
              previousTab={previousTab}
            />
          )}

          {activeTab === 'rewards' && (
            <RewardsTab userAddress={userAddress} />
          )}

          {activeTab === 'admin' && (
            <AdminTab
              isDarkMode={isDarkMode}
              isTransitioning={isTransitioning}
              previousTab={previousTab}
              userAddress={userAddress}
              isAdmin={isAdmin}
              isOwner={isOwner}
              handleTransactionSuccess={handleTransactionSuccess}
            />
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