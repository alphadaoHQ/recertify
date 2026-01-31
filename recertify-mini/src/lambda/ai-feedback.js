const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

// Initialize AWS clients
const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });

// Quiz data (in production, this would come from DynamoDB)
const QUIZ_DATA = {
  'defi-intro-quiz': {
    id: 'defi-intro-quiz',
    title: 'DeFi Fundamentals Quiz',
    category: 'DeFi',
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
  console.log('AI Feedback Lambda triggered:', JSON.stringify(event, null, 2));
  
  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { quizId, userId, answers, timeSpent } = body;

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

    // Generate AI feedback for each question
    const feedbackList = [];
    let correctCount = 0;

    for (let i = 0; i < quiz.questions.length && i < answers.length; i++) {
      const question = quiz.questions[i];
      const userAnswer = answers[i];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctCount++;

      // Generate AI feedback using Bedrock (or fallback to rule-based)
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

    // Generate overall feedback
    const overallFeedback = generateOverallFeedback(percentage, quiz.category, 'Beginner');

    // Store feedback in DynamoDB
    await storeFeedbackLogs(feedbackList);

    // Return response
    const response = {
      feedback: feedbackList,
      overallFeedback,
      score,
      percentage,
      nextSteps: overallFeedback.nextSteps,
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
    console.error('AI Feedback Lambda error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to generate AI feedback',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

async function generateAIFeedback(question, userAnswer, isCorrect, category) {
  try {
    // Try AWS Bedrock first
    if (process.env.BEDROCK_MODEL_ID && process.env.AI_FEEDBACK_ENABLED === 'true') {
      return await generateBedrockFeedback(question, userAnswer, isCorrect, category);
    }
  } catch (error) {
    console.warn('Bedrock AI feedback failed, using fallback:', error.message);
  }

  // Fallback to rule-based feedback
  return generateRuleBasedFeedback(question, userAnswer, isCorrect, category);
}

async function generateBedrockFeedback(question, userAnswer, isCorrect, category) {
  const correctOption = question.options[question.correctAnswer];
  const userOption = question.options[userAnswer];

  const prompt = `You are an AI tutor for Web3 and blockchain education. 
  
Question: ${question.question}
User's answer: ${userOption}
Correct answer: ${correctOption}
Category: ${category}
Result: ${isCorrect ? 'Correct' : 'Incorrect'}

Provide a brief, encouraging response (max 100 words) that:
1. Acknowledges their answer
2. Explains why the correct answer is right
3. Gives one practical learning suggestion

Keep it conversational and supportive.`;

  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      max_tokens_to_sample: 200,
      temperature: 0.7,
      top_p: 0.9,
    }),
  });

  const response = await bedrock.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  
  const aiResponse = responseBody.completion.trim();
  
  return {
    explanation: aiResponse,
    suggestions: [
      isCorrect 
        ? `Try the next ${category} quiz to deepen your understanding`
        : `Review ${category} fundamentals before retrying`
    ]
  };
}

function generateRuleBasedFeedback(question, userAnswer, isCorrect, category) {
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
      `Share your progress with friends to stay motivated`
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
      `Consider taking a beginner-level ${category} quiz first`
    ];

    return {
      explanation: correctiveResponses[Math.floor(Math.random() * correctiveResponses.length)],
      suggestions: suggestions.slice(0, 2)
    };
  }
}

function generateOverallFeedback(percentage, category, difficulty) {
  let performanceLevel, encouragement, nextSteps;

  if (percentage >= 90) {
    performanceLevel = "Outstanding";
    encouragement = `Exceptional work! You've mastered this ${category} content at the ${difficulty} level.`;
    nextSteps = [
      `Try an Advanced ${category} quiz to challenge yourself further`,
      `Explore related topics like Smart Contract Security or DeFi protocols`,
      `Consider becoming a mentor to help other learners`
    ];
  } else if (percentage >= 80) {
    performanceLevel = "Excellent";
    encouragement = `Great performance! You have a strong grasp of ${category} concepts.`;
    nextSteps = [
      `Review the questions you missed to fill knowledge gaps`,
      `Try the next difficulty level in ${category}`,
      `Explore practical applications of these concepts`
    ];
  } else if (percentage >= 70) {
    performanceLevel = "Good";
    encouragement = `Well done! You're building solid ${category} knowledge.`;
    nextSteps = [
      `Review the explanations for questions you missed`,
      `Practice with similar ${difficulty} level quizzes`,
      `Study the recommended learning modules`
    ];
  } else if (percentage >= 50) {
    performanceLevel = "Needs Improvement";
    encouragement = `You're on the right track! ${category} can be challenging, but you're making progress.`;
    nextSteps = [
      `Start with Beginner level ${category} content`,
      `Review fundamental concepts before retrying`,
      `Take your time with each question and read carefully`
    ];
  } else {
    performanceLevel = "Needs Review";
    encouragement = `Don't worry! ${category} takes time to master. Let's build your foundation step by step.`;
    nextSteps = [
      `Begin with basic ${category} learning modules`,
      `Take the Beginner quiz first to build confidence`,
      `Study each explanation thoroughly`
    ];
  }

  return {
    performanceLevel,
    encouragement,
    nextSteps: nextSteps.slice(0, 3),
    recommendedAction: percentage >= 70 ? 'advance' : 'review'
  };
}

async function storeFeedbackLogs(feedbackList) {
  try {
    const tableName = `${process.env.DYNAMODB_TABLE_PREFIX}ai-feedback-logs`;
    
    // Store each feedback item
    const promises = feedbackList.map(feedback => {
      const params = {
        TableName: tableName,
        Item: marshall({
          ...feedback,
          ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days TTL
        })
      };
      
      return dynamodb.send(new PutItemCommand(params));
    });

    await Promise.all(promises);
    console.log('Feedback logs stored successfully');
  } catch (error) {
    console.error('Failed to store feedback logs:', error);
    // Don't throw error - feedback storage is not critical for user experience
  }
}