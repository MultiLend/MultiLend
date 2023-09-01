import type { Config } from 'tailwindcss'
import { fontFamily as _fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F6E4',
        secondary: '#E8EAD6',
        outline: '#8F8F8F',
      },
      fontFamily: {
        sans: ['Inter var', ..._fontFamily.sans],
      },
    },
  },
  plugins: [],
}
export default config
