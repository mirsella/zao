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
        lmp: {
          ...require("daisyui/src/theming/themes")["forest"],
          "color-scheme": "light",
          "base-100": "#FAFAFA",
          "base-200": "#F1F1F1",
          "base-300": "#EBEBEB",
          "base-content": "#66AF7A",
        },
        lmpdark: {
          ...require("daisyui/src/theming/themes")["forest"],
          "base-100": "#66AF7A",
          "base-200": "#60A775",
          "base-300": "#5B9C6D",
          "base-content": "#FAFAFA",
        },
        light: {
          ...require("daisyui/src/theming/themes")["forest"],
          primary: "#1eb854",
          secondary: "#1DB88E",
          accent: "#1DB8AB",
          neutral: "#2A3440",
          "base-100": "#f9fafb",
          "base-200": "#f4f4f5",
          "base-300": "#e4e4e7",
        },
        forest: {
          ...require("daisyui/src/theming/themes")["forest"],
          // default "base-100": "#171212",
          "base-100": "#262626",
        },
      },
    ],
    // darkTheme: "forest",
    darkTheme: "lmpdark",
  },
};
