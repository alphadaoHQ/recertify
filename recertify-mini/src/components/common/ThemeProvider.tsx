'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeConfig } from '@/types';

interface ThemeContextType {
  theme: ThemeConfig;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'light',
    primaryColor: '#6750A4',
    accentColor: '#7D5260',
    isAutoMode: false,
  });

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('recertify-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recertify-theme', JSON.stringify(theme));
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme.mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [theme.mode]);

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    }));
  };

  const setThemeMode = (mode: 'light' | 'dark') => {
    setTheme(prev => ({
      ...prev,
      mode
    }));
  };

  const isDarkMode = theme.mode === 'dark';

  // Create MUI theme based on current theme
  const muiTheme = createTheme({
    palette: {
      mode: theme.mode,
      primary: {
        main: theme.primaryColor,
      },
      secondary: {
        main: theme.accentColor,
      },
      background: {
        default: theme.mode === 'dark' ? '#121212' : '#FEF7FF',
        paper: theme.mode === 'dark' ? '#1D1B20' : '#FFFFFF',
      },
    },
    typography: {
      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 20,
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode, isDarkMode }}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};