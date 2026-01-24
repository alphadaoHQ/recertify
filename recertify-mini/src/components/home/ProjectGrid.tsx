'use client';

import { Card, CardContent, Typography, Box, Stack, Chip, Rating, LinearProgress, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ProjectCard } from '@/types';
import { School as SchoolIcon, QueryStats as QuizIcon } from '@mui/icons-material';

interface ProjectGridProps {
  projects: ProjectCard[];
}

export const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const theme = useTheme();
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'Intermediate':
        return { bg: '#FFF3E0', text: '#E65100' };
      case 'Advanced':
        return { bg: '#FFEBEE', text: '#C62828' };
      default:
        return { bg: '#F3E5F5', text: '#6A1B9A' };
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {projects.map((project, index) => {
          const diffColor = getDifficultyColor(project.difficulty);

          return (
            <Box key={project.id}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.2, 0.0, 0.0, 1.0)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  {/* Card Image/Icon Area */}
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {project.icon}
                    </motion.div>
                  </Box>

                  <CardContent sx={{ pt: 2, pb: 2 }}>
                    {/* Title and Category */}
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="titleSmall" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {project.title}
                      </Typography>
                      <Chip
                        label={project.category}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 20,
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="bodySmall"
                      color="textSecondary"
                      sx={{
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: 40,
                      }}
                    >
                      {project.description}
                    </Typography>

                    {/* Difficulty and Rating */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box
                        sx={{
                          background: diffColor.bg,
                          color: diffColor.text,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {project.difficulty}
                      </Box>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Rating
                          value={project.rating / 2}
                          readOnly
                          size="small"
                          sx={{ fontSize: '16px' }}
                        />
                        <Typography variant="labelSmall" color="textSecondary">
                          {project.rating}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Progress Bar */}
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="labelSmall" sx={{ fontWeight: 600 }}>
                          Progress
                        </Typography>
                        <Typography variant="labelSmall" color="primary" sx={{ fontWeight: 600 }}>
                          {project.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: theme.palette.divider,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          },
                        }}
                      />
                    </Box>

                    {/* Stats Footer */}
                    <Stack direction="row" spacing={1} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SchoolIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                        <Typography variant="labelSmall" color="textSecondary">
                          {project.learningModules.length} Modules
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <QuizIcon sx={{ fontSize: 16, color: theme.palette.secondary.main }} />
                        <Typography variant="labelSmall" color="textSecondary">
                          {project.quizCount} Quiz
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="labelSmall" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                          +{project.pointsReward}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Completion Badge */}
                    {project.progress === 100 && (
                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1,
                          background: '#E8F5E9',
                          borderRadius: 1,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="labelSmall" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                          ✓ Completed
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          );
        })}
      </Box>
    </motion.div>
  );
};
