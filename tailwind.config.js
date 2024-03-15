const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
    iconsPlugin({
      collections: getIconCollections(["carbon"]),
    }),
  ],
  daisyui: {
    themes: ["forest"],
    darkTheme: "forest",
  },
};
