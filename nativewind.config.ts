import type { Config } from 'tailwindcss';

const config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
    './stores/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  nativewind: {
    input: './styles/tailwind.css',
  },
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0F172A',
          light: '#F8FAFC',
        },
        primary: {
          DEFAULT: '#22D3EE',
          dark: '#0EA5E9',
        },
        muted: {
          DEFAULT: '#94A3B8',
        },
        // Add semantic color tokens for better consistency
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        // Add state colors
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System', 'sans-serif'],
      },
      // Add spacing scale for consistent layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // Add border radius for consistent rounded corners
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // Add animation utilities for React Native
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  // NativeWind specific optimizations
  corePlugins: {
    // Disable unused core plugins for better performance
    appearance: false,
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
  },
  plugins: [],
} satisfies Config;

export default config;
