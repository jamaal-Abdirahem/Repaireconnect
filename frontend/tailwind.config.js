/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme.js';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import aspectRatioPlugin from '@tailwindcss/aspect-ratio';

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Cal Sans', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: '#FF5500',
          100: '#FF5500',
          200: '#FF5500',
          300: '#FF5500',
          400: '#FF5500',
          500: '#FF5500', // Primary Brand Color
          600: '#FF5500',
          700: '#FF5500',
          800: '#FF5500',
          900: '#FF5500',
          950: '#FF5500',
        },
        surface: {
          50: '#F7F7F5', // Light Background
          100: '#F7F7F5',
          200: '#F7F7F5',
          300: '#F7F7F5',
          400: '#0D0D0C',
          500: '#0D0D0C',
          600: '#0D0D0C',
          700: '#0D0D0C',
          800: '#0D0D0C',
          900: '#0D0D0C',
          950: '#0D0D0C', // Primary Text/Dark
        }
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'float': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
      }
    },
  },
  plugins: [
    formsPlugin({
      strategy: 'class',
    }),
    typographyPlugin,
    aspectRatioPlugin,
  ],
};
