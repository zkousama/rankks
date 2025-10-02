// tailwind.config.ts
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
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        brand: {
          primary: '#6b21a8', // purple-ish default
          accent: '#e21a71',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
        },
      },
      textShadow: {
        DEFAULT: '0 2px 4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow')
  ],
};
export default config;
