import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
      colors: {
        enterprise: {
          navy: '#172554',
          indigo: '#4F46E5',
          indigoHover: '#4338CA',
          teal: '#0F766E',
          appBg: '#F8FAFC',
          card: '#FFFFFF',
          secondaryBg: '#F1F5F9',
          mainText: '#0F172A',
          secondaryText: '#475569',
          mutedText: '#64748B',
          disabledText: '#94A3B8',
          borderDefault: '#E2E8F0',
          borderStrong: '#CBD5E1',
        },
        brand: {
          deep: '#172554',
          indigo: '#4F46E5',
          blue: '#2563EB',
          teal: '#0F766E',
        },
        surface: {
          page: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        content: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
        },
        status: {
          todo: '#D97706',
          inProgress: '#2563EB',
          done: '#059669',
          overdue: '#DC2626',
        },
      },
      boxShadow: {
        'saas-sm': '0 1px 3px rgba(15, 23, 42, 0.05)',
        'saas-md': '0 8px 20px rgba(15, 23, 42, 0.07)',
      },
    },
  },
  plugins: [],
};

export default config;
