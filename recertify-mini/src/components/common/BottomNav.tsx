'use client';

import { BottomNavigation, BottomNavigationAction, Box, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { Home as HomeIcon, Quiz as QuizIcon, EmojiEvents as TrophyIcon, Send as SendIcon, Person as PersonIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Quiz', path: '/quiz', icon: QuizIcon },
    { label: 'Leaderboard', path: '/leaderboard', icon: TrophyIcon },
    { label: 'Tasks', path: '/tasks', icon: SendIcon },
    { label: 'Profile', path: '/profile', icon: PersonIcon },
  ];

  const getCurrentValue = () => {
    const currentPath = pathname === '/' ? '/' : pathname;
    return navigationItems.findIndex(item => item.path === currentPath) || 0;
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(10px)',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <BottomNavigation
          value={getCurrentValue()}
          onChange={(event, newValue) => {
            router.push(navigationItems[newValue].path);
          }}
          showLabels
          sx={{
            '& .MuiBottomNavigationAction-root': {
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
              fontSize: '12px',
              minWidth: 'auto',
              flex: 1,
            },
            '& .MuiSvgIcon-root': {
              fontSize: '24px',
              transition: 'transform 0.3s ease-in-out',
            },
            '& .Mui-selected .MuiSvgIcon-root': {
              transform: 'scale(1.2)',
            },
          }}
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={<Icon />}
                sx={{
                  '&.Mui-selected': {
                    '& .MuiBottomNavigationAction-label': {
                      fontSize: '12px',
                      fontWeight: 600,
                    },
                  },
                }}
              />
            );
          })}
        </BottomNavigation>
      </Box>
    </motion.div>
  );
};
