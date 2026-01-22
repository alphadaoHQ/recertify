/**
 * Material Design 3 Theme Provider with ALPHA DAO Branding
 */

'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ThemeProvider, CssBaseline } from '@mui/material/styles';
import { initTelegramWebApp } from '@/lib/telegram';
import { lightTheme, darkTheme } from '@/theme';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

const _manifestUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tonconnect-manifest.json`;

interface ProvidersProps {
  children: ReactNode;
  isDarkMode?: boolean;
}

export function Providers({ children, isDarkMode = false }: ProvidersProps) {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    // Initialize Telegram Web App
    initTelegramWebApp();
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={_manifestUrl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </TonConnectUIProvider>
  );
}