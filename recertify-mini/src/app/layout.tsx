'use client';

import { CssBaseline, Container, Box, useTheme } from '@mui/material';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { BottomNav } from '@/components/common/BottomNav';
import { Roboto } from 'next/font/google';
import { ReactNode } from 'react';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayoutContent({ children }: RootLayoutProps) {
  const theme = useTheme();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#6750A4" />
        <title>Recertify Mini - Learn Web3</title>
        <meta name="description" content="Learn Web3, Blockchain, and DeFi through interactive quizzes and projects" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: roboto.style.fontFamily }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
          }}
        >
          <Box sx={{ flex: 1, paddingBottom: '80px', paddingTop: '16px' }}>
            <Container maxWidth="sm" sx={{ px: 2 }}>
              {children}
            </Container>
          </Box>
          <BottomNav />
        </Box>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </ThemeProvider>
  );
}
