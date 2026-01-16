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
        lg: 16,  
        xl: 18,
        xxl: 22,
      },
      fontFamily: {
        'sans-light': ['OpenSans_300Light'],
        sans: ['OpenSans_400Regular'],
        'sans-semibold': ['OpenSans_600SemiBold'],
        'sans-bold': ['OpenSans_700Bold'],
        'Merriweather_300Light': ['Merriweather_300Light'],
        'Merriweather_400Regular': ['Merriweather_400Regular'],
        'Merriweather_700Bold': ['Merriweather_700Bold'],
        'Merriweather_900Black': ['Merriweather_900Black'],
      },
      colors: {
        primary: '#4054A1',
        accent: '#FFC107',
        textSecondary: '#666666',
      },
    },
  },
}