/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "sky-900-trans": "rgba(12, 74, 110, 0.8)",
            },
            screens: {
                xs: "415px",
            },
        },
    },
    plugins: [],
};
