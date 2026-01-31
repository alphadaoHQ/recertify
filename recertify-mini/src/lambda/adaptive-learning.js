const { DynamoDBClient, GetItemCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

// Initialize AWS clients
const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log('Adaptive Learning Lambda triggered:', JSON.stringify(event, null, 2));
  
  try {
    const httpMethod = event.httpMethod;
    
    if (httpMethod === 'GET') {
      return await handleGetLearningState(event);
    } else if (httpMethod === 'POST') {
      return await handleUpdateLearningState(event);
    } else {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }
  } catch (error) {
    console.error('Adaptive Learning Lambda error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to process learning state',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

async function handleGetLearningState(event) {
  const userId = event.headers['x-user-id'] || event.queryStringParameters?.userId;
  
  if (!userId) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'User ID required' })
    };
  }

  const learningState = await getLearningState(userId);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-User-ID',
    },
    body: JSON.stringify(learningState)
  };
}

async function handleUpdateLearningState(event) {
  const body = JSON.parse(event.body || '{}');
  const { userId, quizId, category, difficulty, score, totalQuestions, timeSpent } = body;

  if (!userId || !quizId || !category) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Missing required fields: userId, quizId, category' })
    };
  }

  const currentState = await getLearningState(userId);
  const updatedState = updateLearningState(currentState, {
    quizId,
    category,
    difficulty,
    score,
    totalQuestions,
    timeSpent
  });

  await saveLearningState(updatedState);

  // Generate adaptive recommendations
  const recommendations = generateAdaptiveRecommendations(updatedState);

  const response = {
    learningState: updatedState,
    recommendations,
    progressUpdate: {
      previousLevel: currentState.topicScores[category]?.masteryLevel || 'beginner',
      newLevel: updatedState.topicScores[category].masteryLevel,
      improved: updatedState.topicScores[category].averageScore > (currentState.topicScores[category]?.averageScore || 0)
    }
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
}

async function getLearningState(userId) {
  try {
    const tableName = `${process.env.DYNAMODB_TABLE_PREFIX}learning-states`;
    
    const params = {
      TableName: tableName,
      Key: marshall({ userId })
    };

    const result = await dynamodb.send(new GetItemCommand(params));
    
    if (result.Item) {
      return unmarshall(result.Item);
    } else {
      return createInitialLearningState(userId);
    }
  } catch (error) {
    console.error('Failed to get learning state:', error);
    return createInitialLearningState(userId);
  }
}

async function saveLearningState(learningState) {
  try {
    const tableName = `${process.env.DYNAMODB_TABLE_PREFIX}learning-states`;
    
    const params = {
      TableName: tableName,
      Item: marshall(learningState)
    };

    await dynamodb.send(new PutItemCommand(params));
    console.log('Learning state saved successfully');
  } catch (error) {
    console.error('Failed to save learning state:', error);
    throw error;
  }
}

function createInitialLearningState(userId) {
  return {
    userId,
    topicScores: {},
    weakAreas: [],
    recommendedTopics: ['DeFi', 'NFTs', 'Gaming'],
    overallProgress: 0,
    completed: false,
    lastUpdated: new Date().toISOString()
  };
}

