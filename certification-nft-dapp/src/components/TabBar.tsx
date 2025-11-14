import { Home as HomeIcon, Grid3X3, Settings, CheckSquare, Award } from "lucide-react";

interface TabBarProps {
  isDarkMode: boolean;
  activeTab: string;
  handleTabChange: (tab: string) => void;
}

export function TabBar({ isDarkMode, activeTab, handleTabChange }: TabBarProps) {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t transition-colors duration-300 ${
      isDarkMode
        ? "bg-[#192734]/95 border-[#2f3336] backdrop-blur-xl"
        : "bg-white/95 border-[#e1e8ed] backdrop-blur-xl"
    }`}>
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {/* Home Tab */}
          <button
            onClick={() => handleTabChange('home')}
            className={`tab-hover flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] relative ${
              activeTab === 'home'
              ? `tab-active transform scale-110 ${
                  isDarkMode
                    ? "bg-purple-800/30 text-purple-300 border border-purple-700 shadow-md shadow-purple-900/30"
                    : "bg-purple-100 text-purple-950 border border-purple-200 shadow-md shadow-purple-200/60"
                }`
              : `${
                  isDarkMode
                    ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
                    : "text-purple-800 hover:text-purple-950 hover:bg-purple-100/70"
                } transition-all duration-300 rounded-xl`
            }`}
          >
            <HomeIcon className={`w-6 h-6 mb-1 transition-all duration-300 ${
              activeTab === 'home' ? "animate-pulse" : ""
            }`} />
            <span className="text-xs font-medium">Home</span>
            {activeTab === 'home' && (
              <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-colors duration-300 ${
                isDarkMode ? "bg-[#1da1f2]" : "bg-[#1da1f2]"
              }`} />
            )}
          </button>

          {/* Tasks Tab */}
          <button
            onClick={() => handleTabChange('tasks')}
            className={`tab-hover flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] relative ${
              activeTab === 'tasks'
                ? `tab-active transform scale-110 ${
                    isDarkMode
                      ? "bg-purple-800/30 text-purple-300 border border-purple-700 shadow-md shadow-purple-900/30"
                      : "bg-purple-100 text-purple-950 border border-purple-200 shadow-md shadow-purple-200/60"
                  }`
                : `${
                    isDarkMode
                      ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
                      : "text-purple-800 hover:text-purple-950 hover:bg-purple-100/70"
                  } transition-all duration-300 rounded-xl`
            }`}
          >
            <CheckSquare className={`w-6 h-6 mb-1 transition-all duration-300 ${
              activeTab === 'tasks' ? "animate-pulse" : ""
            }`} />
            <span className="text-xs font-medium">Tasks</span>
            {activeTab === 'tasks' && (
              <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-colors duration-300 ${
                isDarkMode ? "bg-[#1da1f2]" : "bg-[#1da1f2]"
              }`} />
            )}
          </button>

          {/* Gallery Tab */}
          <button
            onClick={() => handleTabChange('gallery')}
            className={`tab-hover flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] relative ${
              activeTab === 'gallery'
  ? `tab-active transform scale-110 ${
      isDarkMode
        ? "bg-purple-800/30 text-purple-300 border border-purple-700 shadow-md shadow-purple-900/30"
        : "bg-purple-100 text-purple-950 border border-purple-200 shadow-md shadow-purple-200/60"
    }`
  : `${
      isDarkMode
        ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
        : "text-purple-800 hover:text-purple-950 hover:bg-purple-100/70"
    } transition-all duration-300 rounded-xl`

            }`}
          >
            <Grid3X3 className={`w-6 h-6 mb-1 transition-all duration-300 ${
              activeTab === 'gallery' ? "animate-pulse" : ""
            }`} />
            <span className="text-xs font-medium">Gallery</span>
            {activeTab === 'gallery' && (
              <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-colors duration-300 ${
                isDarkMode ? "bg-[#1da1f2]" : "bg-[#1da1f2]"
              }`} />
            )}
          </button>

          {/* Admin Tab */}
          <button
            onClick={() => handleTabChange('admin')}
            className={`tab-hover flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] relative ${
              activeTab === 'admin'
  ? `tab-active transform scale-110 ${
      isDarkMode
        ? "bg-purple-800/30 text-purple-300 border border-purple-700 shadow-md shadow-purple-900/30"
        : "bg-purple-100 text-purple-950 border border-purple-200 shadow-md shadow-purple-200/60"
    }`
  : `${
      isDarkMode
        ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
        : "text-purple-800 hover:text-purple-950 hover:bg-purple-100/70"
    } transition-all duration-300 rounded-xl`

            }`}
          >
            <Settings className={`w-6 h-6 mb-1 transition-all duration-300 ${
              activeTab === 'admin' ? "animate-pulse" : ""
            }`} />
            <span className="text-xs font-medium">Admin</span>
            {activeTab === 'admin' && (
              <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-colors duration-300 ${
                isDarkMode ? "bg-[#1da1f2]" : "bg-[#1da1f2]"
              }`} />
            )}
          </button>
          {/* Rewards Tab */}
          <button
            onClick={() => handleTabChange('rewards')}
            className={`tab-hover flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] relative ${
              activeTab === 'rewards'
  ? `tab-active transform scale-110 ${
      isDarkMode
        ? "bg-purple-800/30 text-purple-300 border border-purple-700 shadow-md shadow-purple-900/30"
        : "bg-purple-100 text-purple-950 border border-purple-200 shadow-md shadow-purple-200/60"
    }`
  : `${
      isDarkMode
        ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
        : "text-purple-800 hover:text-purple-950 hover:bg-purple-100/70"
    } transition-all duration-300 rounded-xl`

            }`}
          >
            <Award className={`w-6 h-6 mb-1 transition-all duration-300 ${
              activeTab === 'rewards' ? "animate-pulse" : ""
            }`} />
            <span className="text-xs font-medium">Rewards</span>
            {activeTab === 'rewards' && (
              <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full transition-colors duration-300 ${
                isDarkMode ? "bg-[#1da1f2]" : "bg-[#1da1f2]"
              }`} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}