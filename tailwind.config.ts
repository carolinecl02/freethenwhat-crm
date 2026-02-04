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
        background: "#F6F7F5",
        "primary-text": "#1F2328",
        "secondary-text": "#6B7076",
        accent: "#8FA3B8",
        sidebar: {
          DEFAULT: "#F6F7F5",
          hover: "#8FA3B8",
          active: "#E8E9E8",
          border: "rgba(0,0,0,0.08)",
          "text-muted": "#6B7076",
        },
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-red-hat-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
      },
      borderRadius: {
        card: "0.75rem",
        panel: "0.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
