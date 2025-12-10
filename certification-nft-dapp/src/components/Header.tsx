import { Moon, Sparkles, Sun } from "lucide-react";
import { PurpleTonConnectButton } from "./PurpleTonConnectButton";

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function Header({ isDarkMode, toggleTheme }: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 px-3 sm:px-4 py-2.5 sm:py-3.5 ${
        isDarkMode
          ? "bg-purple-950/90 border-purple-900/30 shadow-lg shadow-purple-950/20"
          : "bg-white/95 border-purple-200/50 shadow-md shadow-purple-50"
      }`}
    >
      <div className="flex items-center justify-between max-w-md mx-auto w-full">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <div className="relative shrink-0">
            {/* Glow effect */}
            <div
              className={`absolute inset-0 rounded-xl blur-lg opacity-60 transition-all duration-500 group-hover:opacity-80 ${
                isDarkMode
                  ? "bg-purple-600 animate-pulse"
                  : "bg-purple-400 animate-pulse"
              }`}
            />
            {/* Logo Container */}
            <div
              className={`relative rounded-xl p-1.5 sm:p-2 transition-all duration-300 group-hover:scale-105 ${
                isDarkMode
                  ? "bg-gradient-to-br from-purple-950 to-purple-900 border border-purple-800/50 shadow-lg shadow-purple-900/30"
                  : "bg-gradient-to-br from-white to-purple-50 border border-purple-200/60 shadow-md shadow-purple-100"
              }`}
            >
              <img
                src="/Daologo.png"
                alt="ALPHA DAO logo"
                className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 animate-spinSlow"
              />
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
             
              <Sparkles
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors duration-300 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
            <p
              className={`text-[10px] sm:text-xs font-medium transition-colors duration-300 ${
                isDarkMode ? "text-purple-300/80" : "text-black/70"
              }`}
            >
              Web3 Onboarding
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`group relative p-1.5 sm:p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
              isDarkMode
                ? "text-purple-300 hover:text-purple-200 hover:bg-purple-900/40 border border-purple-800/30"
                : "text-purple-700 hover:text-purple-900 hover:bg-purple-100 border border-purple-200/50"
            }`}
            aria-label="Toggle theme"
          >
            <div
              className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isDarkMode
                  ? "bg-purple-600/20 blur-sm"
                  : "bg-purple-400/20 blur-sm"
              }`}
            />
            <div className="relative z-10">
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
          </button>

          {/* Wallet Connect */}
          <div
            className={`relative rounded-xl transition-all duration-300 hover:scale-105 ${
              isDarkMode
                ? "ring-1 ring-purple-800/40 shadow-lg shadow-purple-950/30"
                : "ring-1 ring-purple-200/60 shadow-md shadow-purple-100"
            }`}
          >
            <div
              className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-600/20 to-purple-800/10 opacity-0 hover:opacity-100"
                  : "bg-gradient-to-r from-purple-400/20 to-purple-600/10 opacity-0 hover:opacity-100"
              }`}
            />
            <div className="scale-90 sm:scale-100 px-1">
              <PurpleTonConnectButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
