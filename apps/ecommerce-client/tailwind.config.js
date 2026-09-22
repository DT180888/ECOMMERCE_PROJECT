/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Lyon Text', 'Newsreader', 'Playfair Display', 'Instrument Serif', 'serif'],
        mono: ['Geist Mono', 'SF Mono', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        'surface-hover': 'hsl(var(--secondary))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        elevated: 'hsl(var(--muted))',
        heading: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          soft: 'hsla(var(--accent), 0.1)',
        },
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        // Semantic Colors
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '12px',
        'full': '9999px',
        card: '6px',
        button: '4px',
        inner: '2px',
        gallery: '4px', // From DESIGN.md
      },
      boxShadow: {
        'neo': '0 8px 24px rgba(var(--shadow-dark-rgb), var(--shadow-dark-opacity))',
        'neo-hover': '0 16px 36px rgba(var(--shadow-dark-rgb), calc(var(--shadow-dark-opacity) + 0.04))',
        'neo-sm': '0 2px 8px rgba(var(--shadow-dark-rgb), var(--shadow-dark-opacity))',
        'neo-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        'neo-inset-deep': 'inset 0 4px 8px rgba(0, 0, 0, 0.06)',
        'neo-inset-sm': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms'),
  ],
};