import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
        },
        success: { light: '#d1fae5', DEFAULT: '#10b981', dark: '#065f46' },
        warning: { light: '#fef3c7', DEFAULT: '#f59e0b', dark: '#92400e' },
        danger:  { light: '#fee2e2', DEFAULT: '#ef4444', dark: '#991b1b' },
        info:    { light: '#dbeafe', DEFAULT: '#3b82f6', dark: '#1e40af' },
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideUp: 'slideUp 150ms ease-out',
      },
    },
  },
  plugins: [],
}

export default config
