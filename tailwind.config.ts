import type { Config } from 'tailwindcss';

// Tailwind v4 tidak butuh config yang kompleks
// semua custom values sudah di @theme dalam globals.css
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;
