import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        fadedown: "fadedown 1s",
        fadeup: "fadeup 1s",
      },
      keyframes: {
        fadedown: {
          "0%": {
            opacity: "0",
            transform: "translate(0px, -30px) scale(0.9)",
          },
          "100%": {
            opacity: "100",
            transform: "scale(1)",
          },
        },
        fadeup: {
          "0%": {
            opacity: "0",
            transform: "translate(0px, 10px) scale(0.95)",
          },
          "100%": {
            opacity: "100",
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
