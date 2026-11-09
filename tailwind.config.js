/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        motion: {
          green: "#015F3A",
          lime: "#C8F902",
          black: "#000000",
          white: "#FFFFFF",
          red: "#FF0000",
          coral: "#FE725B",
          orange: "#FF8500",
          navy: "#004B70",
          purple: "#820099",
          ink: "#141414",
          mist: "#E8E8E8",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto)", "sans-serif"],
        display: ["var(--font-alatsi)", "var(--font-noto)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
