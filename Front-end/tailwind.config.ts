
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light Mode Semantic Colors (New "Warm Minimal" Palette)
        background: '#FEFEFE',
        surface: '#F8F8F8',
        'primary-text': '#2D2D2D',
        'secondary-text': '#6B6B6B',
        primary: '#D4AF37',
        'primary-hover': '#c5a033',
        border: 'rgba(45, 45, 45, 0.15)',
        'btn-primary-text': '#FFFFFF',
        'card-border': 'rgba(45, 45, 45, 0.1)',

        // Dark Mode Semantic Colors (Preserved)
        dark: {
          background: '#1f2121',
          surface: '#262828',
          'primary-text': '#f5f5f5',
          'secondary-text': 'rgba(167, 169, 169, 0.7)',
          primary: '#32b8c6',
          'primary-hover': '#2da6b2',
          border: 'rgba(119, 124, 124, 0.3)',
          'btn-primary-text': '#1f2121',
          'card-border': 'rgba(119, 124, 124, 0.2)',
        },
        
        // Shared colors
        red: {
           400: 'rgba(255, 84, 89, 1)',
           500: 'rgba(192, 21, 47, 1)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-devanagari)', 'sans-serif'],
        serif: ['var(--font-lora)', 'var(--font-devanagari)', 'serif'],
        devanagari: ['var(--font-devanagari)', 'sans-serif'],
        grotesk: ['FKGroteskNeue', 'sans-serif']
      },
    },
  },
  plugins: [],
}
export default config;
