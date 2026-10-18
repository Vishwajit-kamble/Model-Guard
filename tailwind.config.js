/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#F7F7F2',
          surface: '#FFFFFF',
          midnight: '#17212B',
          slate: '#64748B',
          'slate-light': '#94A3B8',
          border: '#E7E9E4',
          'border-subtle': '#F0F2ED',
          indigo: '#635BFF',
          'indigo-dark': '#4F46E5',
          'indigo-light': '#847DFF',
          'indigo-tint': '#EEF0FF',
          'indigo-subtle': '#F5F6FF',
          mint: '#79E2B5',
          'mint-dark': '#10B981',
          'mint-deep': '#059669',
          'mint-tint': '#E8FBF2',
          sky: '#A9D8FF',
          'sky-tint': '#EFF7FF',
          amber: '#F4B942',
          'amber-dark': '#D97706',
          'amber-tint': '#FEF7E6',
          coral: '#F16C68',
          'coral-dark': '#E04843',
          'coral-tint': '#FDEEEC',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 33, 43, 0.04), 0 1px 2px -1px rgba(23, 33, 43, 0.03)',
        'card': '0 4px 12px 0 rgba(23, 33, 43, 0.04), 0 1px 3px 0 rgba(23, 33, 43, 0.02)',
        'card-hover': '0 10px 25px -3px rgba(99, 91, 255, 0.08), 0 4px 10px -2px rgba(23, 33, 43, 0.04)',
        'float': '0 20px 30px -10px rgba(23, 33, 43, 0.08)',
        'glow-indigo': '0 0 20px -3px rgba(99, 91, 255, 0.35)',
        'glow-mint': '0 0 20px -3px rgba(121, 226, 181, 0.45)',
        'glow-amber': '0 0 20px -3px rgba(244, 185, 66, 0.4)',
        'glow-coral': '0 0 20px -3px rgba(241, 108, 104, 0.4)',
      },
      keyframes: {
        'orbit-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'orbit-spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '80%, 100%': { transform: 'scale(1.8)', opacity: '0' },
        }
      },
      animation: {
        'orbit': 'orbit-spin 24s linear infinite',
        'orbit-fast': 'orbit-spin 12s linear infinite',
        'orbit-reverse': 'orbit-spin-reverse 32s linear infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
