import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "var(--graphite-950)",
          900: "var(--graphite-900)",
          800: "var(--graphite-800)",
        },
        violet: "var(--electric-violet)",
        lime: "var(--acid-lime)",
        cyan: "var(--signal-cyan)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        signal: "0 0 0 1px rgba(201, 255, 74, 0.16), 0 24px 80px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
