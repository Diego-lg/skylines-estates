/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f6f5f1',
          900: '#0b0b0d',
          950: '#06060a',
        },
        gold: {
          400: '#d6b06b',
          500: '#c39a4f',
          600: '#a47c3a',
        },
      },
    },
  },
  plugins: [],
}
