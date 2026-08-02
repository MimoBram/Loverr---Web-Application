import type { Config } from "tailwindcss";

// Design tokens pulled directly from the Loverr Figma Design System
// (📌 Design System > 🎨 Foundations — Color Palette / 🔤 Typography / 📐 Grid)
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fcf7f0",
        white: "#ffffff",
        surface: "#f2f0f2",
        ink: "#1a171c",
        muted: "#6b676b",
        subtle: "#796f76",
        rose: "#d62e45",
        "rose-deep": "#9e384d",
        "soft-pink": "#ed8ca8",
        coral: "#e97045",
        violet: "#9e7ad9",
        periwinkle: "#808de3",
        error: "#c64343",
        "input-stroke": "#e5e0e5",
        divider: "#edeae6",
        disabled: "#c9c3bc",
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
