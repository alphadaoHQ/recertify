'use client';

import { Box, Typography, Dialog, DialogContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Achievement } from '@/types';

interface AchievementUnlockDialogProps {
  open: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementUnlockDialog = ({
  open,
  achievement,
  onClose,
}: AchievementUnlockDialogProps) => {
  const theme = useTheme();

  if (!achievement) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 6 }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
        >
          <Box sx={{ fontSize: '80px', mb: 2 }}>
            {achievement.icon}
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Typography variant="displaySmall" sx={{ fontWeight: 700, mb: 1 }}>
            🎉 Achievement Unlocked!
          </Typography>

          <Typography variant="headlineSmall" sx={{ fontWeight: 700, mb: 2 }}>
            {achievement.title}
          </Typography>

          <Typography variant="bodyMedium" sx={{ mb: 3, opacity: 0.9 }}>
            {achievement.description}
          </Typography>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <Box
              sx={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.2)',
                px: 3,
                py: 1,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="labelLarge" sx={{ fontWeight: 700 }}>
                +{achievement.pointsReward} Points
              </Typography>
            </Box>
          </motion.div>
        </motion.div>

        {/* Confetti effect */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '24px',
          }}
        >
          ✨
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// Celebration animation component for quiz results
export const CelebrationAnimation = () => {
  return (
    <Box>
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            opacity: 0,
          }}
          transition={{
            duration: 2,
            ease: 'easeOut',
          }}
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            fontSize: '24px',
            pointerEvents: 'none',
          }}
        >
          {['🎉', '🎊', '🏆', '⭐', '✨'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </Box>
  );
};
