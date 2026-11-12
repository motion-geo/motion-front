/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--page)",
        "page-fg": "var(--page-fg)",
        panel: "var(--panel)",
        "panel-fg": "var(--panel-fg)",
        muted: "var(--muted)",
        "muted-fg": "var(--muted-fg)",
        band: "var(--band)",
        "band-fg": "var(--band-fg)",
        accent: "var(--accent)",
        "accent-fg": "var(--accent-fg)",
        brand: "var(--brand)",
        line: "var(--line)",
        header: "var(--header)",
        soft: "var(--soft)",
        "fg-muted": "var(--fg-muted)",
        card: "var(--card)",
        "card-fg": "var(--card-fg)",
        motion: {
          green: "var(--brand)",
          lime: "var(--accent)",
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
