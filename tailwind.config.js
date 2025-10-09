// tailwind.config.js
export default {
  content: [
    "./index.html",                // root html
    "./src/**/*.{js,ts,jsx,tsx}",  // sab React files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1368ec",      // custom color
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
