'use client';

import { Box, Typography, Card, CardContent, Button as MuiButton, Chip, Stack, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share as ShareIcon, Check as CheckIcon } from '@mui/icons-material';

interface SocialTask {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  action: 'share' | 'invite' | 'review' | 'follow';
  isCompleted: boolean;
  reward: string;
}

const SOCIAL_TASKS: SocialTask[] = [
  {
    id: '1',
    title: 'Share Your Progress',
    description: 'Share your latest achievement on Telegram',
    icon: '📢',
    points: 50,
    action: 'share',
    isCompleted: false,
    reward: '+50 pts',
  },
  {
    id: '2',
    title: 'Invite a Friend',
    description: 'Invite your friend to join Recertify Mini',
    icon: '👥',
    points: 100,
    action: 'invite',
    isCompleted: false,
    reward: '+100 pts',
  },
  {
    id: '3',
    title: 'Complete a Review',
    description: 'Leave a review for a completed project',
    icon: '⭐',
    points: 30,
    action: 'review',
    isCompleted: false,
    reward: '+30 pts',
  },
  {
    id: '4',
    title: 'Follow Us',
    description: 'Follow our updates on social media',
    icon: '🔗',
    points: 25,
    action: 'follow',
    isCompleted: false,
    reward: '+25 pts',
  },
  {
    id: '5',
    title: 'Daily Check-in',
    description: 'Log in to the app daily for 7 consecutive days',
    icon: '🔥',
    points: 200,
    action: 'share',
    isCompleted: true,
    reward: '+200 pts',
  },
];

export default function SocialTasks() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<SocialTask[]>(SOCIAL_TASKS);
  const [openInvite, setOpenInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

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

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: true } : t));
  };

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalPoints = tasks.filter(t => t.isCompleted).reduce((sum, t) => sum + t.points, 0);

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
              Social Tasks 📱
            </Typography>
            <Typography variant="bodyMedium" color="textSecondary">
              Earn bonus points by sharing and engaging
            </Typography>
          </Box>
        </motion.div>

        {/* Progress Card */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="bodySmall" sx={{ opacity: 0.9, mb: 0.5 }}>
                    Tasks Completed
                  </Typography>
                  <Typography variant="headlineMedium" sx={{ fontWeight: 700 }}>
                    {completedTasks}/{tasks.length}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="bodySmall" sx={{ opacity: 0.9, mb: 0.5 }}>
                    Earned This Week
                  </Typography>
                  <Typography variant="headlineMedium" sx={{ fontWeight: 700, color: '#FFD700' }}>
                    +{totalPoints} pts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasks List */}
        <Stack spacing={2}>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -4 }}
            >
              <Card
                sx={{
                  opacity: task.isCompleted ? 0.7 : 1,
                  transition: 'all 0.3s',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="titleSmall" sx={{ fontSize: '24px' }}>
                          {task.icon}
                        </Typography>
                        <Typography variant="titleSmall" sx={{ fontWeight: 700 }}>
                          {task.title}
                        </Typography>
                        {task.isCompleted && (
                          <CheckIcon sx={{ color: 'green', fontSize: 18, ml: 'auto' }} />
                        )}
                      </Box>
                      <Typography variant="bodySmall" color="textSecondary" sx={{ mb: 1 }}>
                        {task.description}
                      </Typography>
                      <Chip
                        label={task.reward}
                        size="small"
                        sx={{
                          backgroundColor: task.isCompleted ? '#E8F5E9' : theme.palette.primary.light,
                          color: task.isCompleted ? '#2E7D32' : theme.palette.primary.main,
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </Box>

                  {!task.isCompleted && (
                    <MuiButton
                      variant="contained"
                      size="small"
                      startIcon={<ShareIcon />}
                      onClick={() => {
                        if (task.action === 'invite') {
                          setOpenInvite(true);
                        } else {
                          handleTaskComplete(task.id);
                        }
                      }}
                      sx={{ mt: 1.5, textTransform: 'none' }}
                    >
                      {task.action === 'share' && 'Share Now'}
                      {task.action === 'invite' && 'Invite Friend'}
                      {task.action === 'review' && 'Leave Review'}
                      {task.action === 'follow' && 'Follow'}
                    </MuiButton>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>

        {/* Invite Dialog */}
        <Dialog open={openInvite} onClose={() => setOpenInvite(false)}>
          <DialogTitle>Invite a Friend</DialogTitle>
          <DialogContent sx={{ minWidth: '300px' }}>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Friend's Email"
                type="email"
                value={inviteEmail}
                onChange={(e: any) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
              />
              <Typography variant="bodySmall" color="textSecondary" sx={{ mt: 1 }}>
                They'll receive an invitation link to join Recertify Mini
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setOpenInvite(false)}>Cancel</MuiButton>
            <MuiButton
              variant="contained"
              onClick={() => {
                handleTaskComplete('2');
                setOpenInvite(false);
                setInviteEmail('');
              }}
              disabled={!inviteEmail}
            >
              Send Invite
            </MuiButton>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
}
