// eslint-disable-next-line unicorn/prefer-module, import/no-unused-modules -- This is a config file.
"use strict";

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line unicorn/prefer-module, import/no-commonjs -- This is a config file.
module.exports = {
  content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    colors: {
      yellow: "#FECC51",
      orange: "#FA961B",
      white: "#FFFFFF",
      dark: "#1B1B1B"
    }
  },
  plugins: []
};
