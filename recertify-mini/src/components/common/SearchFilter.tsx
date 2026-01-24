'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Collapse,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Search, FilterList, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/types';

interface SearchFilterProps {
  projects: ProjectCard[];
  onFilter: (filtered: ProjectCard[]) => void;
  onClose?: () => void;
}

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
const CATEGORY_OPTIONS = ['DeFi', 'NFTs', 'Gaming', 'Infrastructure', 'Security'];

export default function SearchFilter({
  projects,
  onFilter,
  onClose
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'difficulty' | 'points'>('rating');

  const applyFilters = useCallback(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Difficulty filter
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((p) => selectedDifficulties.includes(p.difficulty));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'points':
          return b.pointsReward - a.pointsReward;
        case 'difficulty':
          const difficultyOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
            difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        default:
          return 0;
      }
    });

    onFilter(filtered);
  }, [projects, searchTerm, selectedDifficulties, selectedCategories, sortBy, onFilter]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDifficultyToggle = (difficulty: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulties([]);
    setSelectedCategories([]);
    setSortBy('rating');
  };

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    selectedDifficulties.length +
    selectedCategories.length +
    (sortBy !== 'rating' ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3, p: 2, background: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
        {/* Search Bar */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() => setSearchTerm('')}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <Close sx={{ fontSize: '1rem' }} />
                  </Button>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }
            }}
          />
          <Button
            variant={showFilters ? 'contained' : 'outlined'}
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              textTransform: 'none',
              whiteSpace: 'nowrap',
              ...(activeFilterCount > 0 && {
                '&::after': {
                  content: `"${activeFilterCount}"`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'error.main',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginLeft: '4px'
                }
              })
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Filter Options */}
        <Collapse in={showFilters}>
          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            {/* Difficulty Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Difficulty Level
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {DIFFICULTY_OPTIONS.map((difficulty) => (
                  <Chip
                    key={difficulty}
                    label={difficulty}
                    onClick={() => handleDifficultyToggle(difficulty)}
                    variant={selectedDifficulties.includes(difficulty) ? 'filled' : 'outlined'}
                    sx={{
                      ...(selectedDifficulties.includes(difficulty) && {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      })
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Category Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Category
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {CATEGORY_OPTIONS.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => handleCategoryToggle(category)}
                    variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
                    sx={{
                      ...(selectedCategories.includes(category) && {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      })
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Sort Options */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Sort By
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {(['rating', 'difficulty', 'points'] as const).map((option) => (
                  <Button
                    key={option}
                    size="small"
                    variant={sortBy === option ? 'contained' : 'outlined'}
                    onClick={() => setSortBy(option)}
                    sx={{
                      textTransform: 'none',
                      ...(sortBy === option && {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      })
                    }}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <Button
                size="small"
                onClick={clearFilters}
                sx={{
                  textTransform: 'none',
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.light'
                  }
                }}
              >
                Clear All Filters
              </Button>
            )}
          </Box>
        </Collapse>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && !showFilters && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Active filters:
            </Typography>
            {searchTerm && (
              <Chip
                size="small"
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                variant="outlined"
              />
            )}
            {selectedDifficulties.map((d) => (
              <Chip
                key={d}
                size="small"
                label={d}
                onDelete={() => handleDifficultyToggle(d)}
                variant="outlined"
              />
            ))}
            {selectedCategories.map((c) => (
              <Chip
                key={c}
                size="small"
                label={c}
                onDelete={() => handleCategoryToggle(c)}
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
