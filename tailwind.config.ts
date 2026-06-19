import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kid: {
          // Brand
          violet: "#7B5CFF",
          "violet-deep": "#6A45F5",
          magenta: "#C24DFF",
          pink: "#FF5FA2",
          "pink-light": "#FF7BAE",
          gold: "#FFC23C",
          orange: "#FF8A3D",
          teal: "#1FC7B6",
          "teal-deep": "#11A892",
          blue: "#3B9BFF",
          // Surfaces
          base: "#F4F0FC",
          card: "#FFFFFF",
          soft: "#FBF8FF",
          sunk: "#E5DCF5",
          "footer-ink": "#1E1631",
          // Tints (saturated enough to pop on #F4F0FC base)
          "tint-violet": "#E0D4FC",
          "tint-gold": "#FDEABC",
          "tint-pink": "#FFD0E5",
          "tint-orange": "#FFD9C4",
          "tint-teal": "#B8EDE3",
          // Text on tints (same hue family, WCAG AA contrast)
          "on-violet": "#5B3CC7",
          "on-gold": "#8E5A00",
          "on-pink": "#C4225A",
          "on-orange": "#A04518",
          "on-teal": "#0D7D6C",
          // Text
          "text-strong": "#281C44",
          "text-body": "#4F4668",
          "text-soft": "#5B5470",
          "text-muted": "#8C849E",
          "text-on-color": "#FFFFFF",
          "text-on-warm": "#5A3000",
          // Semantic
          success: "#11A892",
          warning: "#FF8A3D",
          danger: "#E0306E",
          info: "#3B9BFF",
          // Difficulty badges
          "diff-easy": "#1FC7B6",
          "diff-medium": "#FFC23C",
          "diff-hard": "#E0306E",
          "diff-boss": "#7B5CFF",
        },
      },
      fontFamily: {
        heading: ["Fredoka", "Baloo 2", "Quicksand", "system-ui", "sans-serif"],
        body: ["Nunito", "Varela Round", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "kid-sm": "12px",
        "kid-md": "16px",
        "kid-lg": "20px",
        "kid-xl": "26px",
        pill: "999px",
      },
      transitionTimingFunction: {
        "kid-standard": "cubic-bezier(0.2,0.8,0.3,1)",
        "kid-overshoot": "cubic-bezier(0.34,1.56,0.64,1)",
      },
      animation: {
        wiggle: "wiggle 4s ease-in-out infinite",
        float: "floaty 5.5s ease-in-out infinite",
        "float-sm": "floaty-sm 4s ease-in-out infinite",
        pop: "pop 380ms cubic-bezier(0.34,1.56,0.64,1)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-7deg)" },
          "50%": { transform: "rotate(7deg)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        "floaty-sm": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
        pop: {
          "0%": { transform: "scale(0.6)" },
          "60%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
