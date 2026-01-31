# 🚀 AWS Deployment Guide - Recertify Mini AI Features

## Quick Deploy Commands

### 1. Install AWS CLI and CDK
```bash
npm install -g aws-cdk
aws configure
```

### 2. Deploy Lambda Functions
```bash
# Package the API routes as Lambda functions
npm run build

# Deploy AI Feedback Lambda
aws lambda create-function \
  --function-name recertify-ai-feedback \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler api/ai/feedback.handler \
  --zip-file fileb://dist/ai-feedback.zip

# Deploy Adaptive Learning Lambda  
aws lambda create-function \
  --function-name recertify-adaptive-learning \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler api/learning/state.handler \
  --zip-file fileb://dist/adaptive-learning.zip

# Deploy Fraud Detection Lambda
aws lambda create-function \
  --function-name recertify-fraud-detection \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler api/fraud/check.handler \
  --zip-file fileb://dist/fraud-detection.zip
```

### 3. Create DynamoDB Tables
```bash
# Users table
aws dynamodb create-table \
  --table-name recertify-users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Quiz attempts table
aws dynamodb create-table \
  --table-name recertify-quiz-attempts \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=timestamp,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Learning states table
aws dynamodb create-table \
  --table-name recertify-learning-states \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Fraud logs table
aws dynamodb create-table \
  --table-name recertify-fraud-logs \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=timestamp,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### 4. Setup API Gateway
```bash
# Create REST API
aws apigateway create-rest-api --name recertify-mini-api

# Create resources and methods (detailed commands in full deployment guide)
```

### 5. Environment Variables
```bash
# Set Lambda environment variables
aws lambda update-function-configuration \
  --function-name recertify-ai-feedback \
  --environment Variables='{
    "DYNAMODB_TABLE_PREFIX":"recertify-",
    "AWS_REGION":"us-east-1",
    "AI_FEEDBACK_ENABLED":"true"
  }'
```

## One-Click Deploy (Recommended)

Use the provided CDK stack for complete deployment:

```bash
# Install dependencies
npm install

# Deploy entire stack
cdk deploy RecertifyMiniStack
```

## Telegram Integration

```bash
# Set webhook after deployment
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=https://YOUR_API_GATEWAY_URL.amazonaws.com/prod/telegram/webhook"
```

## Testing Deployment

```bash
# Test AI Feedback
curl -X POST https://YOUR_API_GATEWAY_URL.amazonaws.com/prod/ai/feedback \
  -H "Content-Type: application/json" \
  -d '{"quizId":"defi-intro-quiz","userId":"test","answers":[1,0,1],"timeSpent":180}'

# Test Adaptive Learning
curl -X POST https://YOUR_API_GATEWAY_URL.amazonaws.com/prod/learning/state \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","quizId":"defi-intro-quiz","category":"DeFi","difficulty":"Beginner","score":2,"totalQuestions":3,"timeSpent":180}'

# Test Fraud Detection
curl -X POST https://YOUR_API_GATEWAY_URL.amazonaws.com/prod/fraud/check \
  -H "Content-Type: application/json" \
  -d '{"quizId":"defi-intro-quiz","userId":"test","answers":[1,1,1],"timeSpent":15,"startTime":1640995200000,"endTime":1640995215000,"sessionId":"test_session"}'
```

## Monitoring

```bash
# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/recertify

# Monitor DynamoDB metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedReadCapacityUnits \
  --dimensions Name=TableName,Value=recertify-users \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

## Cost Estimation

**Monthly costs for 10,000 active users:**
- Lambda: ~$5-10 (pay per request)
- DynamoDB: ~$10-20 (on-demand)
- API Gateway: ~$3-5 (per million requests)
- **Total: ~$20-35/month**

## Production Checklist

- [ ] Lambda functions deployed
- [ ] DynamoDB tables created
- [ ] API Gateway configured
- [ ] Environment variables set
- [ ] Telegram webhook configured
- [ ] CloudWatch monitoring enabled
- [ ] IAM roles and policies configured
- [ ] CORS enabled for Telegram Mini App
- [ ] Rate limiting configured
- [ ] Error handling and logging implemented

---

**Ready for hackathon demo! 🎯**