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
  startTime: number;
  aiFeedback?: any;
  learningProgress?: any;
  fraudAnalysis?: any;
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
    startTime: Date.now(),
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleNext = async () => {
    if (isLastQuestion) {
      setIsSubmitting(true);
      
      try {
        // Submit quiz with AI integration
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - quizState.startTime) / 1000); // in seconds
        
        const response = await fetch('/api/quizzes/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'demo_user_123', // In production: get from Telegram
          },
          body: JSON.stringify({
            quizId,
            userId: 'demo_user_123',
            answers: quizState.answers,
            timeSpent,
            startTime: quizState.startTime,
            endTime,
            sessionId,
          }),
        });

        const result = await response.json();
        
        if (result.blocked) {
          // Handle fraud detection
          alert(`Submission blocked: ${result.message}`);
          return;
        }

        setQuizState({
          ...quizState,
          isComplete: true,
          aiFeedback: result.aiFeedback,
          learningProgress: result.learningProgress,
          fraudAnalysis: result.fraudAnalysis,
        });
        
      } catch (error) {
        console.error('Quiz submission failed:', error);
        alert('Failed to submit quiz. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
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
      startTime: Date.now(),
    });
    setSelectedAnswer(null);
  };

  if (quizState.isComplete) {
    return <QuizResults 
      quiz={quiz} 
      score={quizState.score} 
      aiFeedback={quizState.aiFeedback}
      learningProgress={quizState.learningProgress}
      fraudAnalysis={quizState.fraudAnalysis}
      onRestart={handleRestart} 
      onBack={() => router.back()} 
    />;
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
            disabled={!quizState.isAnswered || isSubmitting}
            onClick={handleNext}
          >
            {isSubmitting ? 'Submitting...' : (isLastQuestion ? 'See Results' : 'Next Question')}
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
  aiFeedback?: any[];
  learningProgress?: any;
  fraudAnalysis?: any;
  onRestart: () => void;
  onBack: () => void;
}

const QuizResults = ({ quiz, score, aiFeedback, learningProgress, fraudAnalysis, onRestart, onBack }: QuizResultsProps) => {
  const theme = useTheme();
  const router = useRouter();
  const percentage = Math.round((score / quiz.questions.length) * 100);
  const passed = percentage >= 70;
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showAIFeedback, setShowAIFeedback] = useState(false);

  // Calculate rewards
  useEffect(() => {
    if (passed) {
      const basePoints = 50;
      const bonusPoints = Math.round(percentage * 0.5);
      const perfectBonus = percentage === 100 ? 100 : 0;
      const fraudPenalty = fraudAnalysis ? Math.floor(fraudAnalysis.riskScore * 0.5) : 0;
      const totalPoints = Math.max(basePoints + bonusPoints + perfectBonus - fraudPenalty, Math.floor(basePoints * 0.3));
      setPointsEarned(totalPoints);
    }
  }, [passed, percentage, fraudAnalysis]);

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
              {fraudAnalysis && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="bodyMedium">Security Check:</Typography>
                  <Chip 
                    label={fraudAnalysis.warningLevel === 'none' ? 'Passed' : `Risk: ${fraudAnalysis.warningLevel}`}
                    size="small" 
                    color={fraudAnalysis.warningLevel === 'none' ? 'success' : 'warning'}
                  />
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* AI Feedback Section */}
        {aiFeedback && aiFeedback.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="titleMedium" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🤖 AI Learning Coach
                </Typography>
                <MuiButton 
                  size="small" 
                  onClick={() => setShowAIFeedback(!showAIFeedback)}
                >
                  {showAIFeedback ? 'Hide' : 'Show'} Feedback
                </MuiButton>
              </Box>
              
              {showAIFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Stack spacing={2}>
                    {aiFeedback.slice(0, 3).map((feedback: any, index: number) => (
                      <Box 
                        key={index}
                        sx={{ 
                          p: 2, 
                          background: feedback.isCorrect ? '#E8F5E9' : '#FFF3E0',
                          borderRadius: 1,
                          borderLeft: `4px solid ${feedback.isCorrect ? '#4CAF50' : '#FF9800'}`
                        }}
                      >
                        <Typography variant="labelMedium" sx={{ fontWeight: 700, mb: 1 }}>
                          Question {index + 1}: {feedback.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </Typography>
                        <Typography variant="bodySmall" sx={{ mb: 1 }}>
                          {feedback.feedback}
                        </Typography>
                        {feedback.suggestions && feedback.suggestions.length > 0 && (
                          <Typography variant="bodySmall" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                            💡 {feedback.suggestions[0]}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </motion.div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Learning Progress */}
        {learningProgress && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="titleMedium" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                📈 Learning Progress
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="bodyMedium">Overall Progress:</Typography>
                  <Typography variant="bodyMedium" sx={{ fontWeight: 700 }}>
                    {Math.round(learningProgress.overallProgress)}%
                  </Typography>
                </Box>
                {learningProgress.recommendedTopics && learningProgress.recommendedTopics.length > 0 && (
                  <Box>
                    <Typography variant="bodyMedium" sx={{ mb: 1 }}>Next Topics:</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {learningProgress.recommendedTopics.slice(0, 3).map((topic: string) => (
                        <Chip key={topic} label={topic} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

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
