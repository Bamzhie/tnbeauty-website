/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        accent: '#E75480',
        muted: '#999999',
        gold: '#D97706',
        'gold-light': '#F59E0B',
        testpurple: '#8000ff',
      },
      fontFamily: {
        display: ['"Cinzel Decorative"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};