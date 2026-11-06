/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        canvas: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'text-primary': 'hsl(var(--foreground))',
        'text-secondary': 'hsl(var(--muted-foreground))',
        'text-tertiary': 'hsl(var(--muted-foreground))',
        'text-muted': 'hsl(var(--muted-foreground))',
        'text-disabled': 'hsl(var(--subtle))',
        surface: 'hsl(var(--surface))',
        'surface-hover': 'hsl(var(--surface-hover))',
        'surface-subtle': 'hsl(var(--surface))',
        'surface-secondary': 'hsl(var(--surface))',
        'surface-tertiary': 'hsl(var(--muted))',
        'surface-elevated': 'hsl(var(--card))',
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
        'accent-primary': 'hsl(var(--accent))',
        'accent-hover': 'hsl(var(--primary-hover))',
        'accent-walnut': {
          DEFAULT: 'hsl(var(--accent-walnut))',
          foreground: 'hsl(var(--accent-walnut-foreground))',
        },
        'accent-linen': 'hsl(var(--accent-linen))',
        border: 'hsl(var(--border))',
        'border-default': 'hsl(var(--border))',
        'border-subtle': 'hsl(var(--subtle))',
        'border-strong': 'hsl(var(--border))',
        'border-focus': 'hsl(var(--ring))',
        'border-muted': 'hsl(var(--subtle))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        'brand-blue': {
          50: '#E6F4FF',
          100: '#BAE0FF',
          200: '#91CAFF',
          300: '#69B1FF',
          400: '#4096FF',
          500: '#1677FF',
          600: '#0958D9',
          700: '#003EB3',
          800: '#002C8C',
          900: '#001D66',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },
      borderRadius: {
        'none': '0px',
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px',
        card: '8px',
        button: '6px',
        inner: '4px',
        gallery: '6px',
      },
      boxShadow: {
        'none': 'none',
        'hairline': '0 0 0 1px hsl(var(--border))',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevation-0': 'none',
        'elevation-1': '0 1px 6px var(--shadow-elevation-1, rgba(0, 0, 0, 0.12))',
        'elevation-2': '0 3px 14px var(--shadow-elevation-2, rgba(0, 0, 0, 0.16))',
        'elevation-3': '0 8px 26px var(--shadow-elevation-3, rgba(0, 0, 0, 0.20))',
        'elevation-4': '0 14px 40px var(--shadow-elevation-4, rgba(0, 0, 0, 0.26))',
        'card': '0 1px 6px var(--shadow-elevation-1, rgba(0, 0, 0, 0.12))',
        'dropdown': '0 8px 26px var(--shadow-elevation-3, rgba(0, 0, 0, 0.20))',
        'modal': '0 14px 40px var(--shadow-elevation-4, rgba(0, 0, 0, 0.26))',
        'popover': '0 3px 14px var(--shadow-elevation-2, rgba(0, 0, 0, 0.16))',
      },
      height: {
        'control-sm': '28px',
        'control-md': '34px',
        'control-lg': '40px',
      },
      minHeight: {
        'control-sm': '28px',
        'control-md': '34px',
        'control-lg': '40px',
      },
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms'),
  ],
};
