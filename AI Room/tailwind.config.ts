import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))"
      },
      fontFamily: {
        sans: ["'SF Pro Display'", "'PingFang SC'", "'Noto Sans SC'", "sans-serif"],
        serif: ["'Iowan Old Style'", "'Source Han Serif SC'", "serif"]
      },
      boxShadow: {
        halo: "0 0 80px rgba(233, 225, 255, 0.45)",
        mist: "0 24px 80px rgba(161, 145, 184, 0.12)"
      },
      backgroundImage: {
        "portal-radial":
          "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(234,225,255,0.92) 28%, rgba(214,207,238,0.62) 52%, rgba(245,242,248,0.08) 76%, rgba(245,242,248,0) 100%)"
      },
      animation: {
        drift: "drift 16s ease-in-out infinite",
        glow: "glow 8s ease-in-out infinite",
        shimmer: "shimmer 12s linear infinite"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -14px, 0)" }
        },
        glow: {
          "0%, 100%": { opacity: "0.55", transform: "scale(0.98)" },
          "50%": { opacity: "0.9", transform: "scale(1.03)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
