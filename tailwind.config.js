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
    themes: [
      {
        light: {
          primary: "#1eb854",
          secondary: "#1DB88E",
          accent: "#1DB8AB",
          neutral: "#2A3440",
          "base-100": "#f9fafb",
          "base-200": "#f4f4f5",
          "base-300": "#e4e4e7",
          "--rounded-btn": "1.9rem",
        },
        forest: {
          ...require("daisyui/src/theming/themes")["forest"],
          // default "base-100": "#171212",
          "base-100": "#262626",
        },
      },
    ],
    darkTheme: "forest",
  },
};
