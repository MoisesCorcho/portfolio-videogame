/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        accent: '#ffcc00', // Custom accent color used in existing styles
      },
    },
  },
  plugins: [],
};
