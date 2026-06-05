import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50:  '#fdf8ee',
          100: '#f4e4c1',
          200: '#e8d5a3',
          300: '#dcc896',
          400: '#d4bc84',
          500: '#c9a85c',
        },
        brown: {
          100: '#f4e4c1',
          300: '#d4bc84',
          400: '#c9a85c',
          500: '#8b5a2b',
          600: '#6b4423',
          700: '#5d3a1a',
          800: '#3d2914',
          900: '#1a0d05',
        },
        saddle: '#8b4513',
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
