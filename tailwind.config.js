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
          teal: '#00D0B0', // WhatsApp green / Accents
          dark: '#383838', // Dark sections
          light: '#E6E6E6', // Backgrounds
          blue: '#0099CC', // Logo blue hint?
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
