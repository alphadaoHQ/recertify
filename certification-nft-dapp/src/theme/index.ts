/**
 * Material Design 3 Theme Configuration
 * 
 * This theme implements Google's Material Design 3 system with
 * 40% ALPHA DAO branding + 60% neutral Material Design aesthetic
 */

import { createTheme, Theme } from '@mui/material/styles';

// ALPHA DAO Brand Colors (40% branding)
const alphaDaoColors = {
  primary: {
    main: '#6B46C1', // Deep ALPHA DAO purple
    light: '#9333EA',
    dark: '#581C87',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#EC4899', // Magic pink for secondary branding
    light: '#F472B6',
    dark: '#BE185D',
    contrastText: '#FFFFFF',
  },
  brandAccent: {
    main: '#3B82F6', // Blue accent for highlights
    light: '#60A5FA',
    dark: '#2196F3',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#22C55E',
    light: '#4CAF50',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FFB74D',
    dark: '#D84315',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#B71C1C',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
};

// Material Design 3 Neutral Colors (60% MD3)
const md3Neutral = {
  surface: {
    main: '#FFFBFE',
    variant: '#F5F5F5',
    container: '#FFFFFF',
    highest: '#FFFFFF',
    dim: '#ECE6F5',
  },
  background: {
    default: '#FFFBFE',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1C1B1F',
    secondary: '#49454F',
    disabled: '#79747E',
  },
  outline: {
    main: '#79747E',
    variant: '#CAC4D0',
  },
  shadow: {
    level1: {
      color: '#000000',
      opacity: 0.04,
      offset: { x: 0, y: 1, blur: 2, spread: 0 },
    },
    level2: {
      color: '#000000',
      opacity: 0.06,
      offset: { x: 0, y: 2, blur: 4, spread: 0 },
    },
    level3: {
      color: '#000000',
      opacity: 0.08,
      offset: { x: 0, y: 4, blur: 8, spread: 0 },
    },
    level4: {
      color: '#000000',
      opacity: 0.10,
      offset: { x: 0, y: 6, blur: 12, spread: 0 },
    },
    level5: {
      color: '#000000',
      opacity: 0.12,
      offset: { x: 0, y: 8, blur: 16, spread: 0 },
    },
  },
};

// Material Design 3 Typography System
const md3Typography = {
  fontFamily: [
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Arial',
    'sans-serif',
  ],
  // Display styles
  displayLarge: {
    fontSize: '3.5625rem', // 57sp
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: '-0.25px',
  },
  displayMedium: {
    fontSize: '2.8125rem', // 45sp
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '0px',
  },
  displaySmall: {
    fontSize: '2.25rem', // 36sp
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '0px',
  },
  // Headline styles
  headlineLarge: {
    fontSize: '2rem', // 32sp
    fontWeight: 400,
    lineHeight: 1.25,
    letterSpacing: '0px',
  },
  headlineMedium: {
    fontSize: '1.75rem', // 28sp
    fontWeight: 400,
    lineHeight: 1.25,
    letterSpacing: '0px',
  },
  headlineSmall: {
    fontSize: '1.5rem', // 24sp
    fontWeight: 400,
    lineHeight: 1.33,
    letterSpacing: '0px',
  },
  // Title styles
  titleLarge: {
    fontSize: '1.375rem', // 22sp
    fontWeight: 500,
    lineHeight: 1.36,
    letterSpacing: '0px',
  },
  titleMedium: {
    fontSize: '1rem', // 16sp
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },
  titleSmall: {
    fontSize: '0.875rem', // 14sp
    fontWeight: 500,
    lineHeight: 1.43,
    letterSpacing: '0.1px',
  },
  // Body styles
  bodyLarge: {
    fontSize: '1rem', // 16sp
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.5px',
  },
  bodyMedium: {
    fontSize: '0.875rem', // 14sp
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.25px',
  },
  bodySmall: {
    fontSize: '0.75rem', // 12sp
    fontWeight: 400,
    lineHeight: 1.33,
    letterSpacing: '0.4px',
  },
  // Label styles
  labelLarge: {
    fontSize: '0.875rem', // 14sp
    fontWeight: 500,
    lineHeight: 1.29,
    letterSpacing: '0.1px',
  },
  labelMedium: {
    fontSize: '0.75rem', // 12sp
    fontWeight: 500,
    lineHeight: 1.33,
    letterSpacing: '0.5px',
  },
  labelSmall: {
    fontSize: '0.6875rem', // 11sp
    fontWeight: 500,
    lineHeight: 1.27,
    letterSpacing: '0.5px',
  },
};

// Material Design 3 Shape and Spacing
const md3Shape = {
  borderRadius: 12, // MD3 rounded corners
  borderThickness: 1,
  spacing: {
    unit: 8, // 8dp grid system
  },
};

// Combined theme with ALPHA DAO branding
export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    // ALPHA DAO colors as primary
    primary: alphaDaoColors.primary,
    secondary: alphaDaoColors.secondary,
    success: alphaDaoColors.success,
    warning: alphaDaoColors.warning,
    error: alphaDaoColors.error,
    info: alphaDaoColors.info,
    brandAccent: alphaDaoColors.brandAccent,
    // MD3 neutral colors
    background: md3Neutral.background,
    surface: md3Neutral.surface,
    text: md3Neutral.text,
    outline: md3Neutral.outline,
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: md3Typography,
  shape: md3Shape,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // MD3 button styling
          textTransform: 'none',
          borderRadius: 20,
          fontWeight: 500,
          padding: '10px 24px',
          fontFamily: md3Typography.fontFamily.join(','),
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: md3Shadow.level2,
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: md3Shadow.level1,
          },
        },
        contained: {
          // ALPHA DAO primary button
          backgroundColor: alphaDaoColors.primary.main,
          color: alphaDaoColors.primary.contrastText,
          boxShadow: md3Shadow.level2,
          '&:hover': {
            backgroundColor: alphaDaoColors.primary.dark,
            transform: 'translateY(-1px)',
            boxShadow: md3Shadow.level3,
          },
        },
        outlined: {
          // ALPHA DAO outlined button
          borderColor: alphaDaoColors.primary.main,
          color: alphaDaoColors.primary.main,
          borderWidth: 2,
          '&:hover': {
            borderWidth: 3,
            backgroundColor: `${alphaDaoColors.primary.main}08`,
          },
        },
        text: {
          // ALPHA DAO text button
          color: alphaDaoColors.primary.main,
          padding: '8px 12px',
          '&:hover': {
            backgroundColor: `${alphaDaoColors.primary.main}04`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          // MD3 card styling
          borderRadius: md3Shape.borderRadius,
          boxShadow: md3Shadow.level1,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: md3Neutral.surface.main,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: md3Shadow.level3,
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          // Telegram bottom navigation styling
          backgroundColor: md3Neutral.surface.main,
          boxShadow: md3Shadow.level3,
          borderTop: `1px solid ${md3Neutral.outline.main}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // ALPHA DAO branded header
          backgroundColor: alphaDaoColors.primary.main,
          color: alphaDaoColors.primary.contrastText,
          boxShadow: md3Shadow.level2,
        },
      },
    },
  },
});

// Dark theme variant
export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: alphaDaoColors.primary.light,
      light: '#A855F7',
      dark: '#6B46C1',
      contrastText: '#1C1B1F',
    },
    secondary: {
      main: alphaDaoColors.secondary.light,
      light: '#F8E0FF',
      dark: '#EC4899',
      contrastText: '#1C1B1F',
    },
    success: alphaDaoColors.success,
    warning: alphaDaoColors.warning,
    error: alphaDaoColors.error,
    info: alphaDaoColors.info,
    brandAccent: alphaDaoColors.brandAccent,
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    surface: {
      main: '#1E1E1E',
      variant: '#2C2C2C',
      container: '#212121',
      highest: '#2D2D2D',
      dim: '#1F1F1F',
    },
    text: {
      primary: '#E6E1E5',
      secondary: '#938F99',
      disabled: '#49454F',
    },
    outline: '#49454F',
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: md3Typography,
  shape: md3Shape,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          fontWeight: 500,
          fontFamily: md3Typography.fontFamily.join(','),
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          backgroundColor: alphaDaoColors.primary.light,
          color: alphaDaoColors.primary.dark,
          boxShadow: md3Shadow.level2,
          '&:hover': {
            backgroundColor: alphaDaoColors.primary.main,
            transform: 'translateY(-1px)',
            boxShadow: md3Shadow.level3,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: md3Shape.borderRadius,
          boxShadow: md3Shadow.level1,
          backgroundColor: md3Neutral.surface.main,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: md3Shadow.level3,
          },
        },
      },
    },
  },
});

export default {
  lightTheme,
  darkTheme,
  alphaDaoColors,
  md3Neutral,
  md3Typography,
  md3Shape,
};