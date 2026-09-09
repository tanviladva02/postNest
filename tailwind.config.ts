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
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc9fc',
          400: '#36abfa',
          500: '#0c8ee9',
          600: '#0270c7',
          700: '#0359a1',
          800: '#074c85',
          900: '#0c406e',
          950: '#082849',
        },
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        dark: {
          900: '#0a0d14',
          800: '#121824',
          700: '#1a2234',
          600: '#253047',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
