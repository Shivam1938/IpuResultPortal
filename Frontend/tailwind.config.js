/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#08090c",
          900: "#0d0f14",
          850: "#111319",
          800: "#161922",
          700: "#1e222c",
          600: "#282d3a",
          500: "#3a4051",
        },
        pulse: {
          DEFAULT: "#c3f53c",
          dim: "#9bd11f",
          soft: "#e8ffab",
        },
        grade: {
          o: "#c3f53c",
          aplus: "#4ade80",
          a: "#60a5fa",
          bplus: "#fbbf24",
          b: "#fb923c",
          c: "#f87171",
          f: "#ef4444",
        },
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(195, 245, 60, 0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(195,245,60,0.06), transparent 60%)",
      },
    },
  },
  plugins: [],
};
