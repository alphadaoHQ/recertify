'use client';

import { Box } from '@mui/material';
import { QuizRunner } from '@/components/quiz/QuizRunner';

export default function QuizPage() {
  return (
    <Box sx={{ py: 2 }}>
      <QuizRunner />
    </Box>
  );
}
