'use client';

import { Box, Card, CardContent, Typography, Stack, LinearProgress, Chip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star as StarIcon, LocalFireDepartment as FireIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';

interface UserStats {
  points: number;
  streak: number;
  level: number;
  achievements: number;
  progress: number;
}

export const HeroSection = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<UserStats>({
    points: 1250,
    streak: 7,
    level: 5,
    achievements: 12,
    progress: 65,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const statItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          borderRadius: 3,
          boxShadow: 3,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            pointerEvents: 'none',
          },
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="headlineSmall" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome Back! 👋
            </Typography>
            <Typography variant="bodyMedium" sx={{ opacity: 0.9 }}>
              Keep learning, keep earning
            </Typography>
          </Box>

          {/* Progress */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="labelMedium" sx={{ fontWeight: 600 }}>
                Daily Progress
              </Typography>
              <Typography variant="labelSmall">{stats.progress}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stats.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#FFD700',
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          {/* Stats Grid */}
          <Stack direction="row" spacing={1}>
            {[
              { icon: StarIcon, label: 'Points', value: stats.points.toString(), color: '#FFD700' },
              { icon: FireIcon, label: 'Streak', value: `${stats.streak}d`, color: '#FF6B6B' },
              { icon: TrophyIcon, label: 'Level', value: `Lvl ${stats.level}`, color: '#4ECDC4' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  custom={index}
                  variants={statItemVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ flex: 1 }}
                >
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      p: 1.5,
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Icon sx={{ fontSize: 20, mb: 0.5, color: stat.color }} />
                    <Typography variant="labelSmall" sx={{ display: 'block', opacity: 0.8, mb: 0.25 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="titleMedium" sx={{ fontWeight: 700, color: '#FFD700' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Stack>

          {/* Achievement Badge */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <Typography variant="labelSmall" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
              Achievements Unlocked
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                >
                  <Chip
                    label={`Badge ${i + 1}`}
                    size="small"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
