/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          750: '#2a3441',
          800: '#1f2937',
          850: '#18212f',
          900: '#111827',
        },
      },
    },
  },
  darkMode: 'class',
  safelist: [
    {
      pattern: /bg-(gray|indigo|blue|green|red|yellow|purple|pink)-(50|100|200|300|400|500|600|700|750|800|850|900)/,
      variants: ['hover', 'dark', 'dark:hover'],
    },
    {
      pattern: /text-(gray|indigo|blue|green|red|yellow|purple|pink)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'dark', 'dark:hover'],
    },
    {
      pattern: /border-(gray|indigo|blue|green|red|yellow|purple|pink)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'dark', 'dark:hover'],
    },
  ],
  plugins: [],
}