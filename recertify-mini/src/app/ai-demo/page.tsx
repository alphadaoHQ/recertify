'use client';

import { Box, Card, CardContent, Typography, Button, Stack, Chip, Alert, LinearProgress } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * AI Features Demo Page - Showcases the three AI integrations
 * 1. AI Learning Coach
 * 2. Adaptive Learning Engine  
 * 3. Fraud Detection System
 */
export default function AIDemoPage() {
  const [activeDemo, setActiveDemo] = useState<'coach' | 'adaptive' | 'fraud' | null>(null);
  const [demoResults, setDemoResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAICoachDemo = async () => {
    setLoading(true);
    setActiveDemo('coach');
    
    try {
      const response = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: 'defi-intro-quiz',
          userId: 'demo_user',
          answers: [1, 0, 1], // Mix of correct/incorrect answers
          timeSpent: 180
        })
      });
      
      const result = await response.json();
      setDemoResults(result);
    } catch (error) {
      console.error('AI Coach demo failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAdaptiveLearningDemo = async () => {
    setLoading(true);
    setActiveDemo('adaptive');
    
    try {
      const response = await fetch('/api/learning/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo_user',
          quizId: 'defi-intro-quiz',
          category: 'DeFi',
          difficulty: 'Beginner',
          score: 2,
          totalQuestions: 3,
          timeSpent: 180
        })
      });
      
      const result = await response.json();
      setDemoResults(result);
    } catch (error) {
      console.error('Adaptive Learning demo failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runFraudDetectionDemo = async () => {
    setLoading(true);
    setActiveDemo('fraud');
    
    try {
      const response = await fetch('/api/fraud/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: 'defi-intro-quiz',
          userId: 'demo_user',
          answers: [1, 1, 1],
          timeSpent: 15, // Suspiciously fast
          startTime: Date.now() - 15000,
          endTime: Date.now(),
          sessionId: 'demo_session'
        })
      });
      
      const result = await response.json();
      setDemoResults(result);
    } catch (error) {
      console.error('Fraud Detection demo failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="headlineLarge" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
        🤖 AI Features Demo
      </Typography>
      <Typography variant="bodyLarge" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        Experience the three AI integrations powering Recertify Mini
      </Typography>

      {/* Feature Cards */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        {/* AI Learning Coach */}
        <Card sx={{ cursor: 'pointer' }} onClick={runAICoachDemo}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="titleLarge" sx={{ fontWeight: 700 }}>
                🎓 AI Learning Coach
              </Typography>
              <Chip label="LLM-Powered" color="primary" />
            </Box>
            <Typography variant="bodyMedium" sx={{ mb: 2 }}>
              Provides personalized feedback after quiz completion, explains answers, and suggests next learning steps.
            </Typography>
            <Typography variant="bodySmall" sx={{ color: 'text.secondary' }}>
              • Explains correct and incorrect answers<br/>
              • Gives personalized suggestions<br/>
              • Adapts tone to user performance
            </Typography>
          </CardContent>
        </Card>

        {/* Adaptive Learning Engine */}
        <Card sx={{ cursor: 'pointer' }} onClick={runAdaptiveLearningDemo}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="titleLarge" sx={{ fontWeight: 700 }}>
                📈 Adaptive Learning Engine
              </Typography>
              <Chip label="Rule-Based AI" color="secondary" />
            </Box>
            <Typography variant="bodyMedium" sx={{ mb: 2 }}>
              Tracks learning progress, identifies weak areas, and adjusts difficulty recommendations.
            </Typography>
            <Typography variant="bodySmall" sx={{ color: 'text.secondary' }}>
              • Tracks mastery levels per topic<br/>
              • Recommends difficulty progression<br/>
              • Identifies areas needing improvement
            </Typography>
          </CardContent>
        </Card>

        {/* Fraud Detection */}
        <Card sx={{ cursor: 'pointer' }} onClick={runFraudDetectionDemo}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="titleLarge" sx={{ fontWeight: 700 }}>
                🔒 Fraud Detection System
              </Typography>
              <Chip label="Heuristic AI" color="warning" />
            </Box>
            <Typography variant="bodyMedium" sx={{ mb: 2 }}>
              Detects suspicious quiz completion patterns and prevents cheating attempts.
            </Typography>
            <Typography variant="bodySmall" sx={{ color: 'text.secondary' }}>
              • Flags extremely fast completion<br/>
              • Detects identical retry patterns<br/>
              • Calculates risk scores
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Loading State */}
      {loading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="titleMedium" sx={{ mb: 2 }}>
              Running {activeDemo === 'coach' ? 'AI Learning Coach' : 
                      activeDemo === 'adaptive' ? 'Adaptive Learning Engine' : 
                      'Fraud Detection System'} Demo...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      )}

      {/* Demo Results */}
      {demoResults && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Typography variant="titleLarge" sx={{ fontWeight: 700, mb: 3 }}>
                Demo Results: {activeDemo === 'coach' ? '🎓 AI Learning Coach' : 
                              activeDemo === 'adaptive' ? '📈 Adaptive Learning Engine' : 
                              '🔒 Fraud Detection System'}
              </Typography>

              {/* AI Coach Results */}
              {activeDemo === 'coach' && (
                <Stack spacing={2}>
                  <Alert severity="info">
                    AI Coach analyzed 3 quiz answers and generated personalized feedback
                  </Alert>
                  
                  {demoResults.feedback && demoResults.feedback.slice(0, 2).map((feedback: any, index: number) => (
                    <Box key={index} sx={{ 
                      p: 2, 
                      background: feedback.isCorrect ? '#E8F5E9' : '#FFF3E0',
                      borderRadius: 1,
                      borderLeft: `4px solid ${feedback.isCorrect ? '#4CAF50' : '#FF9800'}`
                    }}>
                      <Typography variant="labelMedium" sx={{ fontWeight: 700, mb: 1 }}>
                        Question {index + 1}: {feedback.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                      </Typography>
                      <Typography variant="bodySmall" sx={{ mb: 1 }}>
                        {feedback.feedback}
                      </Typography>
                      {feedback.suggestions && (
                        <Typography variant="bodySmall" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                          💡 Suggestion: {feedback.suggestions[0]}
                        </Typography>
                      )}
                    </Box>
                  ))}

                  {demoResults.overallFeedback && (
                    <Box sx={{ p: 2, background: '#F3E5F5', borderRadius: 1 }}>
                      <Typography variant="labelMedium" sx={{ fontWeight: 700, mb: 1 }}>
                        Overall Performance: {demoResults.overallFeedback.performanceLevel}
                      </Typography>
                      <Typography variant="bodySmall">
                        {demoResults.overallFeedback.encouragement}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )}

              {/* Adaptive Learning Results */}
              {activeDemo === 'adaptive' && (
                <Stack spacing={2}>
                  <Alert severity="success">
                    Learning state updated with new quiz performance data
                  </Alert>
                  
                  {demoResults.learningState && (
                    <Box sx={{ p: 2, background: '#E3F2FD', borderRadius: 1 }}>
                      <Typography variant="labelMedium" sx={{ fontWeight: 700, mb: 1 }}>
                        📊 Learning Progress
                      </Typography>
                      <Typography variant="bodySmall" sx={{ mb: 1 }}>
                        Overall Progress: {Math.round(demoResults.learningState.overallProgress)}%
                      </Typography>
                      <Typography variant="bodySmall">
                        Recommended Topics: {demoResults.learningState.recommendedTopics?.join(', ')}
                      </Typography>
                    </Box>
                  )}

                  {demoResults.recommendations && demoResults.recommendations.length > 0 && (
                    <Box sx={{ p: 2, background: '#FFF8E1', borderRadius: 1 }}>
                      <Typography variant="labelMedium" sx={{ fontWeight: 700, mb: 1 }}>
                        🎯 AI Recommendations
                      </Typography>
                      {demoResults.recommendations.slice(0, 2).map((rec: any, index: number) => (
                        <Typography key={index} variant="bodySmall" sx={{ display: 'block', mb: 0.5 }}>
                          • {rec.message}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Stack>
              )}

              {/* Fraud Detection Results */}
              {activeDemo === 'fraud' && (
                <Stack spacing={2}>
                  <Alert severity={demoResults.blocked ? 'error' : demoResults.warningLevel === 'none' ? 'success' : 'warning'}>
                    {demoResults.blocked ? 'Submission BLOCKED - Fraud Detected' : 
                     demoResults.warningLevel === 'none' ? 'Submission Clean - No Fraud Detected' :
                     `Submission Flagged - ${demoResults.warningLevel.toUpperCase()} Risk`}
                  </Alert>
                  
                  {demoResults.fraudDetection && (
                    <Box sx={{ p: 2, background: '#FFEBEE', borderRadius: 1 }}>
                      <Typography variant="labelMedium" sx={{ fontWeight: 700, mb: 1 }}>
                        🚨 Risk Analysis
                      </Typography>
                      <Typography variant="bodySmall" sx={{ mb: 1 }}>
                        Risk Score: {demoResults.fraudDetection.riskScore}/100
                      </Typography>
                      <Typography variant="bodySmall" sx={{ mb: 1 }}>
                        Average Time per Question: {demoResults.fraudDetection.averageTimePerQuestion.toFixed(1)}s
                      </Typography>
                      
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="labelSmall" sx={{ fontWeight: 700, mb: 0.5 }}>
                          Detected Flags:
                        </Typography>
                        {Object.entries(demoResults.fraudDetection.flags).map(([flag, detected]) => (
                          <Chip 
                            key={flag}
                            label={flag.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            size="small"
                            color={detected ? 'error' : 'default'}
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ p: 2, background: '#F3E5F5', borderRadius: 1 }}>
                    <Typography variant="bodySmall">
                      <strong>Message:</strong> {demoResults.message}
                    </Typography>
                  </Box>
                </Stack>
              )}

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setActiveDemo(null);
                    setDemoResults(null);
                  }}
                >
                  Try Another Demo
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <Card sx={{ mt: 4, background: '#F8F9FA' }}>
        <CardContent>
          <Typography variant="titleMedium" sx={{ fontWeight: 700, mb: 2 }}>
            🎯 For Hackathon Judges
          </Typography>
          <Typography variant="bodyMedium" sx={{ mb: 2 }}>
            This demo showcases three production-ready AI integrations:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="bodySmall">
              <strong>1. AI Learning Coach:</strong> Uses simulated LLM responses (AWS Bedrock integration ready)
            </Typography>
            <Typography variant="bodySmall">
              <strong>2. Adaptive Learning:</strong> Rule-based AI that tracks mastery and adjusts recommendations
            </Typography>
            <Typography variant="bodySmall">
              <strong>3. Fraud Detection:</strong> Heuristic AI analyzing timing patterns and submission behavior
            </Typography>
          </Stack>
          <Typography variant="bodySmall" sx={{ mt: 2, fontStyle: 'italic' }}>
            All features are integrated into the quiz flow and ready for AWS Lambda deployment.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}