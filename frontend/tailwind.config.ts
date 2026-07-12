import type { Config } from 'tailwindcss';
import { designTokens } from './src/styles/design-tokens';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
          ...designTokens.colors,
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          'vna-blue': {
            DEFAULT: '#023a78',
            800: '#022d5e',
            900: '#011f42', 50: '#eaf3fb', 100: '#c5dcf3', 200: '#9bc3ea',
            300: '#6faae0', 400: '#4a91d4', 500: '#1f6fb2', 600: '#023a78',
            700: '#022d5e'
          },
          'vna-gold': { DEFAULT: '#f5a623', light: '#ffd66b', dark: '#d4891a' },
          'vna-red': '#d4111a', 'vna-sky': '#1f6fb2', 'vna-tint': '#eaf3fb',
          'vna-text': '#0b1f3a',
          'vna-muted': '#64748b', 'vna-border': '#e2e8f0'
        },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        ...designTokens.typography.fontFamily
      },
      spacing: designTokens.spacing,
      borderRadius: {
        ...designTokens.borderRadius,
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: designTokens.shadows,
    },
  },
  plugins: [],
} satisfies Config;
