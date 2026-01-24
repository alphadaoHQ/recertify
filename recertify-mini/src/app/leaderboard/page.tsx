'use client';

import { Box, Typography, Card, CardContent, Avatar, Stack, Chip, Divider, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { EmojiEvents as TrophyIcon, LocalFireDepartment as FireIcon } from '@mui/icons-material';

interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  points: number;
  level: number;
  badge: string;
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    userId: '1',
    username: 'CryptoMaster',
    avatar: '👑',
    points: 5420,
    level: 12,
    badge: '🏆',
  },
  {
    rank: 2,
    userId: '2',
    username: 'BlockchainPro',
    avatar: '🔗',
    points: 4890,
    level: 11,
    badge: '⭐',
  },
  {
    rank: 3,
    userId: '3',
    username: 'DeFiGuru',
    avatar: '💰',
    points: 4520,
    level: 10,
    badge: '💎',
  },
  {
    rank: 4,
    userId: '4',
    username: 'SmartDev',
    avatar: '🧠',
    points: 4100,
    level: 9,
    badge: '🔥',
  },
  {
    rank: 5,
    userId: '5',
    username: 'CodeNinja',
    avatar: '🥷',
    points: 3850,
    level: 8,
    badge: '⚡',
  },
  // Your user (example)
  {
    rank: 15,
    userId: 'you',
    username: 'You',
    avatar: '😎',
    points: 2150,
    level: 5,
    badge: '🎯',
  },
];

export default function Leaderboard() {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ py: 2 }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="headlineSmall" sx={{ fontWeight: 700, mb: 1 }}>
              Leaderboard 🏆
            </Typography>
            <Typography variant="bodyMedium" color="textSecondary">
              Compete with other learners
            </Typography>
          </Box>
        </motion.div>

        {/* Timeframe Filter */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {(['week', 'month', 'all'] as const).map(tf => (
              <Chip
                key={tf}
                label={tf.charAt(0).toUpperCase() + tf.slice(1)}
                onClick={() => setTimeframe(tf)}
                variant={timeframe === tf ? 'filled' : 'outlined'}
                color={timeframe === tf ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5, mb: 2 }}>
              {topThree.map((user, index) => {
                const positions = [1, 2, 0]; // 2nd place first, then 1st, then 3rd
                const positions_heights = ['80px', '120px', '60px'];
                const actualIndex = index === 0 ? 1 : index === 1 ? 0 : 2;

                return (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                          borderRadius: 2,
                          p: 1.5,
                          mb: 1,
                          height: positions_heights[actualIndex],
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          boxShadow: actualIndex === 1 ? 4 : 1,
                        }}
                      >
                        {actualIndex === 1 && (
                          <TrophyIcon sx={{ fontSize: 28, color: '#FFD700', mb: 0.5 }} />
                        )}
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            fontSize: 24,
                            mb: 0.5,
                            background: 'rgba(255, 255, 255, 0.3)',
                          }}
                        >
                          {user.avatar}
                        </Avatar>
                      </Box>
                      <Box sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}>
                        <Typography
                          variant="headlineMedium"
                          sx={{
                            fontWeight: 800,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {actualIndex + 1}
                        </Typography>
                      </Box>
                      <Typography variant="titleSmall" sx={{ fontWeight: 700 }}>
                        {user.username}
                      </Typography>
                      <Typography variant="labelSmall" color="primary" sx={{ fontWeight: 600 }}>
                        {user.points} pts
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </Box>
        </motion.div>

        {/* Rest of Leaderboard */}
        <motion.div variants={itemVariants}>
          <Stack spacing={1}>
            {rest.map((user, index) => (
              <motion.div
                key={user.userId}
                variants={itemVariants}
                custom={index}
              >
                <Card
                  sx={{
                    border: user.userId === 'you' ? `2px solid ${theme.palette.primary.main}` : undefined,
                  }}
                >
                  <CardContent sx={{ py: 1.5, px: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="titleSmall" sx={{ fontWeight: 700, minWidth: '30px' }}>
                          #{user.rank}
                        </Typography>
                        <Avatar sx={{ fontSize: 18 }}>{user.avatar}</Avatar>
                        <Box>
                          <Typography variant="labelLarge" sx={{ fontWeight: 600 }}>
                            {user.username}
                            {user.userId === 'you' && (
                              <Chip label="You" size="small" sx={{ ml: 1 }} />
                            )}
                          </Typography>
                          <Typography variant="labelSmall" color="textSecondary">
                            Lvl {user.level}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="labelLarge" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                          {user.points}
                        </Typography>
                        <Typography variant="labelSmall" color="textSecondary">
                          pts
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </motion.div>
      </Box>
    </motion.div>
  );
}
