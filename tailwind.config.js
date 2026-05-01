/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        porto: {
          50:  '#E3F2FD',
          100: '#BBDEFB',
          400: '#42A5F5',
          500: '#1565C0',
          600: '#0D47A1',
          700: '#0A3880',
          900: '#061B40',
        },
        dark: {
          bg:      '#080C18',
          card:    '#0D1220',
          surface: '#111827',
        },
      },
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.3s ease forwards',
        'pop-in':  'popIn 0.25s ease forwards',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' },
          '40%':           { transform: 'scale(1)',   opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
