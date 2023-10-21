/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-primary": "#AFD3E2",
        "blue-secondary": "#146C94",
        "blue-accent": "#19A7CE",
        "gray-text-1": "#D9D9D9",
        "gray-text-2": "#606060",
        "gray-background": "#DADADA",
        "gray-account": "#858585",
        "white-primary": "#F6F1F1",
      },

      // TODO: CHANGE FONT FAMILY CONFIG TO INTER!!
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans], // change default font to Inter
        inter: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
