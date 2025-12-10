import { useState, useEffect } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  CheckSquare,
  ExternalLink,
  Shield,
  Trophy,
  Zap,
} from "lucide-react";
import { CONTRACT_ADDRESS } from "@/lib/constants";

interface HomeTabProps {
  isDarkMode: boolean;
  isTransitioning: boolean;
  previousTab: string | null;
  handleTabChange: (tab: string) => void;
  courseProgress: {
    blockchain: boolean;
    ton: boolean;
    nfts: boolean;
  };
  handleMarkAsRead: (course: "blockchain" | "ton" | "nfts") => void;
}

export function HomeTab({
  isDarkMode,
  isTransitioning,
  previousTab,
  handleTabChange,
  courseProgress,
  handleMarkAsRead,
}: HomeTabProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`space-y-6 ${isTransitioning ? (previousTab === "gallery" ? "slide-in-left" : previousTab === "admin" ? "slide-in-left" : "fade-in") : "fade-in"}`}
    >
      {/* Hero Section */}

      <section className="text-center py-8 relative overflow-hidden">
        {/* Subtle animated glow background */}
        <div
          className={`absolute inset-0 -z-10 blur-3xl opacity-30 ${
            isDarkMode ? "bg-purple-950/40" : "bg-purple-200/50"
          }`}
        ></div>

        <div className="max-w-5xl mx-auto relative">
          {/* Tag Badge */}
          <div
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-10 transition-all duration-300 shadow-sm ${
              isDarkMode
                ? "bg-purple-950/40 border-purple-700 text-purple-300"
                : "bg-purple-50 border-purple-200 text-purple-800"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">
              ALPHA DAO Learning Platform
            </span>
            <Award className="w-4 h-4" />
          </div>

          {/* Main Heading */}
          <h1
            className={`text-4xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight ${
              isDarkMode ? "text--gradient-to-r from-purple-800 to-purple-950" : "text-[#14171a] "
            }`}
          >
            RECERTIFY
            
          </h1>

          {/* Subtext */}
          <p
            className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10 ${
              isDarkMode ? "text-[#b8b8d9]" : "text-[#444]"
            }`}
          >
            Transform your Web3 journey with <strong>ALPHA DAO</strong> — your
            gateway to blockchain mastery. Learn decentralized technologies,
            earn verified{" "}
            <span className="text-purple-600 font-semibold">
              NFT credentials
            </span>
            , and join the next billion shaping the future of Web3.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-14">
            <button
              onClick={() => handleTabChange("gallery")}
              className="px-8 py-4 bg-gradient-to-r from-purple-800 to-purple-950 hover:from-purple-950 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] shadow-xl hover:shadow-purple-800/50 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              View Gallery
            </button>
            <TonConnectButton key="home-connect" />
          </div>

          {/* quick links */}
          <div className="relative overflow-hidden max-w-3xl mx-auto">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Complete Tasks */}
              <div className="w-full flex-shrink-0 px-2">
                <div
                  className={`p-6 rounded-2xl border shadow-md hover:shadow-purple-800/40 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800/60 border-gray-700"
                      : "bg-white border-gray-200"
                  } ${currentSlide === 0 ? 'ring-2 ring-purple-500/50 scale-105' : ''}`}
                >
                  <CheckSquare className="w-6 h-6 mx-auto mb-3 text-purple-500" />
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-purple-950"
                    }`}
                  >
                    Complete Tasks
                  </h3>
                  <p
                    className={`text-sm mb-4 leading-relaxed ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Earn points by completing daily tasks
                  </p>
                  <button
                    onClick={() => handleTabChange("tasks")}
                    className={`w-full px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isDarkMode
                        ? "bg-purple-700 text-white hover:bg-purple-600 hover:scale-105"
                        : "bg-purple-700 text-white hover:bg-purple-800 hover:scale-105"
                    }`}
                  >
                    Go to Tasks
                  </button>
                </div>
              </div>

              {/* Take Quiz */}
              <div className="w-full flex-shrink-0 px-2">
                <div
                  className={`p-6 rounded-2xl border shadow-md hover:shadow-purple-800/40 transition-all duration-300 ring-2 ring-purple-500/30 ${
                    isDarkMode
                      ? "bg-gray-800/60 border-gray-700"
                      : "bg-white border-gray-200"
                  } ${currentSlide === 1 ? 'ring-purple-500/50 scale-105' : ''}`}
                >
                  <Brain className="w-6 h-6 mx-auto mb-3 text-purple-500" />
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-purple-950"
                    }`}
                  >
                    Take Quiz
                  </h3>
                  <p
                    className={`text-sm mb-4 leading-relaxed ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Test your knowledge and earn rewards
                  </p>
                  <button
                    onClick={() => handleTabChange("quiz")}
                    className={`w-full px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:animate-pulse hover:transform hover:translate-x-1 ${
                      isDarkMode
                        ? "bg-purple-700 text-white hover:bg-purple-600 hover:scale-105"
                        : "bg-purple-700 text-white hover:bg-purple-800 hover:scale-105"
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    Start Quiz
                  </button>
                </div>
              </div>

              {/* View Rewards */}
              <div className="w-full flex-shrink-0 px-2">
                <div
                  className={`p-6 rounded-2xl border shadow-md hover:shadow-purple-800/40 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800/60 border-gray-700"
                      : "bg-white border-gray-200"
                  } ${currentSlide === 2 ? 'ring-2 ring-purple-500/50 scale-105' : ''}`}
                >
                  <Trophy className="w-6 h-6 mx-auto mb-3 text-purple-500" />
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-purple-950"
                    }`}
                  >
                    View Rewards
                  </h3>
                  <p
                    className={`text-sm mb-4 leading-relaxed ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Check your achievements and rewards
                  </p>
                  <button
                    onClick={() => handleTabChange("rewards")}
                    className={`w-full px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isDarkMode
                        ? "bg-purple-700 text-white hover:bg-purple-600 hover:scale-105"
                        : "bg-purple-700 text-white hover:bg-purple-800 hover:scale-105"
                    }`}
                  >
                    View Rewards
                  </button>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-purple-500 scale-125"
                      : isDarkMode
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TON Explorer Link */}
      <section className="mb-10">
        <div
          className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 shadow-md hover:shadow-purple-500/10 ${
            isDarkMode
              ? "bg-gradient-to-br from-purple-950/80 to-purple-900/40 border-purple-900/60"
              : "bg-gradient-to-br from-white to-purple-50 border-purple-200/50"
          }`}
        >
          <div className="text-center">
            <h3
              className={`text-2xl sm:text-3xl font-extrabold mb-3 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-purple-950"
              }`}
            >
              Explore on TON Blockchain
            </h3>
            <p
              className={`text-sm sm:text-base mb-6 leading-relaxed transition-colors duration-300 ${
                isDarkMode ? "text-black-300/80" : "text-white-800/70"
              }`}
            >
              View ALPHA DAO certificates and transactions directly on the TON
              testnet explorer.
            </p>
            <a
              href={`https://testnet.tonscan.org/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? "bg-purple-700 text-white hover:bg-purple-600 shadow-lg shadow-purple-950/40"
                  : "bg-purple-700 text-white hover:bg-purple-800 shadow-md shadow-purple-300/20"
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              View Contract on TON Explorer
            </a>
          </div>
        </div>
      </section>

      {/* Learning Modules */}
      <section className="mb-10">
        <div className="text-center mb-8">
          <h2
            className={`text-2xl sm:text-3xl font-extrabold mb-4 ${
              isDarkMode ? "text-white" : "text-purple-950"
            }`}
          >
            Learning Modules
          </h2>
          <p
            className={`text-sm sm:text-base max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-black-300/80" : "text-white-900/70"
            }`}
          >
            Master Web3 fundamentals through ALPHA DAO’s curated curriculum.
            From blockchain basics to advanced DeFi strategies — earn verifiable
            NFT credentials recognized globally.
          </p>
        </div>

        {/* Learning Cards */}
        <div className="space-y-6">
          {/* Blockchain Fundamentals */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/10 ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-950/60 to-purple-900/30 border-purple-900/50"
                : "bg-white border-purple-100"
            }`}
          >
            <div className="flex items-start gap-4">
              <BookOpen
                className={`w-6 h-6 flex-shrink-0 transition-colors duration-300 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-purple-950"
                  }`}
                >
                  Blockchain Fundamentals
                </h3>
                <p
                  className={`text-sm mb-4 leading-relaxed ${
                    isDarkMode ? "text-black-300/80" : "text-white-900/70"
                  }`}
                >
                  Discover the revolutionary technology powering Bitcoin,
                  Ethereum, and beyond. Master consensus mechanisms,
                  cryptographic security, and decentralized validation that make
                  blockchain the future of trust.
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-purple-900/60 text-purple-300/80"
                          : "bg-purple-50 text-purple-800/70"
                      }`}
                    >
                      5 min read
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isDarkMode
                          ? "bg-green-500/10 text-green-400"
                          : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      Beginner
                    </span>
                  </div>

                  <button
                    onClick={() => handleMarkAsRead("blockchain")}
                    disabled={courseProgress.blockchain}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      courseProgress.blockchain
                        ? "cursor-not-allowed bg-green-500/10 text-green-400"
                        : isDarkMode
                          ? "bg-purple-700 text-white hover:bg-purple-600 hover:scale-105"
                          : "bg-purple-700 text-white hover:bg-purple-800 hover:scale-105"
                    }`}
                  >
                    {courseProgress.blockchain ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Completed
                      </>
                    ) : (
                      "Mark as Read"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TON Overview */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/10 ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-950/60 to-purple-900/30 border-purple-900/50"
                : "bg-white border-purple-100"
            }`}
          >
            <div className="flex items-start gap-4">
              <Zap
                className={`w-6 h-6 flex-shrink-0 transition-colors duration-300 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-purple-950"
                  }`}
                >
                  TON Overview
                </h3>
                <p
                  className={`text-sm mb-4 leading-relaxed ${
                    isDarkMode ? "text-black-300/80" : "text-white-900/70"
                  }`}
                >
                  Dive deep into TON's groundbreaking architecture — the
                  fastest, most scalable blockchain designed for mass adoption.
                  Learn how it achieves 100,000+ TPS while maintaining security
                  and decentralization.
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-purple-900/60 text-purple-300/80"
                          : "bg-purple-50 text-purple-800/70"
                      }`}
                    >
                      7 min read
                    </span>
                    <span
                      className={`text-xs px-1 py-1 rounded-full font-medium ${
                        isDarkMode
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "bg-yellow-400/10 text-yellow-600"
                      }`}
                    >
                      Intermediate
                    </span>
                  </div>

                  <button
                    onClick={() => handleMarkAsRead("ton")}
                    disabled={courseProgress.ton}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      courseProgress.ton
                        ? "cursor-not-allowed bg-green-500/10 text-green-400"
                        : isDarkMode
                          ? "bg-purple-700 text-white hover:bg-purple-600 hover:scale-105"
                          : "bg-purple-700 text-white hover:bg-purple-800 hover:scale-105"
                    }`}
                  >
                    {courseProgress.ton ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Completed
                      </>
                    ) : (
                      "Mark as Read"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* NFTs & Digital Ownership */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/10 ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-950/60 to-purple-900/30 border-purple-900/50"
                : "bg-white border-purple-100"
            }`}
          >
            <div className="flex items-start gap-4">
              <Award
                className={`w-6 h-6 flex-shrink-0 transition-colors duration-300 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-purple-950"
                  }`}
                >
                  NFTs & Digital Ownership
                </h3>
                <p
                  className={`text-sm mb-4 leading-relaxed ${
                    isDarkMode ? "text-black-300/80" : "text-white-900/70"
                  }`}
                >
                  Unlock the power of digital ownership. Master NFT standards,
                  smart contract interactions, and the technology behind
                  billion-dollar digital economies on TON's lightning-fast
                  network.
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-purple-900/60 text-purple-300/80"
                          : "bg-purple-50 text-purple-800/70"
                      }`}
                    >
                      6 min read
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isDarkMode
                          ? "bg-pink-500/10 text-pink-400"
                          : "bg-pink-500/10 text-pink-600"
                      }`}
                    >
                      Advanced
                    </span>
                  </div>

                  <button
                    onClick={() => handleMarkAsRead("nfts")}
                    disabled={courseProgress.nfts}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      courseProgress.nfts
                        ? "cursor-not-allowed bg-green-500/10 text-green-400"
                        : isDarkMode
                          ? "bg-purple-700 text-white hover:bg-purple-600 hover:scale-105"
                          : "bg-purple-700 text-white hover:bg-purple-800 hover:scale-105"
                    }`}
                  >
                    {courseProgress.nfts ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Completed
                      </>
                    ) : (
                      "Mark as Read"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Certificates Carousel */}
      {/* Featured Certificates Carousel */}
      <section className="mb-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className={`text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight transition-colors duration-500 ${
              isDarkMode ? "text-white" : "text-purple-950"
            }`}
          >
            Featured Certificates
          </h2>
          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto transition-colors duration-500 ${
              isDarkMode ? "text-black-300/80" : "text-white-900/70"
            }`}
          >
            Showcase of elite Web3 achievements and verified digital credentials
            earned by our community.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Featured Certificate 1 */}
          <div
            className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-950/80 to-purple-900/40 border-purple-900/60"
                : "bg-gradient-to-br from-white to-purple-50 border-purple-200/60"
            }`}
          >
            {/* Glow Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 blur-3xl rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center shadow-md shadow-purple-900/30">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold text-lg mb-1 transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-purple-950"
                  }`}
                >
                  Elite Blockchain Developer
                </h3>
                <p
                  className={`text-xs sm:text-sm transition-colors duration-300 ${
                    isDarkMode ? "text-purple-300/70" : "text-purple-800/70"
                  }`}
                >
                  Certified: December 2024
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm mt-3">
              <span
                className={`font-mono tracking-tight transition-colors duration-300 ${
                  isDarkMode ? "text-purple-400/70" : "text-purple-600/80"
                }`}
              >
                ID: #1247
              </span>
              <span
                className={`transition-colors duration-300 ${
                  isDarkMode ? "text-purple-400/60" : "text-purple-800/70"
                }`}
              >
                Owner: 0x...a8b2
              </span>
            </div>
          </div>

          {/* Featured Certificate 2 */}
          <div
            className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-950/80 to-purple-900/40 border-purple-900/60"
                : "bg-gradient-to-br from-white to-purple-50 border-purple-200/60"
            }`}
          >
            {/* Glow Accent */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center shadow-md shadow-purple-900/30">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold text-lg mb-1 transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-purple-950"
                  }`}
                >
                  DeFi Security Expert
                </h3>
                <p
                  className={`text-xs sm:text-sm transition-colors duration-300 ${
                    isDarkMode ? "text-purple-300/70" : "text-purple-800/70"
                  }`}
                >
                  Certified: November 2024
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm mt-3">
              <span
                className={`font-mono tracking-tight transition-colors duration-300 ${
                  isDarkMode ? "text-purple-400/70" : "text-purple-600/80"
                }`}
              >
                ID: #1189
              </span>
              <span
                className={`transition-colors duration-300 ${
                  isDarkMode ? "text-purple-400/60" : "text-purple-800/70"
                }`}
              >
                Owner: 0x...c4d5
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
