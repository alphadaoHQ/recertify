import { NextRequest, NextResponse } from 'next/server';
import { FraudDetection, QuizSubmission } from '@/types';

/**
 * Fraud Detection System - Detects cheating patterns in quiz submissions
 * POST /api/fraud/check - Analyze quiz submission for fraud indicators
 */

// In-memory storage for demo - In production: use DynamoDB or similar
const userSubmissions = new Map<string, QuizSubmission[]>();
const fraudFlags = new Map<string, FraudDetection[]>();

export async function POST(req: NextRequest) {
  try {
    const submission: QuizSubmission = await req.json();
    const { userId, quizId, answers, timeSpent, startTime, endTime, sessionId } = submission;

    if (!userId || !quizId || !answers || !timeSpent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user's submission history
    const userHistory = userSubmissions.get(userId) || [];
    userHistory.push(submission);
    userSubmissions.set(userId, userHistory);

    // Perform fraud detection analysis
    const fraudAnalysis = analyzeFraudRisk(submission, userHistory);

    // Store fraud detection result
    const userFraudHistory = fraudFlags.get(userId) || [];
    userFraudHistory.push(fraudAnalysis);
    fraudFlags.set(userId, userFraudHistory);

    // Determine if submission should be blocked
    const shouldBlock = fraudAnalysis.riskScore >= 70;
    const warningLevel = getWarningLevel(fraudAnalysis.riskScore);

    return NextResponse.json({
      fraudDetection: fraudAnalysis,
      blocked: shouldBlock,
      warningLevel,
      message: generateFraudMessage(fraudAnalysis, shouldBlock),
      allowCertification: !shouldBlock && fraudAnalysis.riskScore < 50,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Fraud Detection Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze submission' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/fraud/check - Get user's fraud history (for admin/debugging)
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const userFraudHistory = fraudFlags.get(userId) || [];
    const userSubmissionHistory = userSubmissions.get(userId) || [];

    return NextResponse.json({
      fraudHistory: userFraudHistory,
      submissionHistory: userSubmissionHistory,
      riskProfile: calculateRiskProfile(userFraudHistory)
    });

  } catch (error) {
    console.error('Fraud History Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fraud history' },
      { status: 500 }
    );
  }
}

function analyzeFraudRisk(
  submission: QuizSubmission, 
  userHistory: QuizSubmission[]
): FraudDetection {
  const { userId, quizId, answers, timeSpent, sessionId } = submission;
  
  let riskScore = 0;
  const flags = {
    fastCompletion: false,
    identicalRetries: false,
    impossibleAccuracy: false,
    suspiciousPattern: false
  };

  // 1. Fast Completion Detection
  const averageTimePerQuestion = timeSpent / answers.length;
  const minimumReasonableTime = 15; // 15 seconds per question minimum
  
  if (averageTimePerQuestion < minimumReasonableTime) {
    flags.fastCompletion = true;
    riskScore += 30;
    
    // Extremely fast completion (< 5 seconds per question)
    if (averageTimePerQuestion < 5) {
      riskScore += 40;
    }
  }

  // 2. Identical Retries Detection
  const sameQuizSubmissions = userHistory.filter(s => s.quizId === quizId);
  if (sameQuizSubmissions.length > 1) {
    const currentAnswers = answers.join(',');
    const identicalSubmissions = sameQuizSubmissions.filter(s => 
      s.answers.join(',') === currentAnswers
    );
    
    if (identicalSubmissions.length > 0) {
      flags.identicalRetries = true;
      riskScore += 25;
    }
  }

  // 3. Impossible Accuracy vs Time Detection
  const correctAnswers = answers.filter((_, index) => {
    // This would need actual quiz data to verify, for demo we'll simulate
    return Math.random() > 0.3; // Simulate ~70% accuracy
  }).length;
  
  const accuracy = (correctAnswers / answers.length) * 100;
  
  // Perfect score with very fast completion is suspicious
  if (accuracy === 100 && averageTimePerQuestion < 20) {
    flags.impossibleAccuracy = true;
    riskScore += 35;
  }
  
  // High accuracy with extremely fast completion
  if (accuracy >= 90 && averageTimePerQuestion < 10) {
    flags.impossibleAccuracy = true;
    riskScore += 25;
  }

  // 4. Suspicious Pattern Detection
  const retryCount = sameQuizSubmissions.length;
  
  // Too many retries in short time
  if (retryCount > 5) {
    flags.suspiciousPattern = true;
    riskScore += 20;
  }
  
  // Consistent perfect timing patterns
  const recentSubmissions = userHistory.slice(-5);
  const timingVariance = calculateTimingVariance(recentSubmissions);
  if (timingVariance < 2 && recentSubmissions.length >= 3) {
    flags.suspiciousPattern = true;
    riskScore += 15;
  }

  // 5. Session-based anomalies
  const sessionSubmissions = userHistory.filter(s => s.sessionId === sessionId);
  if (sessionSubmissions.length > 10) { // Too many submissions in one session
    flags.suspiciousPattern = true;
    riskScore += 10;
  }

  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);

  return {
    userId,
    sessionId,
    quizId,
    riskScore,
    flags,
    timeSpent,
    averageTimePerQuestion,
    retryCount,
    timestamp: new Date().toISOString()
  };
}

function calculateTimingVariance(submissions: QuizSubmission[]): number {
  if (submissions.length < 2) return 100;
  
  const timings = submissions.map(s => s.timeSpent / s.answers.length);
  const mean = timings.reduce((a, b) => a + b, 0) / timings.length;
  const variance = timings.reduce((acc, timing) => acc + Math.pow(timing - mean, 2), 0) / timings.length;
  
  return Math.sqrt(variance);
}

function getWarningLevel(riskScore: number): 'none' | 'low' | 'medium' | 'high' | 'critical' {
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 70) return 'high';
  if (riskScore >= 50) return 'medium';
  if (riskScore >= 30) return 'low';
  return 'none';
}

function generateFraudMessage(fraudAnalysis: FraudDetection, blocked: boolean): string {
  const { flags, riskScore } = fraudAnalysis;
  
  if (blocked) {
    const reasons = [];
    if (flags.fastCompletion) reasons.push('unusually fast completion');
    if (flags.identicalRetries) reasons.push('identical answer patterns');
    if (flags.impossibleAccuracy) reasons.push('suspicious accuracy vs time ratio');
    if (flags.suspiciousPattern) reasons.push('irregular submission patterns');
    
    return `Submission blocked due to: ${reasons.join(', ')}. Please retake the quiz at a normal pace.`;
  }
  
  if (riskScore >= 50) {
    return 'Your submission has been flagged for review. Certification may be delayed pending verification.';
  }
  
  if (riskScore >= 30) {
    return 'Please ensure you\'re taking adequate time to read and understand each question.';
  }
  
  return 'Submission looks good! Keep up the great work.';
}

function calculateRiskProfile(fraudHistory: FraudDetection[]) {
  if (fraudHistory.length === 0) {
    return { level: 'new', averageRisk: 0, flagCount: 0 };
  }
  
  const averageRisk = fraudHistory.reduce((sum, f) => sum + f.riskScore, 0) / fraudHistory.length;
  const flagCount = fraudHistory.reduce((sum, f) => {
    return sum + Object.values(f.flags).filter(Boolean).length;
  }, 0);
  
  let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
  
  if (averageRisk >= 70 || flagCount >= 10) {
    level = 'critical';
  } else if (averageRisk >= 50 || flagCount >= 6) {
    level = 'high';
  } else if (averageRisk >= 30 || flagCount >= 3) {
    level = 'medium';
  }
  
  return { level, averageRisk, flagCount };
}