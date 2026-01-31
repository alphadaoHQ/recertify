import { NextRequest, NextResponse } from 'next/server';
import { getQuizById } from '@/lib/quizData';

/**
 * POST /api/quizzes/submit - Submit quiz answers with AI integration
 * Integrates: AI Feedback, Adaptive Learning, and Fraud Detection
 */
export async function POST(req: NextRequest) {
  try {
    const { quizId, userId, answers, timeSpent, startTime, endTime, sessionId } = await req.json();

    if (!quizId || !userId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const quiz = getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // 1. FRAUD DETECTION - Check submission for suspicious patterns
    const fraudCheckResponse = await fetch(`${req.nextUrl.origin}/api/fraud/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId,
        userId,
        answers,
        timeSpent,
        startTime,
        endTime,
        sessionId: sessionId || `session_${Date.now()}`
      })
    });

    const fraudResult = await fraudCheckResponse.json();

    // Block submission if fraud detected
    if (fraudResult.blocked) {
      return NextResponse.json({
        success: false,
        blocked: true,
        reason: 'fraud_detected',
        message: fraudResult.message,
        fraudAnalysis: fraudResult.fraudDetection,
        timestamp: new Date().toISOString(),
      }, { status: 403 });
    }

    // Calculate basic score
    let correctCount = 0;
    const detailedAnswers = answers.map((userAnswer: number, index: number) => {
      const question = quiz.questions[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        question: question.question,
        explanation: question.explanation
      };
    });

    const score = correctCount;
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 70 && !fraudResult.blocked;

    // 2. AI FEEDBACK - Generate personalized feedback
    const aiFeedbackResponse = await fetch(`${req.nextUrl.origin}/api/ai/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId,
        userId,
        answers,
        timeSpent
      })
    });

    const aiFeedback = await aiFeedbackResponse.json();

    // 3. ADAPTIVE LEARNING - Update learning state
    const learningStateResponse = await fetch(`${req.nextUrl.origin}/api/learning/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        quizId,
        category: quiz.category,
        difficulty: quiz.difficulty,
        score,
        totalQuestions: quiz.questions.length,
        timeSpent
      })
    });

    const learningUpdate = await learningStateResponse.json();

    // Calculate points earned (reduced if fraud risk detected)
    let pointsEarned = 0;
    if (passed) {
      const basePoints = quiz.points || 50;
      const fraudPenalty = Math.floor(fraudResult.fraudDetection.riskScore * 0.5); // Up to 50% penalty
      pointsEarned = Math.max(basePoints - fraudPenalty, Math.floor(basePoints * 0.3)); // Minimum 30% of base points
    }

    // Prepare comprehensive response
    const response = {
      success: true,
      quizId,
      userId,
      score,
      percentage,
      passed,
      pointsEarned,
      timeSpent,
      
      // Detailed results
      answers: detailedAnswers,
      
      // AI Features Results
      aiFeedback: aiFeedback.feedback,
      overallFeedback: aiFeedback.overallFeedback,
      nextSteps: aiFeedback.nextSteps,
      
      // Adaptive Learning
      learningProgress: learningUpdate.learningState,
      recommendations: learningUpdate.recommendations,
      progressUpdate: learningUpdate.progressUpdate,
      
      // Fraud Detection
      fraudAnalysis: {
        riskScore: fraudResult.fraudDetection.riskScore,
        warningLevel: fraudResult.warningLevel,
        message: fraudResult.message,
        allowCertification: fraudResult.allowCertification
      },
      
      // Certification eligibility
      certificationEligible: passed && fraudResult.allowCertification,
      
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}