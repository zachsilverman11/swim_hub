import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Inspired Swim Brand Colors
        'depths': '#004758',           // Primary brand color
        'aquamarine': '#22D1BC',       // Secondary brand color
        'splash': '#D1F2FF',           // Light accent
        // Keeping semantic naming for backwards compatibility
        'primary': '#004758',
        'secondary': '#22D1BC',
      },
      fontFamily: {
        // Inspired Swim Brand Typography
        'sans': ['Alegreya Sans', 'system-ui', 'sans-serif'],
        'heading': ['Alegreya Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
