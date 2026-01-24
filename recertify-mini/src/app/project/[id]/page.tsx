'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, LinearProgress, Chip, Button, Card as MuiCard, CardContent, Grid, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Rating } from '@mui/material';
import { ArrowBack, PlayArrow, Lock, CheckCircle, Timer, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PROJECTS_DATA } from '@/lib/projectData';
import Card from '@/components/md3/cards/Card';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const project = PROJECTS_DATA.find((p) => p.id === projectId);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);

  if (!project) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Project not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => router.push('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const calculateProgress = () => {
    const completedModules = project.learningModules.filter((m) => m.isCompleted).length;
    return Math.round((completedModules / project.learningModules.length) * 100);
  };

  const handleModuleClick = (index: number) => {
    setSelectedModuleIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedModuleIndex(null);
  };

  const handleStartQuiz = () => {
    const module = project.learningModules[selectedModuleIndex!];
    if (module.quizId) {
      router.push(`/quiz/${module.quizId}`);
    }
    handleCloseDialog();
  };

  const progress = calculateProgress();

  return (
    <Container maxWidth="md" sx={{ pb: 12, pt: 2 }}>
      {/* Header with back button */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/')}
            sx={{
              textTransform: 'none',
              color: 'text.primary',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
            }}
          >
            Back
          </Button>
        </Box>
      </motion.div>

      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${getDifficultyColor(project.difficulty)}20, ${getDifficultyColor(project.difficulty)}40)`,
            border: `2px solid ${getDifficultyColor(project.difficulty)}`,
            borderRadius: 3,
            p: 4,
            mb: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h2" sx={{ fontSize: '4rem', mb: 2 }}>
            {project.icon}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            {project.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {project.description}
          </Typography>

          {/* Badges */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Chip
              label={project.difficulty}
              size="small"
              sx={{
                backgroundColor: getDifficultyColor(project.difficulty),
                color: 'white',
                fontWeight: 600
              }}
            />
            <Chip label={project.category} size="small" variant="outlined" />
            <Chip icon={<Star />} label={project.rating} size="small" sx={{ color: '#FFB800' }} />
          </Box>

          {/* Stats Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 2,
              mb: 3,
              mt: 3
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Estimated Time
              </Typography>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 0.5 }}>
                <Timer sx={{ fontSize: '1.2rem' }} />
                {project.estimatedTime}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Points Reward
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                +{project.pointsReward}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Modules
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {project.learningModules.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Completed
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {project.completedCount}
              </Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Progress Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Your Progress
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, #667eea 0%, #764ba2 100%)`
              }
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
            {project.learningModules.filter((m) => m.isCompleted).length} of {project.learningModules.length} modules completed
          </Typography>
        </Box>
      </motion.div>

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          aria-label="project tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab label="Learning Modules" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Information" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          {project.learningModules.map((module, index) => (
            <Grid item xs={12} key={module.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  onClick={() => handleModuleClick(index)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    },
                    opacity: module.isCompleted ? 0.7 : 1
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: module.isCompleted
                            ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 700
                        }}
                      >
                        {module.order}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {module.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          {module.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Timer sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {module.duration} minutes
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      {module.isCompleted ? (
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: '2rem' }} />
                      ) : (
                        <PlayArrow sx={{ color: 'primary.main', fontSize: '2rem' }} />
                      )}
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Project Info */}
          <Grid item xs={12} sm={6}>
            <Card>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  About This Project
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {project.description}
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* Tags */}
          <Grid item xs={12} sm={6}>
            <Card>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Topics Covered
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {project.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Community Stats */}
          <Grid item xs={12}>
            <Card>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Community Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Completed By
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        {project.completedCount}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Average Rating
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Rating value={project.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {project.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Total Modules
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        {project.learningModules.length}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Points Available
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        +{project.pointsReward}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Module Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedModuleIndex !== null && (
          <>
            <DialogTitle sx={{ fontWeight: 600 }}>
              Module {project.learningModules[selectedModuleIndex].order}
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {project.learningModules[selectedModuleIndex].title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {project.learningModules[selectedModuleIndex].description}
              </Typography>
              <Box
                sx={{
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: 2,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <Timer sx={{ color: 'text.secondary' }} />
                <Typography variant="body2">
                  Estimated Time: {project.learningModules[selectedModuleIndex].duration} minutes
                </Typography>
              </Box>
              {project.learningModules[selectedModuleIndex].isCompleted && (
                <Box
                  sx={{
                    background: '#E8F5E9',
                    borderRadius: 2,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                    border: '1px solid #4CAF50'
                  }}
                >
                  <CheckCircle sx={{ color: '#4CAF50' }} />
                  <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                    Module Completed
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
                Close
              </Button>
              {project.learningModules[selectedModuleIndex].quizId && (
                <Button
                  onClick={handleStartQuiz}
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                  startIcon={<PlayArrow />}
                >
                  Start Quiz
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
