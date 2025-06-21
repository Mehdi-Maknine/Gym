/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "gym-orange": "#ff5722",
        "gym-red": "#d32f2f",
        "gym-dark": "#111827",
        "gym-gray": "#1f2937",
      },
    },
  },
  plugins: [],
};
