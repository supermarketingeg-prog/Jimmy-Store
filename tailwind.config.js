/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#7c2d12',
          black: '#111111',
          dark: '#1c1917',
          gold: '#eab308'
        }
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
