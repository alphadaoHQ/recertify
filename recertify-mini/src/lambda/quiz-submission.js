const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const { marshall } = require('@aws-sdk/util-dynamodb');

// Initialize AWS clients
const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });
const lambda = new LambdaClient({ region: process.env.AWS_REGION });

// Quiz data (in production, this would come from DynamoDB)
const QUIZ_DATA = {
  'defi-intro-quiz': {
    id: 'defi-intro-quiz',
    title: 'DeFi Fundamentals Quiz',
    category: 'DeFi',
    difficulty: 'Beginner',
    points: 50,
    questions: [
      {
        id: 'defi-q1',
        question: 'What does DeFi stand for?',
        options: ['Digital Finance', 'Decentralized Finance', 'Distributed Finance', 'Democratic Finance'],
        correctAnswer: 1,
        explanation: 'DeFi stands for Decentralized Finance, which refers to financial services built on blockchain technology.'
      },
      {
        id: 'defi-q2',
        question: 'What is a liquidity pool?',
        options: ['A swimming pool for crypto', 'A collection of funds locked in a smart contract', 'A type of cryptocurrency', 'A bank account'],
        correctAnswer: 1,
        explanation: 'A liquidity pool is a collection of funds locked in a smart contract, used to facilitate trading in decentralized exchanges.'
      },
      {
        id: 'defi-q3',
        question: 'What is yield farming?',
        options: ['Growing crops with crypto', 'Earning rewards by staking or lending crypto', 'Mining cryptocurrency', 'Trading NFTs'],
        correctAnswer: 1,
        explanation: 'Yield farming is the practice of staking or lending cryptocurrency assets to generate high returns or rewards.'
      }
    ]
  }
};

exports.handler = async (event) => {
  console.log('Quiz Submission Lambda triggered:', JSON.stringify(event, null, 2));
  
  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { quizId, userId, answers, timeSpent, startTime, endTime, sessionId } = body;

    // Validate input
    if (!quizId || !userId || !answers) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        },
        body: JSON.stringify({ error: 'Missing required fields: quizId, userId, answers' })
      };
    }

    // Get quiz data
    const quiz = QUIZ_DATA[quizId];
    if (!quiz) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Quiz not found' })
      };
    }

    // 1. FRAUD DETECTION - Check submission for suspicious patterns
    const fraudResult = await invokeFraudDetection({
      quizId,
      userId,
      answers,
      timeSpent,
      startTime,
      endTime,
      sessionId: sessionId || `session_${Date.now()}`
    });

    // Block submission if fraud detected
    if (fraudResult.blocked) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          blocked: true,
          reason: 'fraud_detected',
          message: fraudResult.message,
          fraudAnalysis: fraudResult.fraudDetection,
          timestamp: new Date().toISOString(),
        })
      };
    }

    // Calculate basic score
    let correctCount = 0;
    const detailedAnswers = answers.map((userAnswer, index) => {
      if (index >= quiz.questions.length) return null;
      
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
    }).filter(Boolean);

    const score = correctCount;
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 70 && !fraudResult.blocked;

    // 2. AI FEEDBACK - Generate personalized feedback
    const aiFeedback = await invokeAIFeedback({
      quizId,
      userId,
      answers,
      timeSpent
    });

    // 3. ADAPTIVE LEARNING - Update learning state
    const learningUpdate = await invokeAdaptiveLearning({
      userId,
      quizId,
      category: quiz.category,
      difficulty: quiz.difficulty,
      score,
      totalQuestions: quiz.questions.length,
      timeSpent
    });

    // Calculate points earned (reduced if fraud risk detected)
    let pointsEarned = 0;
    if (passed) {
      const basePoints = quiz.points || 50;
      const fraudPenalty = Math.floor(fraudResult.fraudDetection.riskScore * 0.5); // Up to 50% penalty
      pointsEarned = Math.max(basePoints - fraudPenalty, Math.floor(basePoints * 0.3)); // Minimum 30% of base points
    }

    // Store quiz attempt in DynamoDB
    await storeQuizAttempt({
      userId,
      quizId,
      answers,
      score,
      percentage,
      timeSpent,
      passed,
      pointsEarned,
      fraudRiskScore: fraudResult.fraudDetection.riskScore
    });

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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Quiz Submission Lambda error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to submit quiz',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

