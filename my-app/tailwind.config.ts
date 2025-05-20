/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Habilita el modo oscuro usando la clase 'dark'
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(var(--color-background))",
        foreground: "oklch(var(--color-foreground))",
        card: "oklch(var(--color-card))",
        "card-foreground": "oklch(var(--color-card-foreground))",
        popover: "oklch(var(--color-popover))",
        "popover-foreground": "oklch(var(--color-popover-foreground))",
        primary: "oklch(var(--color-primary))",
        "primary-foreground": "oklch(var(--color-primary-foreground))",
        secondary: "oklch(var(--color-secondary))",
        "secondary-foreground": "oklch(var(--color-secondary-foreground))",
        muted: "oklch(var(--color-muted))",
        "muted-foreground": "oklch(var(--color-muted-foreground))",
        accent: "oklch(var(--color-accent))",
        "accent-foreground": "oklch(var(--color-accent-foreground))",
        destructive: "oklch(var(--color-destructive))",
        border: "oklch(var(--color-border))",
        input: "oklch(var(--color-input))",
        ring: "oklch(var(--color-ring))",
        sidebar: "oklch(var(--color-sidebar))",
        "sidebar-foreground": "oklch(var(--color-sidebar-foreground))",
        "sidebar-primary": "oklch(var(--color-sidebar-primary))",
        "sidebar-primary-foreground": "oklch(var(--color-sidebar-primary-foreground))",
        "sidebar-accent": "oklch(var(--color-sidebar-accent))",
        "sidebar-accent-foreground": "oklch(var(--color-sidebar-accent-foreground))",
        "sidebar-border": "oklch(var(--color-sidebar-border))",
        "sidebar-ring": "oklch(var(--color-sidebar-ring))",
        "chart-1": "oklch(var(--color-chart-1))",
        "chart-2": "oklch(var(--color-chart-2))",
        "chart-3": "oklch(var(--color-chart-3))",
        "chart-4": "oklch(var(--color-chart-4))",
        "chart-5": "oklch(var(--color-chart-5))",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"DM Serif Display"', 'serif'],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['disabled'],
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
