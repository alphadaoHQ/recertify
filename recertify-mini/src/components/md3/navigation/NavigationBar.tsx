'use client';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Home, HelpOutline as QuizIcon, EmojiEvents, Person } from '@mui/icons-material';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'quiz', label: 'Quiz', icon: QuizIcon },
  { id: 'rewards', label: 'Rewards', icon: EmojiEvents },
  { id: 'profile', label: 'Profile', icon: Person },
];

export const NavigationBar = ({ activeTab, onTabChange }: NavigationBarProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    onTabChange(tabs[newValue].id);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        borderTop: '1px solid var(--md-sys-color-outline-variant)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: 'transparent',
          height: '80px',
          '& .MuiBottomNavigationAction-root': {
            color: 'var(--md-sys-color-on-surface-variant)',
            fontSize: '12px',
            minWidth: '60px',
            paddingTop: '8px',
            paddingBottom: '12px',
            '&.Mui-selected': {
              color: 'var(--md-sys-color-primary)',
            },
            '& .MuiSvgIcon-root': {
              fontSize: '24px',
              marginBottom: '4px',
            },
          },
        }}
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <BottomNavigationAction
              key={tab.id}
              label={tab.label}
              icon={<Icon />}
            />
          );
        })}
      </BottomNavigation>
    </motion.div>
  );
};