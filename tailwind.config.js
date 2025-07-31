/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      letterSpacing: {
        'extra-wide': '0.2em',
        'super-wide': '0.3em',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
    },
  },
  plugins: [],
} 