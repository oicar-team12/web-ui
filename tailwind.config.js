/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#0f172a',
          secondary: '#1e293b',
          accent: '#334155',
          text: '#f8fafc',
          'text-secondary': '#cbd5e1',
          border: '#475569',
        },
        light: {
          primary: '#ffffff',
          secondary: '#f1f5f9',
          accent: '#e2e8f0',
          text: '#0f172a',
          'text-secondary': '#475569',
          border: '#cbd5e1',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 