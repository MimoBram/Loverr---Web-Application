import type { Config } from "tailwindcss";

// Design tokens pulled directly from the Loverr Figma Design System
// (📌 Design System > 🎨 Foundations — Color Palette / 🔤 Typography / 📐 Grid)
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Theme-reactive neutrals — actual values are CSS custom properties
        // defined in globals.css (:root = light, .dark = dark). This means
        // every existing `bg-cream`, `text-ink`, `border-divider`, etc.
        // across the whole app automatically adapts to dark mode with zero
        // per-screen changes — only the two overloaded tokens (`ink` and
        // `white` used as *solid brand-black chrome* rather than *adaptive
        // text/surface*) needed to be split out into the static `onyx`
        // token below.
        cream: "var(--color-cream)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        subtle: "var(--color-subtle)",
        "input-stroke": "var(--color-input-stroke)",
        divider: "var(--color-divider)",
        disabled: "var(--color-disabled)",
        // Static (non-theme-reactive) colors — brand accents and solid
        // black UI chrome (nav bar, primary buttons, icon badges, scrims)
        // that should look identical in light and dark mode.
        white: "#ffffff",
        onyx: "#1a171c",
        rose: "#d62e45",
        "rose-deep": "#9e384d",
        "soft-pink": "#ed8ca8",
        coral: "#e97045",
        violet: "#9e7ad9",
        periwinkle: "#808de3",
        error: "#c64343",
        // quiz-specific accent (lighter warm peach used only on Quiz Interaction)
        "quiz-accent": "#ed8f66",
        "quiz-mascot-brown": "#a8634d",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      fontSize: {
        display: ["42px", { lineHeight: "50px", fontWeight: "800" }],
        heading: ["21px", { lineHeight: "28px", fontWeight: "700" }],
        "section-title": ["18px", { lineHeight: "24px", fontWeight: "800" }],
        "card-title": ["19px", { lineHeight: "24px", fontWeight: "800" }],
        "body-medium": ["14.5px", { lineHeight: "22px", fontWeight: "500" }],
        label: ["13px", { lineHeight: "18px", fontWeight: "700" }],
        body: ["13px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
        button: ["16px", { lineHeight: "24px", fontWeight: "700" }],
        "script-accent": ["24px", { lineHeight: "32px", fontWeight: "400" }],
      },
      spacing: {
        // 8pt scale (matches Space/4 ... Space/128 in the Design System)
        4.5: "18px",
      },
      borderRadius: {
        card: "24px",
        "card-md": "26px",
        "card-lg": "32px",
        pill: "9999px",
        squircle: "16.64px", // 32% of 52px badge — matches Design System squircle spec
        input: "22px",
      },
      maxWidth: {
        screen: "375px", // Loverr is mobile-only, single fixed layout grid
      },
    },
  },
  plugins: [],
};
export default config;
