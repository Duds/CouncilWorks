/**
 * Aegrid Tailwind Config
 * Brand tokens are defined as CSS variables in styles/brand-tokens.css
 * Dark mode toggled via .dark class on <html> (compatible with shadcn/ui)
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          foreground: "var(--surface-foreground)",
        },

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },

        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },

        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },

        success: {
          DEFAULT: "var(--success)",
          light: "var(--success-light)",
          foreground: "var(--success-foreground)",
        },

        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
        },

        danger: {
          DEFAULT: "var(--danger)",
          foreground: "var(--danger-foreground)",
        },

        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },

        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },

        neutral: {
          DEFAULT: "var(--neutral)",
          foreground: "var(--neutral-foreground)",
        },

        border: "var(--border)",
      },
    },
  },
  plugins: [],
};
