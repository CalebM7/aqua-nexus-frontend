/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aqua-blue': '#1A73E8',
        'aqua-teal': '#00ACC1',
        'aqua-green': '#4CAF50',
        'aqua-light-bg': '#F5F5F5',
      },
    },
  },
  plugins: [],
}