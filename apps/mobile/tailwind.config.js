/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EBF2FF',
          100: '#D7E6FF',
          200: '#B0CDFF',
          300: '#88B4FF',
          400: '#619AFF',
          500: '#3B82F6',
          600: '#0B61EE',
          700: '#084BB8',
          800: '#063582',
          900: '#041F4C',
        },
      },
    },
  },
  plugins: [],
};
