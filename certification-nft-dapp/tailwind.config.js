module.exports = {
  theme: {
    extend: {
      fontFamily: {
        header: ["Franklin Gothic Heavy", "Arial Black", "sans-serif"],
        body: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        japanese: ["MS PGothic", "Meiryo", "sans-serif"], // If needed for multilingual
      },
      colors: {
        "magic-purple": "#a855f7",
        "magic-pink": "#ec4899",
        "dark-bg": "#0a0a0a",
        "accent-blue": "#3b82f6",
        "accent-green": "#22c55e",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
};
