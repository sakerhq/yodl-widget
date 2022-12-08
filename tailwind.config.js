module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'availability-selector': 'auto minmax(0, 1fr)'
      },
    },
  },
  plugins: [],
}
