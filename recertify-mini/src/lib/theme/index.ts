'use client';

import { createTheme } from '@mui/material/styles';
import { roboto } from 'next/font/google';

// Roboto font configuration
const robotoFont = roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Material Design 3 Light Theme
export const md3LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
      light: '#EADDFF',
      dark: '#6750A4',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71',
      light: '#E8DEF8',
      dark: '#625B71',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#7D5260',
      light: '#FFD8E4',
      dark: '#7D5260',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#BA1A1A',
      light: '#FFDAD6',
      dark: '#BA1A1A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FEF7FF',
      paper: '#FFFFFF',
    },
    surface: {
      default: '#FEF7FF',
      variant: '#E7E0EC',
    },
    text: {
      primary: '#1D1B20',
      secondary: '#49454F',
    },
    divider: '#CAC4D0',
  },
  typography: {
    fontFamily: robotoFont.style.fontFamily,
    // Material Design 3 Type Scale
    displayLarge: {
      fontSize: '57px',
      fontWeight: 400,
      lineHeight: '64px',
      letterSpacing: '-0.25px',
    },
    displayMedium: {
      fontSize: '45px',
      fontWeight: 400,
      lineHeight: '52px',
      letterSpacing: '0px',
    },
    displaySmall: {
      fontSize: '36px',
      fontWeight: 400,
      lineHeight: '44px',
      letterSpacing: '0px',
    },
    headlineLarge: {
      fontSize: '32px',
      fontWeight: 400,
      lineHeight: '40px',
      letterSpacing: '0px',
    },
    headlineMedium: {
      fontSize: '28px',
      fontWeight: 400,
      lineHeight: '36px',
      letterSpacing: '0px',
    },
    headlineSmall: {
      fontSize: '24px',
      fontWeight: 400,
      lineHeight: '32px',
      letterSpacing: '0px',
    },
    titleLarge: {
      fontSize: '22px',
      fontWeight: 500,
      lineHeight: '28px',
      letterSpacing: '0px',
    },
    titleMedium: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '24px',
      letterSpacing: '0.15px',
    },
    titleSmall: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      letterSpacing: '0.1px',
    },
    bodyLarge: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0.5px',
    },
    bodyMedium: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.25px',
    },
    bodySmall: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
      letterSpacing: '0.4px',
    },
    labelLarge: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      letterSpacing: '0.1px',
    },
    labelMedium: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.5px',
    },
    labelSmall: {
      fontSize: '11px',
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)', // level1
    '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)', // level2
    '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)', // level3
    '0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)', // level4
    '0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)', // level5
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          fontWeight: 500,
          transition: 'all 0.2s cubic-bezier(0.2, 0.0, 0.0, 1.0)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

// Material Design 3 Dark Theme
export const md3DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF',
      light: '#EADDFF',
      dark: '#6750A4',
      contrastText: '#381E72',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#E8DEF8',
      dark: '#625B71',
      contrastText: '#332D41',
    },
    tertiary: {
      main: '#EFB8C8',
      light: '#FFD8E4',
      dark: '#7D5260',
      contrastText: '#492532',
    },
    error: {
      main: '#FFB4AB',
      light: '#FFDAD6',
      dark: '#BA1A1A',
      contrastText: '#690005',
    },
    background: {
      default: '#121212',
      paper: '#1D1B20',
    },
    surface: {
      default: '#121212',
      variant: '#49454F',
    },
    text: {
      primary: '#E6E0E9',
      secondary: '#CAC4D0',
    },
    divider: '#49454F',
  },
  typography: md3LightTheme.typography,
  shape: md3LightTheme.shape,
  shadows: md3LightTheme.shadows,
  components: md3LightTheme.components,
});

export default md3LightTheme;