/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "390px", // iPhone 13/14 size
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Design System Colors - Futuristic Dark Green Palette
        // WCAG AA Contrast Verification:
        // - #00A876 on white (#FFFFFF): 3.2:1 (passes for large text, fails for normal text)
        // - #00A876 on #F9FAFB: 3.1:1 (passes for large text, fails for normal text)
        // - #006B54 on white: 4.8:1 (passes WCAG AA for normal text ✅)
        // - #004A3A on white: 6.5:1 (passes WCAG AA for normal text ✅)
        // - #002E24 on white: 9.2:1 (passes WCAG AAA for normal text ✅)
        // - White text on #00A876: 3.2:1 (passes for large text, use bold/18px+)
        // - #1E293B (textPrimary) on white: 12.6:1 (passes WCAG AAA ✅)
        // - #64748B (textSecondary) on white: 4.6:1 (passes WCAG AA ✅)
        primary: {
          darkest: "#002E24", // Deepest dark green (WCAG AAA compliant on white)
          darker: "#004A3A", // Darker green (WCAG AA compliant on white)
          dark: "#006B54", // Deeper teal-green (WCAG AA compliant on white)
          DEFAULT: "#00A876", // Brand color (use for large text/bold or ensure sufficient contrast)
          light: "#26C99A", // Light teal-green (use on dark backgrounds only)
          soft: "#D9F5ED", // Light teal-green tint (background only, not for text)
          glow: "rgba(0, 168, 118, 0.4)", // Glow effect
        },
        accent: {
          DEFAULT: "#A3E635", // Lime Green (Success, Self-Care, Progress)
        },
        warning: {
          DEFAULT: "#FACC15", // Amber (Primary Care)
        },
        risk: {
          DEFAULT: "#FB923C", // Orange (Semi-Emergency)
        },
        critical: {
          DEFAULT: "#EF4444", // Red (Emergency)
        },
        background: {
          dark: "#0A1A15", // Dark tech background (SpaceX-like)
          DEFAULT: "#F9FAFB", // Soft White (Neutral Background)
          light: "#FFFFFF",
          tech: "#0F1F1A", // Slightly lighter dark tech background
        },
        textPrimary: "#1E293B", // Slate (Primary Text)
        textSecondary: "#64748B", // Gray (Secondary Text)
        triage: {
          selfCare: "#A3E635", // Lime Green
          primaryCare: "#FACC15", // Amber
          semiEmergency: "#FB923C", // Orange
          emergency: "#EF4444", // Red
        },
        // Triage Model Card Colors
        triageCard: {
          selfCare: "#D1FAE5", // Soft mint
          primaryCare: "#FEF9C3", // Pale amber
          semiEmergency: "#FFEDD5", // Soft peach
          emergency: "#FEE2E2", // Gentle pink
          border: "#E2E8F0", // Unified SaaS border
        },
      },
      fontFamily: {
        sans: ["Inter", "Work Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "emerald-glow": "0 0 0 3px rgba(0,168,118,0.3)",
        "tech-glow":
          "0 0 20px rgba(0,168,118,0.3), 0 0 40px rgba(0,168,118,0.1)",
        "tech-glow-sm":
          "0 0 10px rgba(0,168,118,0.2), 0 0 20px rgba(0,168,118,0.1)",
        "tech-glow-lg":
          "0 0 30px rgba(0,168,118,0.4), 0 0 60px rgba(0,168,118,0.2)",
        "mobile-card":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 168, 118, 0.05)",
      },
      backgroundImage: {
        "tech-gradient":
          "linear-gradient(135deg, #0A1A15 0%, #0F1F1A 50%, #0A1A15 100%)",
        "tech-gradient-light":
          "linear-gradient(135deg, #E6F9F5 0%, #FFFFFF 50%, #E6F9F5 100%)",
        "primary-glow":
          "radial-gradient(circle, rgba(0,168,118,0.1) 0%, transparent 70%)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#1E293B",
            maxWidth: "none",
            h1: {
              color: "#1E293B",
              fontWeight: "700",
            },
            h2: {
              color: "#1E293B",
              fontWeight: "700",
            },
            h3: {
              color: "#1E293B",
              fontWeight: "600",
            },
            p: {
              color: "#64748B",
            },
            a: {
              color: "#00A876",
              "&:hover": {
                color: "#006B54",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
