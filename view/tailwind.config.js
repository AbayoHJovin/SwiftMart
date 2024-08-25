/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    screens: {
      'sssm':'320px',
        'ssm':'550px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
    },
    extend: { 
      
      fontFamily: {
        lato: ['lato', 'sans-serif'],
        montserrat: ['montserrat', 'sans-serif']
      },
    },
  },
  plugins: [],
};
