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
        // orange: {
        //   300: "#fab575",
        //   600: "#f7a04f",
        //   900: "#ff8b1f",
        // },
      },
    },
    plugins: [],
  },
};
export default config;
