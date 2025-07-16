module.exports = {
  purge: [],
  darkMode: false, 
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
    colors: {
      primary: {
        500: '#6366f1',
        600: '#4f46e5',
      },
      gradient: {
        start: '#2563eb',  // Blue-600
        end: '#9333ea',    // Purple-600
      },
    },
    backgroundImage: {
      'hero-gradient': 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
