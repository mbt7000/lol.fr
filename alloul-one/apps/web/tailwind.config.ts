import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060B18',
        card: '#0B1328',
        edge: '#1D2A4A',
        neon: '#8B5CF6',
        cyan: '#22D3EE',
      },
      boxShadow: {
        neon: '0 0 40px rgba(139,92,246,.35)',
      },
      backgroundImage: {
        aurora: 'radial-gradient(1200px 500px at 70% 10%, rgba(34,211,238,.22), transparent), radial-gradient(900px 500px at 25% 40%, rgba(139,92,246,.2), transparent)'
      }
    },
  },
  plugins: [],
}

export default config
