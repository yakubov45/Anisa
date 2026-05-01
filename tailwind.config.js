/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./features/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "border-alpha": "var(--border-alpha)",
                primary: {
                    DEFAULT: "#E31E24",
                    50: "#FEF2F2",
                    600: "#DC2626",
                    700: "#B91C1C",
                },
                surface: {
                    DEFAULT: "var(--surface)",
                    50: "var(--surface-50)",
                    100: "var(--surface-100)",
                    200: "var(--surface-200)",
                    300: "var(--surface-300)",
                    400: "var(--surface-400)",
                    500: "var(--surface-500)",
                    600: "var(--surface-600)",
                    700: "var(--surface-700)",
                    800: "var(--surface-800)",
                    900: "var(--surface-900)",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                display: ["var(--font-outfit)", "sans-serif"],
                mono: ["'JetBrains Mono'", "monospace"],
            },
            boxShadow: {
                premium: "0 20px 50px rgba(0, 0, 0, var(--shadow-strength))",
                "premium-hover": "0 30px 60px rgba(227, 30, 36, 0.15)",
                "industrial": "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            },
            borderRadius: {
                "xl": "1rem",
                "2xl": "1.25rem",
                "3xl": "1.5rem",
            },
            animation: {
                "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                "scanline": "scanline 8s linear infinite",
                "scan": "scan 2.5s linear infinite",
                "progress-loading": "progress-loading 3s ease-in-out infinite",
                "bounce-slow": "bounce-slow 3s ease-in-out infinite",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "slide-up": {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "scanline": {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(100%)" },
                },
                "scan": {
                    "0%": { top: "0%" },
                    "100%": { top: "100%" },
                },
                "progress-loading": {
                    "0%": { width: "0%", marginLeft: "0%" },
                    "50%": { width: "100%", marginLeft: "0%" },
                    "100%": { width: "0%", marginLeft: "100%" },
                },
                "bounce-slow": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                }
            },
        },
    },
    plugins: [],
};
