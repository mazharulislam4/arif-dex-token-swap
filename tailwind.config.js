/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#0A0E23",
      secondaryColor: "#0E1330",
      gray: "#3C497C",
      darkColor: "#121737",
      buttonHover: "#1A2049",
      lightBlue: "#A8DAFF",
      lightOrange: "#FFF7E6",
      tailTransparent: "transparent",
      black: "#000",
    },
    fontFamily: {
      clashVariable: ["ClashGrotesk-Variable", "sans-serif"],
      clashExtraLight: ["ClashGrotesk-Extralight", "sans-serif"],
      clashLight: ["ClashGrotesk-Light", "sans-serif"],
      clashRegular: ["ClashGrotesk-Regular", "sans-serif"],
      clashSemibold: ["ClashGrotesk-Semibold", "sans-serif"],
      clashMedium: ["ClashGrotesk-Medium", "sans-serif"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
