export const colors = {
  // Primary brand colors
  primary: {
    beige: {
      50: '#FDF8F3',
      100: '#F9EDE2',
      200: '#F3DBC1',
      300: '#EBC9A0',
      400: '#E3B77F',
      500: '#DBA55E', // Main brand beige
      600: '#C28A3F',
      700: '#A97020',
      800: '#8F5601',
      900: '#754700',
    },
    gold: {
      50: '#FFFDF5',
      100: '#FFF9E6',
      200: '#FFF0BF',
      300: '#FFE799',
      400: '#FFDE73',
      500: '#FFD54C', // Main brand gold
      600: '#DBAF26',
      700: '#B78A00',
      800: '#936500',
      900: '#7A4F00',
    }
  },
  // Supporting colors
  neutral: {
    50: '#F9F9F9',
    100: '#F4F4F4',
    200: '#E4E4E4',
    300: '#D3D3D3',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
};

export const blurs = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
};

export const animations = {
  // Timing functions
  easing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Duration
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
};

// Glass morphism effects
export const glass = {
  light: 'background: rgba(255, 255, 255, 0.25)',
  medium: 'background: rgba(255, 255, 255, 0.15)',
  dark: 'background: rgba(255, 255, 255, 0.05)',
};

// Typography scale
export const typography = {
  fontFamily: {
    sans: ['var(--font-vazirmatn)', 'sans-serif'],
    serif: ['var(--font-noto-naskh-arabic)', 'serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
}; 