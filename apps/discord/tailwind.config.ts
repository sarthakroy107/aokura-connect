import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
import baseConfig from "@repo/ui/tailwind.config";
import tailwindcssAnimate from 'tailwindcss-animate';

const currentConfig: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx,mdx}'
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
};

const mergedConfig: Config = {
  ...baseConfig,
  ...currentConfig,
  theme: {
    ...baseConfig.theme,
    ...currentConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      ...currentConfig.theme?.extend,
      colors: {
        ...baseConfig.theme.extend.colors,
        ...currentConfig.theme?.extend?.colors,
      },
      borderRadius: {
        ...baseConfig.theme.extend.borderRadius,
        ...currentConfig.theme?.extend?.borderRadius,
      },
      keyframes: {
        ...baseConfig.theme.extend.keyframes,
        ...currentConfig.theme?.extend?.keyframes,
      },
      animation: {
        ...baseConfig.theme.extend.animation,
        ...currentConfig.theme?.extend?.animation,
      },
    },
  },
  plugins: [...(baseConfig.plugins || []), ...(currentConfig.plugins || [])],
};

export default withUt(mergedConfig);