/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
        bau: {
          DEFAULT: '#3b82f6',
          light: '#93c5fd',
          dark: '#1e40af',
        },
        baa: {
          DEFAULT: '#10b981',
          light: '#6ee7b7',
          dark: '#047857',
        },
        mis: {
          DEFAULT: '#8b5cf6',
          light: '#c4b5fd',
          dark: '#6d28d9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}