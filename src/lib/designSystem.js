/**
 * AyurCare Design System
 * Centralized color palette, typography, and spacing constants
 */

export const colors = {
  // Primary colors
  green900: '#1E332A',
  green700: '#2F4A3D',
  green500: '#4A6B54',
  
  // Accent colors
  sage: '#9CB39C',
  sage100: '#E7EFE4',
  gold: '#C79A4B',
  gold100: '#F4E9D2',
  
  // Neutral colors
  charcoal: '#2A2B26',
  charcoal60: '#6B6C63',
  cream: '#FAF6EC',
  beige: '#EFE6CF',
  beige200: '#F5EFDF',
  white: '#FFFFFF',
  
  // Semantic colors
  danger: '#B4553F',
  line: '#E1D9C4',
};

export const typography = {
  // Font families
  fontSans: "'Inter', sans-serif",
  fontDisplay: "'Poppins', sans-serif",
  
  // Font weights
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
};

export const spacing = {
  xs: '6px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '40px',
  '4xl': '52px',
  '5xl': '56px',
  '6xl': '64px',
};

export const radii = {
  small: '6px',
  medium: '12px',
  large: '20px',
  round: '999px',
};

export const shadows = {
  default: '0 8px 24px rgba(30, 51, 42, 0.08)',
  small: '0 2px 6px rgba(0, 0, 0, 0.12)',
};

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1320px',
};

// Utility function for responsive values
export const responsive = (mobile, tablet, desktop) => ({
  mobile,
  tablet,
  desktop,
});
