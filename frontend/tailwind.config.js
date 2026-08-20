/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#070a10',
          900: '#0c1017',
          850: '#111722',
          800: '#172030',
          750: '#1e293b',
          700: '#27354a',
          600: '#384860',
          500: '#526580',
        },
        aerospace: {
          blue: '#2563eb',
          cyan: '#0284c7',
          sky: '#38bdf8',
          teal: '#0d9488',
          emerald: '#10b981',
          amber: '#d97706',
          orange: '#ea580c',
          rose: '#e11d48',
          purple: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'glow-blue': '0 0 16px -2px rgba(37, 99, 235, 0.35)',
        'glow-cyan': '0 0 16px -2px rgba(56, 189, 248, 0.35)',
        'glow-purple': '0 0 16px -2px rgba(124, 58, 237, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
      }
    },
  },
  plugins: [],
};

