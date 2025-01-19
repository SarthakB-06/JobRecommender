/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html","./src/**/*.{js,ts,jsx,tsx}","./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Indigo Blue
          hover: '#1D4ED8',  // Hover for Primary Blue
        },
        secondary: {
          light: '#60A5FA',  // Sky Blue
        },
        success: {
          DEFAULT: '#10B981', // Emerald Green
        },
        warning: {
          DEFAULT: '#F97316', // Warm Orange
          hover: '#EA580C',  // Hover for Orange Buttons
        },
        neutral: {
          dark: '#1F2937',  // Dark Gray
          light: '#F3F4F6', // Light Gray
          white: '#FFFFFF', // White
        },
      }
    },
  },
  plugins: [require('flowbite/plugin')],
}

