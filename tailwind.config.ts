import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fb',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        brown: {
          100: '#dbeafe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1565c0',
          600: '#0d47a1',
          700: '#0c3880',
          800: '#082560',
          900: '#051040',
        },
        saddle: '#059669',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 5px rgba(245,197,24,0.3)' },
          '100%': { boxShadow: '0 0 15px rgba(245,197,24,0.7)' },
        },
        diceShake: {
          '0%,100%': { transform: 'rotate(0deg) scale(1)' },
          '25%':     { transform: 'rotate(-15deg) scale(1.1)' },
          '50%':     { transform: 'rotate(10deg) scale(0.95)' },
          '75%':     { transform: 'rotate(-10deg) scale(1.05)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateX(-50%) translateY(20px)' },
          '15%':  { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
          '85%':  { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        glow:      'glow 2s ease-in-out infinite alternate',
        diceShake: 'diceShake 0.1s ease-in-out infinite',
        fadeInUp:  'fadeInUp 4s ease-in-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