async function invokeFraudDetection(payload) {
  try {
    const functionName = `${process.env.DYNAMODB_TABLE_PREFIX.replace('-', '-').slice(0, -1)}-fraud-detection`;
    
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        body: JSON.stringify(payload),
        httpMethod: 'POST'
      })
    };

    const result = await lambda.send(new InvokeCommand(params));
    const response = JSON.parse(new TextDecoder().decode(result.Payload));
    
    if (response.statusCode === 200) {
      return JSON.parse(response.body);
    } else {
      throw new Error(`Fraud detection failed: ${response.body}`);
    }
  } catch (error) {
    console.error('Fraud detection invocation failed:', error);
    // Return safe default if fraud detection fails
    return {
      blocked: false,
      warningLevel: 'none',
      message: 'Fraud detection unavailable',
      allowCertification: true,
      fraudDetection: {
        riskScore: 0,
        flags: {
          fastCompletion: false,
          identicalRetries: false,
          impossibleAccuracy: false,
          suspiciousPattern: false
        }
      }
    };
  }
}

async function invokeAIFeedback(payload) {
  try {
    const functionName = `${process.env.DYNAMODB_TABLE_PREFIX.replace('-', '-').slice(0, -1)}-ai-feedback`;
    
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        body: JSON.stringify(payload),
        httpMethod: 'POST'
      })
    };

    const result = await lambda.send(new InvokeCommand(params));
    const response = JSON.parse(new TextDecoder().decode(result.Payload));
    
    if (response.statusCode === 200) {
      return JSON.parse(response.body);
    } else {
      throw new Error(`AI feedback failed: ${response.body}`);
    }
  } catch (error) {
    console.error('AI feedback invocation failed:', error);
    // Return basic feedback if AI fails
    return {
      feedback: [],
      overallFeedback: {
        performanceLevel: 'Good',
        encouragement: 'Keep learning and improving!',
        nextSteps: ['Continue with the next quiz', 'Review the explanations']
      },
      nextSteps: ['Continue learning', 'Try another quiz']
    };
  }
}

async function invokeAdaptiveLearning(payload) {
  try {
    const functionName = `${process.env.DYNAMODB_TABLE_PREFIX.replace('-', '-').slice(0, -1)}-adaptive-learning`;
    
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        body: JSON.stringify(payload),
        httpMethod: 'POST'
      })
    };

    const result = await lambda.send(new InvokeCommand(params));
    const response = JSON.parse(new TextDecoder().decode(result.Payload));
    
    if (response.statusCode === 200) {
      return JSON.parse(response.body);
    } else {
      throw new Error(`Adaptive learning failed: ${response.body}`);
    }
  } catch (error) {
    console.error('Adaptive learning invocation failed:', error);
    // Return basic learning state if adaptive learning fails
    return {
      learningState: {
        userId: payload.userId,
        overallProgress: 0,
        recommendedTopics: [payload.category]
      },
      recommendations: [],
      progressUpdate: {
        previousLevel: 'beginner',
        newLevel: 'beginner',
        improved: false
      }
    };
  }
}

async function storeQuizAttempt(attemptData) {
  try {
    const tableName = `${process.env.DYNAMODB_TABLE_PREFIX}quiz-attempts`;
    
    const params = {
      TableName: tableName,
      Item: marshall({
        ...attemptData,
        timestamp: new Date().toISOString(),
        ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year TTL
      })
    };
    
    await dynamodb.send(new PutItemCommand(params));
    console.log('Quiz attempt stored successfully');
  } catch (error) {
    console.error('Failed to store quiz attempt:', error);
    // Don't throw error - storage failure shouldn't block user experience
  }
}