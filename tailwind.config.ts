import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#000000",
          paper: "#f0f0f0",
          orange: "#ff5c00",
          gray: "#666666",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px #000000",
        "brutal-xl": "8px 8px 0px #000000",
      },
    },
  },
  plugins: [],
};
export default config;
