/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ms-obsidian': '#0B1221',
        'ms-blue': '#00A4EF',
        'ms-violet': '#7F00FF',
        'ms-purple': '#7F00FF',
        'ms-white': '#F0F4F8',
        'ms-dim': '#888888',
        'ms-dark': '#0f172a',
        'ms-neon': '#00eaff',
        'ms-yellow': '#ffb900',
        'ms-orange': '#f25022',
        'ms-green': '#7fba00',
        'tc-accent': '#00A4EF',
        'tc-violet': '#7F00FF',
        'tc-neon': '#00eaff',
      },
      fontFamily: {
        'display': ['"Space Grotesk"', 'sans-serif'],
        'body': ['"Inter"', '"Manrope"', 'sans-serif'],
        'script': ['"Reenie Beanie"', 'cursive'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
      },
      animation: {
        'ticker': 'ticker 20s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-short': 'bounce-short 0.5s ease-out',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'gradient-x': 'gradient-x 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'bounce-short': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shake': {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'brutal': '4px 4px 0 0 rgba(0, 0, 0, 1)',
        'brutal-dark': '4px 4px 0 0 rgba(255, 255, 255, 1)',
        'brutal-lg': '8px 8px 0 0 rgba(0, 0, 0, 1)',
        'brutal-lg-dark': '8px 8px 0 0 rgba(255, 255, 255, 1)',
        'brutal-blue': '4px 4px 0 0 rgba(0, 164, 239, 0.85)',
        'brutal-violet': '4px 4px 0 0 rgba(127, 0, 255, 0.85)',
        'icon-neon': '4px 4px 0 0 rgba(0, 234, 255, 0.85)',
      }
    },
  },
  plugins: [],
}
