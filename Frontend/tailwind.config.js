/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: '#0a0c10',
          panel: '#101318',
          card: '#141820',
          subcard: '#181d26',
          hover: '#1e2430',
          border: '#242b38',
          borderMuted: '#1b202a',
          text: '#e6edf3',
          muted: '#8b949e',
          dim: '#545d68',
          accent: '#d97706', // Precision amber
          accentBright: '#f59e0b',
          accentGlow: 'rgba(245, 158, 11, 0.15)',
          cyan: '#0ea5e9',
          cyanMuted: '#0284c7',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          dangerDim: 'rgba(239, 68, 68, 0.15)',
          neutral: '#6b7280'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
