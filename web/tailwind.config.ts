import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3BA0E3',
          soft: '#E8F4FD',
          dark: '#2178B5',
        },
        accent: {
          DEFAULT: '#FF8A65',
          soft: '#FFF0EB',
        },
        bg: '#FAFCFF',
        card: {
          DEFAULT: '#FFFFFF',
          alt: '#F0F7FF',
        },
        ink: {
          DEFAULT: '#1B2A3D',
          soft: '#6B8299',
          muted: '#A3B8CC',
        },
        line: '#D6E4F0',
        success: '#34C77B',
        error: '#E84855',
      },
      borderRadius: {
        DEFAULT: '20px',
        sm: '12px',
        pill: '999px',
      },
      boxShadow: {
        DEFAULT: '0 2px 12px rgba(59,160,227,0.08)',
        lg: '0 8px 32px rgba(59,160,227,0.12)',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.8px',
        tighter: '-0.5px',
        tight: '-0.2px',
        label: '1.2px',
      },
      borderColor: {
        DEFAULT: '#D6E4F0',
      },
    },
  },
  plugins: [],
};

export default config;
