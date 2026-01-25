/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#EDEDED',      // Light gray background
        'paper-dark': '#f5f2e8', // The sidebar darker beige
        'paper-hover': '#E8EBF2', // Hover state color
        ink: '#1a1a1a',        // Not quite black, softer on eyes
      },
      fontFamily: {
        mono: ['"Courier Prime"', 'Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}