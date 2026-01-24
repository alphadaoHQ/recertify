'use client';

import { Box, Typography, Grid, Chip, Stack, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/home/HeroSection';
import { ProjectGrid } from '@/components/home/ProjectGrid';
import { PROJECTS_DATA } from '@/lib/projectData';

const filterOptions = ['All', 'DeFi', 'NFTs', 'Gaming', 'Infrastructure', 'Security'];

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = activeFilter === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === activeFilter);

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ py: 2 }}>
        {/* Hero Section */}
        <motion.div variants={itemVariants}>
          <HeroSection />
        </motion.div>

        {/* Filter Section */}
        <motion.div variants={itemVariants}>
          <Box sx={{ my: 3 }}>
            <Typography variant="titleMedium" sx={{ mb: 2, fontWeight: 600 }}>
              Browse Projects
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: 'auto',
                pb: 1,
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.divider,
                  borderRadius: '2px',
                },
              }}
            >
              {filterOptions.map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  onClick={() => setActiveFilter(filter)}
                  variant={activeFilter === filter ? 'filled' : 'outlined'}
                  color={activeFilter === filter ? 'primary' : 'default'}
                  sx={{
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Projects Grid */}
        <motion.div variants={itemVariants}>
          <ProjectGrid projects={filteredProjects} />
        </motion.div>

        {/* Results Info */}
        {filteredProjects.length > 0 && (
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
              <Typography variant="bodySmall" color="textSecondary">
                Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
}
