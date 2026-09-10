import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Primary vibrant orange
          600: '#ea580c', // Darker active orange
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        orangeGlow: '#ff6200',
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        dark: {
          950: '#07080b',
          900: '#0a0d14',
          850: '#0f1420',
          800: '#131926',
          700: '#1a2234',
          600: '#253047',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'orange-sm': '0 2px 10px rgba(249, 115, 22, 0.12)',
        'orange-md': '0 8px 30px rgba(249, 115, 22, 0.2)',
        'orange-lg': '0 12px 40px rgba(249, 115, 22, 0.28)',
      }
    },
  },
  plugins: [],
};
export default config;
