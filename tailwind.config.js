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
          950: '#030712',
          900: '#070B14',
          850: '#0B1120',
          800: '#0F172A',
          750: '#131E36',
          700: '#1E293B',
          600: '#334155',
          500: '#475569',
          400: '#64748B',
          300: '#94A3B8',
          200: '#CBD5E1',
          100: '#F1F5F9',
        },
        lunar: {
          cyan: '#00F0FF',
          blue: '#38BDF8',
          purple: '#A855F7',
          purpleLight: '#C084FC',
          green: '#10B981',
          greenLight: '#34D399',
          amber: '#F59E0B',
          amberLight: '#FBBF24',
          red: '#EF4444',
          redLight: '#F87171',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'glow-purple': '0 0 25px rgba(168, 85, 247, 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.35)',
        'hud': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(56, 189, 248, 0.15)',
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
