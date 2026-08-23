/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#1D1C1C",
        "soft-green": "#83F582",
        "warm-yellow": "#FFF48D",
        peach: "#FFB88C",
        cyan: "#7AF7F7",
        "coral-red": "#D64545",
        cream: "#FAF7F2",
      },
      borderWidth: {
        3: "3px",
        4: "4px",
        5: "5px",
      },
      boxShadow: {
        brutal: "3px 3px 0px #1D1C1C",
        "brutal-md": "4px 4px 0px #1D1C1C",
        "brutal-lg": "6px 6px 0px #1D1C1C",
        "brutal-xl": "8px 8px 0px #1D1C1C",
      },
      animation: {
        "gradient-bg": "gradient-bg 12s ease infinite",
      },
      keyframes: {
        "gradient-bg": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
    },
  },
  plugins: [],
};
