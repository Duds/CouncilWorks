/**
 * Aegrid Tailwind Config
 * Brand tokens are defined as CSS variables in styles/brand-tokens.css
 * Dark mode toggled via .dark class on <html> (compatible with shadcn/ui)
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", "class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			surface: {
  				DEFAULT: 'var(--surface)',
  				foreground: 'var(--surface-foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			success: {
  				DEFAULT: 'var(--success)',
  				light: 'var(--success-light)',
  				foreground: 'var(--success-foreground)'
  			},
  			info: {
  				DEFAULT: 'var(--info)',
  				foreground: 'var(--info-foreground)'
  			},
  			danger: {
  				DEFAULT: 'var(--danger)',
  				foreground: 'var(--danger-foreground)'
  			},
  			warning: {
  				DEFAULT: 'var(--warning)',
  				foreground: 'var(--warning-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			neutral: {
  				DEFAULT: 'var(--neutral)',
  				foreground: 'var(--neutral-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			border: 'var(--border)',
  			// Priority colors
  			'priority-low': {
  				DEFAULT: 'var(--priority-low)',
  				foreground: 'var(--priority-low-foreground)'
  			},
  			'priority-medium': {
  				DEFAULT: 'var(--priority-medium)',
  				foreground: 'var(--priority-medium-foreground)'
  			},
  			'priority-high': {
  				DEFAULT: 'var(--priority-high)',
  				foreground: 'var(--priority-high-foreground)'
  			},
  			'priority-critical': {
  				DEFAULT: 'var(--priority-critical)',
  				foreground: 'var(--priority-critical-foreground)'
  			},
  			// Condition colors
  			'condition-excellent': {
  				DEFAULT: 'var(--condition-excellent)',
  				foreground: 'var(--condition-excellent-foreground)'
  			},
  			'condition-good': {
  				DEFAULT: 'var(--condition-good)',
  				foreground: 'var(--condition-good-foreground)'
  			},
  			'condition-fair': {
  				DEFAULT: 'var(--condition-fair)',
  				foreground: 'var(--condition-fair-foreground)'
  			},
  			'condition-poor': {
  				DEFAULT: 'var(--condition-poor)',
  				foreground: 'var(--condition-poor-foreground)'
  			},
  			'condition-critical': {
  				DEFAULT: 'var(--condition-critical)',
  				foreground: 'var(--condition-critical-foreground)'
  			},
  			'condition-unknown': {
  				DEFAULT: 'var(--condition-unknown)',
  				foreground: 'var(--condition-unknown-foreground)'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		boxShadow: {
  			'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  			'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  			'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  			'none': 'none'
  		}
  	}
  },
  plugins: [],
};
