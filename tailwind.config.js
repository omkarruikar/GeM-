/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
        classical: ['Cinzel', 'Merriweather', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      },
      colors: {
        institutional: {
          navy: '#0B192C',
          darkBlue: '#1E3E62',
          slate: '#334155',
          gold: '#854D0E',
          brass: '#A16207',
          parchment: '#FAF9F6',
          ivory: '#F4F1EA',
          border: '#E2E8F0'
        }
      }
    },
  },
  plugins: [],
}
