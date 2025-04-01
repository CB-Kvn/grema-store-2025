/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf6fa",
          100: "#fbedf5",
          200: "#f7dbeb",
          300: "#f3c9e1",
          400: "#efb7d7",
          500: "#ffc8dd",
          600: "#ffafcc",
          700: "#e69bb8",
          800: "#cc8aa3",
          900: "#b2798f",
          950: "#99688a",
        },
        accent: {
          50: "#f7f3f9",
          100: "#efe7f3",
          200: "#e3d5eb",
          300: "#d7c3e3",
          400: "#cdb4db",
          500: "#bca2c9",
          600: "#ab90b7",
          700: "#9a7ea5",
          800: "#896c93",
          900: "#785a81",
          950: "#67486f",
        },
        rose: {
          50: "#fff5f8",
          100: "#ffebf1",
          200: "#ffd7e3",
          300: "#ffc3d5",
          400: "#ffafcc",
          500: "#ff9bc3",
          600: "#ff87ba",
          700: "#ff73b1",
          800: "#ff5fa8",
          900: "#ff4b9f",
          950: "#ff3796",
        },
        button: {
          DEFAULT: "#cdb4db",
          hover: "#bca2c9",
        },
        tab: {
          DEFAULT: "#cdb4db",
          hover: "rgba(205, 180, 219, 0.1)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
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
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
