/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        navy: {
          800: '#0B2238',
          900: '#071624',
          950: '#040d16',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.45)',
        'glass-glow': '0 0 25px rgba(56, 189, 248, 0.25)',
        'glass-glow-emerald': '0 0 25px rgba(52, 211, 153, 0.25)',
        'glass-glow-rose': '0 0 25px rgba(251, 113, 133, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '40px',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 10s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(20px) scale(0.95)' },
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}