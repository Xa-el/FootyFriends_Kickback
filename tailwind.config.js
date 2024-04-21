/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
      'dark-green': '#002615',
      'forest-green': '#6A863D',
      'side-green': '#013A21',
      'neon-green': '#C3F53C',
      },

      size: {
        '3/10': '30%',
      },

      width: {
        '17/20': '85%',
      },
    },
  },
  plugins: [],
}

