/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Añade aliases personalizados (no arbitrarios)
      fontSize: {
        s: 12,
        m: 14,
        lg: 16,   // si no quieres sobreescribir los defaults, elimina estos y usa los de Tailwind
        xl: 18,
        xxl: 22,
      },
    },
  },
}