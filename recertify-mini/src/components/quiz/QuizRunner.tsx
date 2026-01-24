'use client';

import { Box, Card, CardContent, Button as MuiButton, Typography, LinearProgress, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { getQuizById } from '@/lib/quizData';
import { EnhancedQuiz, QuizQuestion } from '@/types';
import { CheckCircle as CheckIcon, Cancel as XIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import Certificate from '@/components/common/Certificate';

interface QuizState {
  currentQuestionIndex: number;
  answers: (number | null)[];
  isAnswered: boolean;
  score: number;
  isComplete: boolean;
}

export const QuizRunner = () => {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const quizId = params.id as string;

  const quiz = getQuizById(quizId);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: Array(quiz?.questions.length || 0).fill(null),
    isAnswered: false,
    score: 0,
    isComplete: false,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  if (!quiz) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="headlineSmall">Quiz not found</Typography>
        <MuiButton onClick={() => router.back()} sx={{ mt: 2 }}>
          Go back
        </MuiButton>
      </Box>
    );
  }

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = quizState.currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowConfirmDialog(true);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestionIndex] = selectedAnswer;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newScore = quizState.score + (isCorrect ? 1 : 0);

    setQuizState({
      ...quizState,
      answers: newAnswers,
      isAnswered: true,
      score: newScore,
    });

    setShowConfirmDialog(false);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizState({
        ...quizState,
        isComplete: true,
      });
    } else {
      setQuizState({
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex + 1,
        isAnswered: false,
      });
      setSelectedAnswer(null);
    }
  };

  const handleRestart = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: Array(quiz.questions.length).fill(null),
      isAnswered: false,
      score: 0,
      isComplete: false,
    });
    setSelectedAnswer(null);
  };

  if (quizState.isComplete) {
    return <QuizResults quiz={quiz} score={quizState.score} onRestart={handleRestart} onBack={() => router.back()} />;
  }

  const correctAnswer = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ py: 2 }}>
        {/* Header */}
        <Card sx={{ mb: 2, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="titleMedium" sx={{ fontWeight: 700 }}>
                {quiz.title}
              </Typography>
              <Chip
                label={`${quizState.currentQuestionIndex + 1}/${quiz.questions.length}`}
                sx={{ background: 'rgba(255, 255, 255, 0.3)', color: 'white' }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#FFD700',
                  borderRadius: 3,
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quizState.currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                {/* Question */}
                <Typography variant="headlineSmall" sx={{ fontWeight: 700, mb: 3 }}>
                  {currentQuestion.question}
                </Typography>

                {/* Options */}
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectOption = index === currentQuestion.correctAnswer;
                    const isShowingResult = quizState.isAnswered;

                    let bgColor = 'transparent';
                    let borderColor = theme.palette.divider;
                    let textColor = theme.palette.text.primary;

                    if (isShowingResult) {
                      if (isCorrectOption) {
                        bgColor = '#E8F5E9';
                        borderColor = '#4CAF50';
                        textColor = '#2E7D32';
                      } else if (isSelected && !isCorrectOption) {
                        bgColor = '#FFEBEE';
                        borderColor = '#F44336';
                        textColor = '#C62828';
                      }
                    } else if (isSelected) {
                      bgColor = theme.palette.primary.light;
                      borderColor = theme.palette.primary.main;
                      textColor = theme.palette.primary.main;
                    }

                    return (
                      <motion.div
                        key={index}
                        whileHover={!quizState.isAnswered ? { scale: 1.02 } : {}}
                        whileTap={!quizState.isAnswered ? { scale: 0.98 } : {}}
                      >
                        <Box
                          onClick={() => !quizState.isAnswered && handleAnswerSelect(index)}
                          sx={{
                            p: 2,
                            border: `2px solid ${borderColor}`,
                            borderRadius: 2,
                            backgroundColor: bgColor,
                            cursor: quizState.isAnswered ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: textColor,
                          }}
                        >
                          <Typography variant="bodyMedium" sx={{ fontWeight: 500 }}>
                            {option}
                          </Typography>

                          {isShowingResult && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              {isCorrectOption ? (
                                <CheckIcon sx={{ color: '#4CAF50', fontSize: 24 }} />
                              ) : isSelected && !isCorrectOption ? (
                                <XIcon sx={{ color: '#F44336', fontSize: 24 }} />
                              ) : null}
                            </motion.div>
                          )}
                        </Box>
                      </motion.div>
                    );
                  })}
                </Stack>

                {/* Explanation (shown after answer) */}
                {quizState.isAnswered && currentQuestion.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        background: theme.palette.background.default,
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      <Typography variant="labelLarge" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
                        Explanation
                      </Typography>
                      <Typography variant="bodySmall">{currentQuestion.explanation}</Typography>
                    </Box>
                  </motion.div>
                )}

                {/* Score Display */}
                {quizState.isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        background: correctAnswer ? '#E8F5E9' : '#FFEBEE',
                        borderRadius: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="labelMedium" sx={{ color: correctAnswer ? '#2E7D32' : '#C62828', fontWeight: 700 }}>
                        {correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <MuiButton variant="outlined" fullWidth onClick={() => router.back()}>
            Cancel
          </MuiButton>
          <MuiButton
            variant="contained"
            fullWidth
            disabled={!quizState.isAnswered}
            onClick={handleNext}
          >
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </MuiButton>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
          <DialogTitle>Confirm Answer</DialogTitle>
          <DialogContent>
            <Typography variant="bodyMedium" sx={{ mt: 2 }}>
              Are you sure about this answer?
            </Typography>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setShowConfirmDialog(false)}>Change</MuiButton>
            <MuiButton variant="contained" onClick={handleSubmitAnswer}>
              Confirm
            </MuiButton>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

// Results Component
interface QuizResultsProps {
  quiz: EnhancedQuiz;
  score: number;
  onRestart: () => void;
  onBack: () => void;
}

const QuizResults = ({ quiz, score, onRestart, onBack }: QuizResultsProps) => {
  const theme = useTheme();
  const router = useRouter();
  const percentage = Math.round((score / quiz.questions.length) * 100);
  const passed = percentage >= 70;
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

  // Calculate rewards
  useEffect(() => {
    if (passed) {
      const basePoints = 50;
      const bonusPoints = Math.round(percentage * 0.5);
      const perfectBonus = percentage === 100 ? 100 : 0;
      setPointsEarned(basePoints + bonusPoints + perfectBonus);
    }
  }, [passed, percentage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ py: 2, textAlign: 'center' }}>
        {/* Celebration Animation */}
        {passed && (
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ marginBottom: '20px', fontSize: '48px' }}
          >
            🎉
          </motion.div>
        )}

        {/* Results Card */}
        <Card
          sx={{
            mb: 3,
            background: passed
              ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              : `linear-gradient(135deg, #FF9800, #F44336)`,
            color: 'white',
          }}
        >
          <CardContent sx={{ py: 4 }}>
            <Typography variant="headlineLarge" sx={{ fontWeight: 700, mb: 1 }}>
              {passed ? 'Great Job! 🏆' : 'Try Again!'}
            </Typography>

            <Typography variant="displaySmall" sx={{ fontWeight: 700, mb: 2, color: '#FFD700' }}>
              {percentage}%
            </Typography>

            <Typography variant="bodyLarge" sx={{ mb: 3 }}>
              You got {score} out of {quiz.questions.length} questions correct
            </Typography>

            {passed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <TrophyIcon sx={{ fontSize: 32 }} />
                  <Typography variant="titleLarge" sx={{ fontWeight: 700 }}>
                    +{quiz.points} Points Earned!
                  </Typography>
                </Box>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="bodyMedium">Quiz:</Typography>
                <Typography variant="bodyMedium" sx={{ fontWeight: 700 }}>
                  {quiz.title}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="bodyMedium">Difficulty:</Typography>
                <Chip label={quiz.difficulty} size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="bodyMedium">Time Taken:</Typography>
                <Typography variant="bodyMedium" sx={{ fontWeight: 700 }}>
                  ~{quiz.estimatedTime} min
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

         {/* Actions */}
         <Stack spacing={1.5}>
           {passed ? (
             <>
               {showCertificate ? (
                 <Certificate
                   userName="Your Name"
                   projectTitle={quiz.title}
                   projectId={quiz.projectId}
                   completionDate={new Date().toISOString()}
                   pointsEarned={pointsEarned}
                   score={percentage}
                   onClose={() => setShowCertificate(false)}
                 />
               ) : (
                 <>
                   <MuiButton
                     variant="contained"
                     fullWidth
                     startIcon={<TrophyIcon />}
                     onClick={() => setShowCertificate(true)}
                   >
                     Get Certificate
                   </MuiButton>
                   <MuiButton
                     variant="outlined"
                     fullWidth
                     onClick={() => router.push('/profile')}
                   >
                     View Achievement
                   </MuiButton>
                   <MuiButton variant="outlined" fullWidth onClick={() => router.push('/quiz')}>
                     Try Another Quiz
                   </MuiButton>
                 </>
               )}
             </>
           ) : (
             <>
               <MuiButton
                 variant="contained"
                 fullWidth
                 onClick={onRestart}
               >
                 Try Again
               </MuiButton>
               <MuiButton variant="outlined" fullWidth onClick={onBack}>
                 Back to Quiz List
               </MuiButton>
             </>
           )}
         </Stack>
      </Box>
    </motion.div>
  );
};
