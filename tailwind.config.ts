import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f3efe5",
        ink: "#1b2a35",
        cinnabar: "#c53d32",
        jade: "#2d7a67",
        ledger: "#50657b",
        brass: "#d3a64a",
      },
      fontFamily: {
        display: ["STKaiti", "KaiTi", "Kaiti SC", "serif"],
        sans: ["PingFang SC", "Noto Sans SC", "Microsoft YaHei", "sans-serif"],
        mono: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
      },
      boxShadow: {
        dossier: "0 18px 50px rgba(27, 42, 53, 0.12)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(rgba(27,42,53,.07) 0.6px, transparent 0.6px)",
      },
    },
  },
  plugins: [],
};

export default config;
