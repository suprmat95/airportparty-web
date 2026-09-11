import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          soft: '#EFF6FF',
          dark: '#1D4ED8',
        },
        warning: {
          DEFAULT: '#D97706',
          soft: '#FFFBEB',
        },
        bg: '#F8FAFC',
        card: {
          DEFAULT: '#FFFFFF',
          alt: '#F1F5F9',
        },
        ink: {
          DEFAULT: '#0F172A',
          soft: '#475569',
          muted: '#94A3B8',
        },
        line: '#E2E8F0',
        success: '#16A34A',
        error: '#DC2626',
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '8px',
        pill: '999px',
      },
      boxShadow: {
        DEFAULT: 'none',
        lg: '0 8px 24px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tight: '-0.4px',
        label: '0.6px',
      },
      borderColor: {
        DEFAULT: '#E2E8F0',
      },
    },
  },
  plugins: [],
};

export default config;
