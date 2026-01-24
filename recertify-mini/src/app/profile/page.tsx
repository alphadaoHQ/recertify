'use client';

import { Box, Typography, Card, CardContent, Avatar, Button as MuiButton, Stack, Divider, useTheme, Chip, LinearProgress, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Share as ShareIcon, Edit as EditIcon } from '@mui/icons-material';

interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAt: string;
}

export default function Profile() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isEditingWallet, setIsEditingWallet] = useState(false);

  const userProfile = {
    name: 'Crypto Learner',
    avatar: '👨‍💻',
    level: 5,
    points: 2150,
    streak: 7,
    joinDate: '2024-01-15',
    wallet: '0x742d...3d0',
    achievements: 12,
    projectsCompleted: 3,
    quizzesCompleted: 18,
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      icon: '🎯',
      description: 'Completed your first quiz',
      unlockedAt: '2024-01-20',
    },
    {
      id: '2',
      title: 'DeFi Master',
      icon: '💰',
      description: 'Completed DeFi Fundamentals project',
      unlockedAt: '2024-01-25',
    },
    {
      id: '3',
      title: 'Quiz Warrior',
      icon: '⚔️',
      description: 'Completed 10 quizzes',
      unlockedAt: '2024-01-28',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ py: 2 }}>
        {/* Profile Header Card */}
        <motion.div variants={itemVariants}>
          <Card
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      fontSize: 32,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {userProfile.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="headlineSmall" sx={{ fontWeight: 700 }}>
                      {userProfile.name}
                    </Typography>
                    <Typography variant="bodySmall" sx={{ opacity: 0.9 }}>
                      Level {userProfile.level} Learner
                    </Typography>
                  </Box>
                </Box>
                <MuiButton
                  startIcon={<SettingsIcon />}
                  sx={{ color: 'white', textTransform: 'none' }}
                  size="small"
                >
                  Settings
                </MuiButton>
              </Box>

              {/* Stats Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="labelSmall" sx={{ opacity: 0.9 }}>
                    Total Points
                  </Typography>
                  <Typography variant="headlineMedium" sx={{ fontWeight: 700, color: '#FFD700' }}>
                    {userProfile.points}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="labelSmall" sx={{ opacity: 0.9 }}>
                    Current Streak
                  </Typography>
                  <Typography variant="headlineMedium" sx={{ fontWeight: 700, color: '#FF6B6B' }}>
                    {userProfile.streak}d 🔥
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="labelSmall" sx={{ opacity: 0.9 }}>
                    Projects Done
                  </Typography>
                  <Typography variant="titleLarge" sx={{ fontWeight: 700 }}>
                    {userProfile.projectsCompleted}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="labelSmall" sx={{ opacity: 0.9 }}>
                    Quizzes Done
                  </Typography>
                  <Typography variant="titleLarge" sx={{ fontWeight: 700 }}>
                    {userProfile.quizzesCompleted}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet Section */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="titleSmall" sx={{ fontWeight: 700 }}>
                  TON Wallet
                </Typography>
                <MuiButton
                  size="small"
                  variant="text"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditingWallet(!isEditingWallet)}
                >
                  {isEditingWallet ? 'Done' : 'Edit'}
                </MuiButton>
              </Box>
              {!isEditingWallet ? (
                <Box
                  sx={{
                    background: theme.palette.background.default,
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'monospace',
                  }}
                >
                  <Typography variant="bodySmall">{userProfile.wallet}</Typography>
                  <MuiButton size="small" startIcon={<ShareIcon />}>
                    Copy
                  </MuiButton>
                </Box>
              ) : (
                <Box>
                  <Typography variant="bodySmall" color="textSecondary" sx={{ mb: 1 }}>
                    Enter your TON wallet address to receive rewards
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <MuiButton variant="contained" fullWidth>
                      Connect Wallet
                    </MuiButton>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Achievements and Stats */}
        <motion.div variants={itemVariants}>
          <Card>
            <Tabs
              value={tabValue}
              onChange={(e: any, newValue: number) => setTabValue(newValue)}
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <Tab label="Achievements" sx={{ textTransform: 'none' }} />
              <Tab label="Statistics" sx={{ textTransform: 'none' }} />
            </Tabs>

            <CardContent sx={{ pt: 2 }}>
              {tabValue === 0 && (
                <Stack spacing={2}>
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      variants={itemVariants}
                      custom={index}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          p: 1.5,
                          background: theme.palette.background.default,
                          borderRadius: 2,
                        }}
                      >
                        <Typography sx={{ fontSize: 32 }}>
                          {achievement.icon}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="labelLarge" sx={{ fontWeight: 700 }}>
                            {achievement.title}
                          </Typography>
                          <Typography variant="bodySmall" color="textSecondary">
                            {achievement.description}
                          </Typography>
                          <Typography variant="labelSmall" color="textSecondary" sx={{ mt: 0.5 }}>
                            Unlocked on {achievement.unlockedAt}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              )}

              {tabValue === 1 && (
                <Stack spacing={3}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="labelLarge">Level Progress</Typography>
                      <Typography variant="labelSmall">Lvl {userProfile.level}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={65}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="labelLarge" sx={{ mb: 1, display: 'block' }}>
                      Learning Breakdown
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="bodySmall">Projects Completed</Typography>
                        <Typography variant="labelSmall" sx={{ fontWeight: 700 }}>
                          {userProfile.projectsCompleted}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="bodySmall">Quizzes Completed</Typography>
                        <Typography variant="labelSmall" sx={{ fontWeight: 700 }}>
                          {userProfile.quizzesCompleted}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="bodySmall">Member Since</Typography>
                        <Typography variant="labelSmall" sx={{ fontWeight: 700 }}>
                          {userProfile.joinDate}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </motion.div>
  );
}
