'use client';

import { Box, Typography, Card, CardContent, Chip, Stack, useTheme, useMediaQuery, Button as MuiButton } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ENHANCED_QUIZZES as QUIZZES_DATA } from '@/lib/quizData';
import { HelpOutline as QuizIcon, Schedule as TimerIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Quiz() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(QUIZZES_DATA.map(q => q.category))];
  const filteredQuizzes = selectedCategory
    ? QUIZZES_DATA.filter(q => q.category === selectedCategory)
    : QUIZZES_DATA;

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
        duration: 0.5,
      },
    },
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4CAF50';
      case 'Intermediate':
        return '#FF9800';
      case 'Advanced':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

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
              Quiz Arena 🎯
            </Typography>
            <Typography variant="bodyMedium" color="textSecondary">
              Test your knowledge and earn points
            </Typography>
          </Box>
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
              <Chip
                label="All"
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? 'filled' : 'outlined'}
                color={selectedCategory === null ? 'primary' : 'default'}
              />
              {categories.map(cat => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => setSelectedCategory(cat)}
                  variant={selectedCategory === cat ? 'filled' : 'outlined'}
                  color={selectedCategory === cat ? 'primary' : 'default'}
                />
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Quizzes List */}
        <Stack spacing={2}>
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
                onClick={() => router.push(`/quiz/${quiz.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="titleSmall" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {quiz.title}
                      </Typography>
                      <Typography variant="bodySmall" color="textSecondary" sx={{ mb: 1 }}>
                        {quiz.description}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 1, flexShrink: 0 }}>
                      <Typography variant="labelSmall" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        +{quiz.points}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip
                      icon={<QuizIcon />}
                      label={`${quiz.questions.length} Q`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<TimerIcon />}
                      label={`${quiz.estimatedTime}m`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={quiz.difficulty}
                      size="small"
                      sx={{
                        backgroundColor: getDifficultyColor(quiz.difficulty),
                        color: 'white',
                      }}
                    />
                  </Box>

                  {/* Social Proof */}
                  <Box sx={{ display: 'flex', gap: 2, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="labelSmall" color="textSecondary">
                      👥 {quiz.socialProof.completedCount} completed
                    </Typography>
                    <Typography variant="labelSmall" color="textSecondary">
                      ⭐ {quiz.socialProof.rating.toFixed(1)} rating
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>

        {filteredQuizzes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="bodyMedium" color="textSecondary">
              No quizzes found in this category
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
