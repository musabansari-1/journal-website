import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}','./components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
        gold: { 400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309' }
      },
      fontFamily: {
        display: ['Playfair Display','Georgia','serif'],
        body: ['Source Serif 4','Georgia','serif'],
        sans: ['Inter','system-ui','sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
