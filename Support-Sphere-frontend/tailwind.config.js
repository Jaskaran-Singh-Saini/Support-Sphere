module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Growing Path palette
        cream:      '#FAF7F2',
        forest:     '#2D5A3D',
        'forest-light': '#3D7A53',
        'forest-dark':  '#1E3D2A',
        terra:      '#C97B5A',
        'terra-light': '#D9957A',
        moss:       '#A8C0A0',
        'moss-light': '#C4D4BE',
        bark:       '#5C4033',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body:    ['Figtree', 'sans-serif'],
        sans:    ['Figtree', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};