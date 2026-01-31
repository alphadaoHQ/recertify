const { DynamoDBClient, PutItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

// Initialize AWS clients
const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log('Fraud Detection Lambda triggered:', JSON.stringify(event, null, 2));
  
  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { quizId, userId, answers, timeSpent, startTime, endTime, sessionId } = body;

    // Validate input
    if (!userId || !quizId || !answers || !timeSpent) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        },
        body: JSON.stringify({ error: 'Missing required fields: userId, quizId, answers, timeSpent' })
      };
    }

    // Get user's submission history
    const userHistory = await getUserSubmissionHistory(userId);

    // Perform fraud detection analysis
    const fraudAnalysis = analyzeFraudRisk({
      quizId,
      userId,
      answers,
      timeSpent,
      startTime,
      endTime,
      sessionId: sessionId || `session_${Date.now()}`
    }, userHistory);

    // Store fraud detection result
    await storeFraudLog(fraudAnalysis);

    // Determine if submission should be blocked
    const riskThreshold = parseInt(process.env.FRAUD_RISK_THRESHOLD || '70');
    const shouldBlock = fraudAnalysis.riskScore >= riskThreshold;
    const warningLevel = getWarningLevel(fraudAnalysis.riskScore);

    const response = {
      fraudDetection: fraudAnalysis,
      blocked: shouldBlock,
      warningLevel,
      message: generateFraudMessage(fraudAnalysis, shouldBlock),
      allowCertification: !shouldBlock && fraudAnalysis.riskScore < 50,
      timestamp: new Date().toISOString()
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
    console.error('Fraud Detection Lambda error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to analyze submission for fraud',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

async function getUserSubmissionHistory(userId) {
  try {
    const tableName = `${process.env.DYNAMODB_TABLE_PREFIX}quiz-attempts`;
    
    const params = {
      TableName: tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: marshall({
        ':userId': userId
      }),
      ScanIndexForward: false, // Most recent first
      Limit: 50 // Last 50 submissions
    };

    const result = await dynamodb.send(new QueryCommand(params));
    
    if (result.Items) {
      return result.Items.map(item => unmarshall(item));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get user submission history:', error);
    return [];
  }
}

function analyzeFraudRisk(submission, userHistory) {
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
      s.answers && s.answers.join(',') === currentAnswers
    );
    
    if (identicalSubmissions.length > 0) {
      flags.identicalRetries = true;
      riskScore += 25;
    }
  }

  // 3. Impossible Accuracy vs Time Detection
  // Simulate correct answers for demo (in production, compare with actual correct answers)
  const simulatedCorrectAnswers = answers.filter(() => Math.random() > 0.3).length;
  const accuracy = (simulatedCorrectAnswers / answers.length) * 100;
  
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
  const recentSubmissions = userHistory.slice(0, 5);
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

function calculateTimingVariance(submissions) {
  if (submissions.length < 2) return 100;
  
  const timings = submissions
    .filter(s => s.timeSpent && s.answers)
    .map(s => s.timeSpent / s.answers.length);
  
  if (timings.length < 2) return 100;
  
  const mean = timings.reduce((a, b) => a + b, 0) / timings.length;
  const variance = timings.reduce((acc, timing) => acc + Math.pow(timing - mean, 2), 0) / timings.length;
  
  return Math.sqrt(variance);
}

function getWarningLevel(riskScore) {
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 70) return 'high';
  if (riskScore >= 50) return 'medium';
  if (riskScore >= 30) return 'low';
  return 'none';
}

function generateFraudMessage(fraudAnalysis, blocked) {
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

async function storeFraudLog(fraudAnalysis) {
  try {
    const tableName = `${process.env.DYNAMODB_TABLE_PREFIX}fraud-logs`;
    
    const params = {
      TableName: tableName,
      Item: marshall({
        ...fraudAnalysis,
        ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days TTL
      })
    };
    
    await dynamodb.send(new PutItemCommand(params));
    console.log('Fraud log stored successfully');
  } catch (error) {
    console.error('Failed to store fraud log:', error);
    // Don't throw error - fraud logging is not critical for user experience
  }
}