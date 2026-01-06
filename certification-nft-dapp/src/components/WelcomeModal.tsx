interface WelcomeModalProps {
  isDarkMode: boolean;
  showWelcomeModal: boolean;
  setShowWelcomeModal: (show: boolean) => void;
}

export function WelcomeModal({
  isDarkMode,
  showWelcomeModal,
  setShowWelcomeModal,
}: WelcomeModalProps) {
  if (!showWelcomeModal) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md transition-all duration-500 ease-in-out ${isDarkMode ? "bg-black/95" : "bg-purple-950/90"
        } ${showWelcomeModal ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`p-8 rounded-3xl max-w-md mx-4 text-center border shadow-[0_0_25px_rgba(88,28,135,0.45)] transition-all duration-500 transform ${isDarkMode
            ? "bg-gray-900/90 border-purple-500/50 backdrop-blur-sm"
            : "bg-white/90 border-purple-950/20 backdrop-blur-sm"
          } ${showWelcomeModal ? "scale-100 opacity-100" : "scale-95 opacity-0"} animate-fadeIn`}
      >
        <div className="mb-6">
          <div
            className={`w-20 h-20 bg-gradient-to-r from-purple-700 to-purple-950 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(168,85,247,0.55)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(168,85,247,0.85)] hover:rotate-6`}
          >
            <img
              src="/Recertify.png"
              alt="Alpha DAO logo"
              className="w-18 h-18 animate-spinSlow"
            />
          </div>

          <h2
            className={`text-3xl font-extrabold mb-3 bg-gradient-to-r from-purple-700 to-purple-950 bg-clip-text text-transparent`}
          >
            Welcome to ALPHA DAO
          </h2>

          <p
            className={`text-base leading-relaxed ${isDarkMode ? "text-black-200" : "text-black-800"
              } animate-fadeIn delay-200`}
          >
            Join ALPHA DAO - the premier Web3 education platform empowering the
            next billion users. Complete the learning journey and earn exclusive
            NFT certificates that showcase your Web3 expertise on the TON
            network.
          </p>
        </div>

        <button
          onClick={() => setShowWelcomeModal(false)}
          className="w-full relative bg-gradient-to-r from-purple-700 to-purple-950 hover:from-purple-950 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_28px_rgba(139,92,246,0.55)] hover:shadow-[0_0_40px_rgba(139,92,246,0.85)] overflow-hidden group text-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
          <span className="relative font-semibold tracking-wide">
            Start Learning
          </span>
        </button>
      </div>
    </div>
  );
}
