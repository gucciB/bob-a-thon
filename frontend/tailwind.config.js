/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'carbon-blue': '#0f62fe',
        'carbon-dark': '#161616',
        'carbon-surface': '#262626',
        'carbon-border': '#393939',
        'carbon-gray': '#f4f4f4',
      },
    },
  },
  plugins: [],
}

// Made with Bob
