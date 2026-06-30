// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      colors: {
        serene: {
          50: '#F8F7F2',   // Cream/Soft White
          100: '#E7E2D8',  // Sand
          200: '#D1C9BC',
          300: '#B8B0A0',
          400: '#92A383',  // Light Sage
          500: '#7C9070',  // Primary Sage
          600: '#63735A',
          700: '#4A5644',
          800: '#40513B',  // Deep Forest
          900: '#2C3327',  // Charcoal Forest
        },
        sage: {
          50: '#f4f7f4',
          100: '#e6ede6',
          200: '#ccdccd',
          300: '#a3bfa3',
          400: '#769c76',
          500: '#567f56',
          600: '#436543',
          700: '#375237',
          800: '#2e432e',
          900: '#273827',
        },
        cream: {
          50: '#fffbf0',
          100: '#fef3d1',
          200: '#fde5a3',
          300: '#fcd36b',
          400: '#fbba38',
          500: '#f89a16',
          600: '#e37a0f',
          700: '#bd5b11',
          800: '#9a4714',
          900: '#7e3a14',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}