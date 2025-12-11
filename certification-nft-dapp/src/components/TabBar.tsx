import {
  Award,
  Brain,
  CheckSquare,
  Grid3X3,
  Home as HomeIcon,
  Trophy,
} from "lucide-react";

interface TabBarProps {
  isDarkMode: boolean;
  activeTab: string;
  handleTabChange: (tab: string) => void;
}

export function TabBar({
  isDarkMode,
  activeTab,
  handleTabChange,
}: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--tg-theme-bottom-bar-bg-color)] backdrop-blur-xl safe-area-inset-bottom">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-around">
          {/* Hub Tab */}
          <button
            onClick={() => handleTabChange("home")}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
              activeTab === "home"
                ? "text-[var(--tg-theme-button-text-color)]"
                : "text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)]"
            }`}
          >
            {activeTab === "home" && (
              <div className="absolute -inset-2 bg-[var(--tg-theme-button-color)] rounded-full shadow-lg shadow-[var(--tg-theme-button-color)]/50" />
            )}
            <div
              className={`relative z-10 flex flex-col items-center p-2 rounded-full transition-all duration-300 ${
                activeTab !== "home"
                  ? "hover:bg-[var(--tg-theme-secondary-bg-color)]"
                  : ""
              }`}
            >
              <HomeIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Hub</span>
            </div>
          </button>

          {/* Task Tab */}
          <button
            onClick={() => handleTabChange("tasks")}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
              activeTab === "tasks"
                ? "text-[var(--tg-theme-button-text-color)]"
                : "text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)]"
            }`}
          >
            {activeTab === "tasks" && (
              <div className="absolute -inset-2 bg-[var(--tg-theme-button-color)] rounded-full shadow-lg shadow-[var(--tg-theme-button-color)]/50" />
            )}
            <div
              className={`relative z-10 flex flex-col items-center p-2 rounded-full transition-all duration-300 ${
                activeTab !== "tasks"
                  ? "hover:bg-[var(--tg-theme-secondary-bg-color)]"
                  : ""
              }`}
            >
              <CheckSquare className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Task</span>
            </div>
          </button>

          {/* Quiz Tab */}
          <button
            onClick={() => handleTabChange("quiz")}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
              activeTab === "quiz"
                ? "text-[var(--tg-theme-button-text-color)]"
                : "text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)]"
            }`}
          >
            {activeTab === "quiz" && (
              <div className="absolute -inset-2 bg-[var(--tg-theme-button-color)] rounded-full shadow-lg shadow-[var(--tg-theme-button-color)]/50" />
            )}
            <div
              className={`relative z-10 flex flex-col items-center p-2 rounded-full transition-all duration-300 ${
                activeTab !== "quiz"
                  ? "hover:bg-[var(--tg-theme-secondary-bg-color)]"
                  : ""
              }`}
            >
              <Brain className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Quiz</span>
            </div>
          </button>

          {/* Rewards Tab */}
          <button
            onClick={() => handleTabChange("rewards")}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
              activeTab === "rewards"
                ? "text-[var(--tg-theme-button-text-color)]"
                : "text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)]"
            }`}
          >
            {activeTab === "rewards" && (
              <div className="absolute -inset-2 bg-[var(--tg-theme-button-color)] rounded-full shadow-lg shadow-[var(--tg-theme-button-color)]/50" />
            )}
            <div
              className={`relative z-10 flex flex-col items-center p-2 rounded-full transition-all duration-300 ${
                activeTab !== "rewards"
                  ? "hover:bg-[var(--tg-theme-secondary-bg-color)]"
                  : ""
              }`}
            >
              <Award className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Rewards</span>
            </div>
          </button>

          {/* Gallery Tab */}
          <button
            onClick={() => handleTabChange("gallery")}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
              activeTab === "gallery"
                ? "text-[var(--tg-theme-button-text-color)]"
                : "text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)]"
            }`}
          >
            {activeTab === "gallery" && (
              <div className="absolute -inset-2 bg-[var(--tg-theme-button-color)] rounded-full shadow-lg shadow-[var(--tg-theme-button-color)]/50" />
            )}
            <div
              className={`relative z-10 flex flex-col items-center p-2 rounded-full transition-all duration-300 ${
                activeTab !== "gallery"
                  ? "hover:bg-[var(--tg-theme-secondary-bg-color)]"
                  : ""
              }`}
            >
              <Grid3X3 className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Gallery</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
