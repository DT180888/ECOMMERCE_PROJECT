/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        'surface-hover': 'hsl(var(--surface-hover))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        elevated: 'hsl(var(--muted))',
        heading: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        subtle: 'hsl(var(--subtle))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          soft: 'hsla(var(--accent), 0.1)',
        },
        'accent-walnut': {
          DEFAULT: 'hsl(var(--accent-walnut))',
          foreground: 'hsl(var(--accent-walnut-foreground))',
        },
        'accent-linen': 'hsl(var(--accent-linen))',
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
        info: 'hsl(var(--info))',
      },
      borderRadius: {
        'none': '0px',
        'xs': '2px',
        'sm': '2px',
        'md': '2px',
        'lg': '4px',
        'full': '9999px',
        card: '0px',
        button: '2px',
        inner: '2px',
        gallery: '0px',
      },
      boxShadow: {
        'none': 'none',
        'hairline': '0 0 0 1px hsl(var(--border))',
      },
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms'),
  ],
};
