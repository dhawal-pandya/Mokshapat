import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Aged-parchment / sand — light panel & button backgrounds.
        parchment: {
          50:  '#fbf4e6',
          100: '#f4e7cc',
          200: '#e9d2a4',
          300: '#d9b878',
          400: '#c69a4c',
          500: '#a97c2c',
        },
        // Bronze → espresso — borders and dark text.
        brown: {
          100: '#ecdcc0',
          300: '#c8a673',
          400: '#a07a40',
          500: '#6f4a1f',
          600: '#583a17',
          700: '#412a10',
          800: '#2e1c0a',
          900: '#1d1206',
        },
        // Antique gold — titles & important highlights.
        saddle: '#9a6410',
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
