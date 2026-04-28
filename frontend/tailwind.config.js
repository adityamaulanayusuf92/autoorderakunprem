module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        dark: '#0a0e27',
        'dark-light': '#1a1a3e',
        'neon-blue': '#00d9ff',
        'neon-purple': '#d946ef',
        'neon-pink': '#ff10f0',
        'neon-cyan': '#00f0ff',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.8)',
        'glow-xl': '0 0 60px rgba(99, 102, 241, 1)',
        'glow-neon': '0 0 30px rgba(0, 209, 255, 0.6)',
        'glow-pink': '0 0 30px rgba(255, 16, 240, 0.6)',
        'soft-shadow': '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-neon': 'linear-gradient(135deg, #00d9ff 0%, #d946ef 50%, #ff10f0 100%)',
        'gradient-glow': 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-down': 'fadeDown 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'glow-pulse-fast': 'glowPulse 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-out-right': 'slideOutRight 0.5s ease-in',
        'bounce-slow': 'bounceSlow 3s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionDuration: {
        '350': '350ms',
      },
    },
  },
  plugins: [],
};
