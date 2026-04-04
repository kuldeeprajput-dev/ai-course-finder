import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#FF6321',
        'brand-black': '#0a0a0a',
        'brand-paper': '#f5f0e8',
        'brand-gray': '#6b6b6b',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-jetbrains)'],
        serif: ['var(--font-playfair)'],
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px #0a0a0a',
        'brutal-lg': '6px 6px 0px 0px #0a0a0a',
        'brutal-xl': '8px 8px 0px 0px #0a0a0a',
      },
    },
  },
  plugins: [],
};

export default config;
