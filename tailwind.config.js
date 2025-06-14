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
          primary: '#1a1b1e',
          secondary: '#2c2e33',
          accent: '#373a40',
          text: '#ffffff',
          'text-secondary': '#a1a1aa',
          border: '#2c2e33',
          background: '#1a1b1e',
        },
        light: {
          primary: '#ffffff',
          secondary: '#f4f4f5',
          accent: '#e4e4e7',
          text: '#18181b',
          'text-secondary': '#71717a',
          border: '#e4e4e7',
          background: '#ffffff',
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