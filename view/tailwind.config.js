/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    screens: {
      sssm: "320px",
      xsm: "386px",
      smm: "400px",
      ssm: "550px",
      sm: "640px",
      md: "768px",
      xmd: "960px",
      lg: "1024px",
      xlg: "1160px",
    },
    extend: {
      fontFamily: {
        lato: ["lato", "sans-serif"],
        montserrat: ["montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
