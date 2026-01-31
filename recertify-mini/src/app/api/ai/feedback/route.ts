import { NextRequest, NextResponse } from 'next/server';
import { AIFeedback, QuizQuestion } from '@/types';
import { getQuizById } from '@/lib/quizData';

/**
 * AI Learning Coach - Provides personalized feedback after quiz submission
 * POST /api/ai/feedback - Generate AI feedback for quiz answers
 */
export async function POST(req: NextRequest) {
  try {
    const { quizId, userId, answers, timeSpent } = await req.json();

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

    // Generate AI feedback for each question
    const feedbackList: AIFeedback[] = [];
    let correctCount = 0;

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const userAnswer = answers[i];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctCount++;

      const feedback = await generateAIFeedback(question, userAnswer, isCorrect, quiz.category);
      
      feedbackList.push({
        id: `feedback_${quizId}_${i}_${Date.now()}`,
        userId,
        quizId,
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        feedback: feedback.explanation,
        suggestions: feedback.suggestions,
        timestamp: new Date().toISOString(),
      });
    }

    const score = correctCount;
    const percentage = Math.round((score / quiz.questions.length) * 100);

    // Generate overall feedback and next steps
    const overallFeedback = generateOverallFeedback(percentage, quiz.category, quiz.difficulty);

    return NextResponse.json({
      feedback: feedbackList,
      overallFeedback,
      score,
      percentage,
      nextSteps: overallFeedback.nextSteps,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI Feedback Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI feedback' },
      { status: 500 }
    );
  }
}

/**
 * Generate AI-powered feedback for individual questions
 * In production: This would call AWS Bedrock or Lambda-hosted LLM
 */
async function generateAIFeedback(
  question: QuizQuestion, 
  userAnswer: number, 
  isCorrect: boolean, 
  category: string
): Promise<{ explanation: string; suggestions: string[] }> {
  
  // Simulated AI responses - In production, replace with actual LLM call
  const correctOption = question.options[question.correctAnswer];
  const userOption = question.options[userAnswer];

  if (isCorrect) {
    const positiveResponses = [
      `Excellent! You correctly identified that ${correctOption.toLowerCase()}. This shows you understand the fundamentals of ${category}.`,
      `Great job! Your answer demonstrates solid knowledge of ${category} concepts.`,
      `Perfect! You've grasped this ${category} concept well. Keep building on this foundation.`,
      `Well done! This correct answer shows you're developing strong ${category} expertise.`
    ];

    const suggestions = [
      `Try the next ${category} quiz to deepen your understanding`,
      `Explore advanced ${category} topics to expand your knowledge`,
      `Share your progress with friends to stay motivated`,
      `Review related learning modules for comprehensive understanding`
    ];

    return {
      explanation: positiveResponses[Math.floor(Math.random() * positiveResponses.length)],
      suggestions: suggestions.slice(0, 2)
    };
  } else {
    const correctiveResponses = [
      `You selected "${userOption}" but the correct answer is "${correctOption}". ${question.explanation || `This is a key ${category} concept worth reviewing.`}`,
      `Not quite right. The correct answer is "${correctOption}". ${question.explanation || `Understanding this will strengthen your ${category} knowledge.`}`,
      `Close, but "${correctOption}" is the right choice. ${question.explanation || `This ${category} principle is fundamental to master.`}`
    ];

    const suggestions = [
      `Review the ${category} fundamentals before retrying`,
      `Study the explanation carefully and try similar questions`,
      `Consider taking a beginner-level ${category} quiz first`,
      `Read more about this topic in our learning modules`
    ];

    return {
      explanation: correctiveResponses[Math.floor(Math.random() * correctiveResponses.length)],
      suggestions: suggestions.slice(0, 2)
    };
  }
}

/**
 * Generate overall performance feedback and recommendations
 */
function generateOverallFeedback(percentage: number, category: string, difficulty: string) {
  let performanceLevel: string;
  let encouragement: string;
  let nextSteps: string[];

  if (percentage >= 90) {
    performanceLevel = "Outstanding";
    encouragement = `Exceptional work! You've mastered this ${category} content at the ${difficulty} level.`;
    nextSteps = [
      `Try an Advanced ${category} quiz to challenge yourself further`,
      `Explore related topics like Smart Contract Security or DeFi protocols`,
      `Consider becoming a mentor to help other learners`,
      `Share your achievement to inspire your network`
    ];
  } else if (percentage >= 80) {
    performanceLevel = "Excellent";
    encouragement = `Great performance! You have a strong grasp of ${category} concepts.`;
    nextSteps = [
      `Review the questions you missed to fill knowledge gaps`,
      `Try the next difficulty level in ${category}`,
      `Explore practical applications of these concepts`,
      `Join community discussions about ${category}`
    ];
  } else if (percentage >= 70) {
    performanceLevel = "Good";
    encouragement = `Well done! You're building solid ${category} knowledge.`;
    nextSteps = [
      `Review the explanations for questions you missed`,
      `Practice with similar ${difficulty} level quizzes`,
      `Study the recommended learning modules`,
      `Retake this quiz after reviewing to improve your score`
    ];
  } else if (percentage >= 50) {
    performanceLevel = "Needs Improvement";
    encouragement = `You're on the right track! ${category} can be challenging, but you're making progress.`;
    nextSteps = [
      `Start with Beginner level ${category} content`,
      `Review fundamental concepts before retrying`,
      `Take your time with each question and read carefully`,
      `Use the explanations to understand key principles`
    ];
  } else {
    performanceLevel = "Needs Review";
    encouragement = `Don't worry! ${category} takes time to master. Let's build your foundation step by step.`;
    nextSteps = [
      `Begin with basic ${category} learning modules`,
      `Take the Beginner quiz first to build confidence`,
      `Study each explanation thoroughly`,
      `Consider reviewing prerequisite topics`
    ];
  }

  return {
    performanceLevel,
    encouragement,
    nextSteps: nextSteps.slice(0, 3),
    recommendedAction: percentage >= 70 ? 'advance' : 'review'
  };
}