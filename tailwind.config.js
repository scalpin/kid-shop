/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        heading: ['var(--font-heading)', 'var(--font-sans)']
      }
    },
  },
  plugins: [],
}