import type { Config } from "tailwindcss"
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        discord_blurple: "#5865F2",
        discord_default: "#686bff",
        disord_lighter: "#424549", 
        discord: "#36393e",
        discord_darker: "#282b30",
        discord_darkest: "#1e2124",
        discord_fucia: "#EB459E",
        discord_purple: "#9B59B6",
        discord_purple_dark: '#71368A',
        discord_teal: '#1ABC9C',
        discord_teal_dark: '#11806A',
        discord_green_light: '#57F287',
        discord_green: '#2ecc71',
        discord_green_dark: '#1F8B4C',
        discord_magneta: '#E91E63',
        discord_magneta_dark: '#AD1457',
        discord_yellow: '#F1C40F',
        discord_yellow_dark: '#C27C0E',
        discord_orange: '#E67E22',
        discord_orange_dark: '#A84300',
        discord_red: '#E74C3C',
        discord_red_dark: '#992D22',
        discord_blue: '#3498DB',
        discord_blue_dark: '#1F618D',
        discord_cyan: '#00BCD4',
        discord_cyan_dark: '#00838F',
        discord_pink: '#FF4081',
        discord_pink_dark: '#C51162',
        discord_brown: '#795548',
        discord_brown_dark: '#4E342E',
        discord_grey: '#607D8B',
        discord_grey_dark: '#455A64',
        discord_grey_light: '#B0BEC5',
        discord_grey_lighter: '#CFD8DC',
        discord_grey_lightest: '#ECEFF1',
        discord_white: '#FFFFFF',
        discord_black: '#000000',
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config

export default config