function updateLearningState(currentState, quizResult) {
  const { category, score, totalQuestions, difficulty } = quizResult;
  const percentage = (score / totalQuestions) * 100;

  // Update topic scores
  const currentTopic = currentState.topicScores[category] || {
    totalAttempts: 0,
    correctAnswers: 0,
    averageScore: 0,
    lastAttempt: '',
    masteryLevel: 'beginner'
  };

  const newTotalAttempts = currentTopic.totalAttempts + 1;
  const newCorrectAnswers = currentTopic.correctAnswers + score;
  const newAverageScore = (newCorrectAnswers / (newTotalAttempts * totalQuestions)) * 100;

  // Determine mastery level based on performance and difficulty
  let masteryLevel = 'beginner';
  
  if (newAverageScore >= 90 && difficulty === 'Advanced') {
    masteryLevel = 'expert';
  } else if (newAverageScore >= 85 && (difficulty === 'Intermediate' || difficulty === 'Advanced')) {
    masteryLevel = 'advanced';
  } else if (newAverageScore >= 75) {
    masteryLevel = 'intermediate';
  } else {
    masteryLevel = 'beginner';
  }

  const updatedTopicScores = {
    ...currentState.topicScores,
    [category]: {
      totalAttempts: newTotalAttempts,
      correctAnswers: newCorrectAnswers,
      averageScore: newAverageScore,
      lastAttempt: new Date().toISOString(),
      masteryLevel
    }
  };

  // Identify weak areas (topics with < 70% average score)
  const weakAreas = Object.entries(updatedTopicScores)
    .filter(([_, scores]) => scores.averageScore < 70)
    .map(([topic, _]) => topic);

  // Calculate overall progress
  const totalTopics = Object.keys(updatedTopicScores).length;
  const masteredTopics = Object.values(updatedTopicScores)
    .filter(scores => scores.masteryLevel === 'advanced' || scores.masteryLevel === 'expert').length;
  const overallProgress = totalTopics > 0 ? (masteredTopics / totalTopics) * 100 : 0;

  // Determine if learning is completed (80%+ mastery across all attempted topics)
  const completed = overallProgress >= 80 && totalTopics >= 3;

  // Generate recommended topics based on current progress
  const allTopics = ['DeFi', 'NFTs', 'Gaming', 'Security', 'Infrastructure'];
  const attemptedTopics = Object.keys(updatedTopicScores);
  const untriedTopics = allTopics.filter(topic => !attemptedTopics.includes(topic));
  
  let recommendedTopics = [];
  
  // Recommend weak areas first
  if (weakAreas.length > 0) {
    recommendedTopics = [...weakAreas];
  }
  
  // Then recommend new topics based on mastery progression
  if (masteryLevel === 'expert' || masteryLevel === 'advanced') {
    recommendedTopics = [...recommendedTopics, ...untriedTopics.slice(0, 2)];
  } else {
    // Focus on current topic until intermediate level
    recommendedTopics = [category, ...untriedTopics.slice(0, 1)];
  }

  return {
    ...currentState,
    topicScores: updatedTopicScores,
    weakAreas,
    recommendedTopics: [...new Set(recommendedTopics)].slice(0, 3),
    overallProgress,
    completed,
    lastUpdated: new Date().toISOString()
  };
}

function generateAdaptiveRecommendations(learningState) {
  const recommendations = [];

  // Difficulty progression recommendations
  for (const [topic, scores] of Object.entries(learningState.topicScores)) {
    if (scores.masteryLevel === 'beginner' && scores.averageScore < 60) {
      recommendations.push({
        type: 'difficulty_adjustment',
        topic,
        message: `Consider reviewing ${topic} fundamentals before attempting more quizzes`,
        action: 'review_basics',
        priority: 'high'
      });
    } else if (scores.masteryLevel === 'intermediate' && scores.averageScore >= 80) {
      recommendations.push({
        type: 'difficulty_progression',
        topic,
        message: `You're ready for Advanced ${topic} challenges!`,
        action: 'try_advanced',
        priority: 'medium'
      });
    }
  }

  // Weak area recommendations
  if (learningState.weakAreas.length > 0) {
    recommendations.push({
      type: 'weak_area_focus',
      topic: learningState.weakAreas[0],
      message: `Focus on improving your ${learningState.weakAreas[0]} knowledge`,
      action: 'practice_weak_area',
      priority: 'high'
    });
  }

  // New topic recommendations
  if (learningState.recommendedTopics.length > 0) {
    const nextTopic = learningState.recommendedTopics[0];
    recommendations.push({
      type: 'new_topic',
      topic: nextTopic,
      message: `Ready to explore ${nextTopic}? Start with beginner level`,
      action: 'try_new_topic',
      priority: 'low'
    });
  }

  // Completion recommendations
  if (learningState.completed) {
    recommendations.push({
      type: 'completion',
      topic: 'certification',
      message: 'Congratulations! You\'re ready for certification',
      action: 'get_certificate',
      priority: 'high'
    });
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}