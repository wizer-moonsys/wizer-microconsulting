/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wizer brand colours
        wizer: {
          purple: '#7b69af',
          'purple-dark': '#5f5090',
          'purple-mid': '#9585c3',
          'purple-soft': '#c4bbdf',
          'purple-light': '#EDEAF6',
          'purple-xlight': '#f5f3fb',
          teal: '#0D9488',
          'teal-light': '#CCFBF1',
        },
      },
    },
  },
  plugins: [],
}
