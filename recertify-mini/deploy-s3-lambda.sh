#!/bin/bash

# Recertify Mini - S3 + Lambda Deployment Script
# Deploys Next.js frontend to S3 and Lambda functions for AI backend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="recertify-mini"
AWS_REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-prod}"
DOMAIN_NAME="${DOMAIN_NAME:-recertify-mini.com}"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if required tools are installed
    command -v aws >/dev/null 2>&1 || error "AWS CLI is required but not installed"
    command -v node >/dev/null 2>&1 || error "Node.js is required but not installed"
    command -v npm >/dev/null 2>&1 || error "npm is required but not installed"
    
    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error "AWS credentials not configured"
    
    # Check environment variables
    [ -z "$TELEGRAM_BOT_TOKEN" ] && error "TELEGRAM_BOT_TOKEN environment variable is required"
    
    success "Prerequisites check passed"
}

# Build Next.js application for static export
build_frontend() {
    log "Building Next.js frontend for static export..."
    
    # Install dependencies
    npm ci
    
    # Run type check and linting
    npm run type-check
    npm run lint
    
    # Build for static export
    npm run build
    
    # Export static files
    if [ -d "out" ]; then
        rm -rf out
    fi
    
    # Create static export
    npx next export
    
    success "Frontend built successfully"
}

# Deploy infrastructure using CloudFormation
deploy_infrastructure() {
    log "Deploying AWS infrastructure..."
    
    STACK_NAME="$PROJECT_NAME-$ENVIRONMENT-infrastructure"
    
    # Check if stack exists
    if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION >/dev/null 2>&1; then
        log "Updating existing CloudFormation stack..."
        aws cloudformation update-stack \
            --stack-name $STACK_NAME \
            --template-body file://aws-s3-lambda-deploy.yml \
            --parameters \
                ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME \
                ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
                ParameterKey=DomainName,ParameterValue=$DOMAIN_NAME \
                ParameterKey=TelegramBotToken,ParameterValue=$TELEGRAM_BOT_TOKEN \
            --capabilities CAPABILITY_IAM \
            --region $AWS_REGION
        
        # Wait for update to complete
        aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $AWS_REGION
    else
        log "Creating new CloudFormation stack..."
        aws cloudformation create-stack \
            --stack-name $STACK_NAME \
            --template-body file://aws-s3-lambda-deploy.yml \
            --parameters \
                ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME \
                ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
                ParameterKey=DomainName,ParameterValue=$DOMAIN_NAME \
                ParameterKey=TelegramBotToken,ParameterValue=$TELEGRAM_BOT_TOKEN \
            --capabilities CAPABILITY_IAM \
            --region $AWS_REGION
        
        # Wait for creation to complete
        aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $AWS_REGION
    fi
    
    success "Infrastructure deployed successfully"
}

# Get stack outputs
get_stack_outputs() {
    log "Getting stack outputs..."
    
    STACK_NAME="$PROJECT_NAME-$ENVIRONMENT-infrastructure"
    
    # Get S3 bucket name
    S3_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
        --output text)
    
    # Get CloudFront distribution ID
    CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
        --output text)
    
    # Get API Gateway URL
    API_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
        --output text)
    
    # Get Website URL
    WEBSITE_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteUrl`].OutputValue' \
        --output text)
    
    log "S3 Bucket: $S3_BUCKET"
    log "CloudFront ID: $CLOUDFRONT_ID"
    log "API URL: $API_URL"
    log "Website URL: $WEBSITE_URL"
}

# Deploy frontend to S3
deploy_frontend() {
    log "Deploying frontend to S3..."
    
    if [ -z "$S3_BUCKET" ]; then
        error "S3 bucket name not found"
    fi
    
    # Sync files to S3
    aws s3 sync out/ s3://$S3_BUCKET/ \
        --delete \
        --cache-control "public, max-age=31536000" \
        --exclude "*.html" \
        --region $AWS_REGION
    
    # Upload HTML files with shorter cache
    aws s3 sync out/ s3://$S3_BUCKET/ \
        --cache-control "public, max-age=0, must-revalidate" \
        --include "*.html" \
        --region $AWS_REGION
    
    success "Frontend deployed to S3"
}

# Build and deploy Lambda functions
deploy_lambda_functions() {
    log "Building and deploying Lambda functions..."
    
    # Create deployment directory
    mkdir -p dist/lambda
    
    # Package AI Feedback Lambda
    log "Packaging AI Feedback Lambda..."
    cp src/lambda/ai-feedback.js dist/lambda/
    cd dist/lambda
    npm init -y
    npm install @aws-sdk/client-bedrock-runtime @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb
    zip -r ai-feedback.zip ai-feedback.js node_modules/
    cd ../..
    
    # Update AI Feedback Lambda
    aws lambda update-function-code \
        --function-name "$PROJECT_NAME-$ENVIRONMENT-ai-feedback" \
        --zip-file fileb://dist/lambda/ai-feedback.zip \
        --region $AWS_REGION
    
    # Package Adaptive Learning Lambda
    log "Packaging Adaptive Learning Lambda..."
    cd dist/lambda
    rm -f adaptive-learning.zip
    cp ../../src/lambda/adaptive-learning.js .
    zip -r adaptive-learning.zip adaptive-learning.js node_modules/
    cd ../..
    
    # Update Adaptive Learning Lambda
    aws lambda update-function-code \
        --function-name "$PROJECT_NAME-$ENVIRONMENT-adaptive-learning" \
        --zip-file fileb://dist/lambda/adaptive-learning.zip \
        --region $AWS_REGION
    
    # Package Fraud Detection Lambda
    log "Packaging Fraud Detection Lambda..."
    cd dist/lambda
    rm -f fraud-detection.zip
    cp ../../src/lambda/fraud-detection.js .
    zip -r fraud-detection.zip fraud-detection.js node_modules/
    cd ../..
    
    # Update Fraud Detection Lambda
    aws lambda update-function-code \
        --function-name "$PROJECT_NAME-$ENVIRONMENT-fraud-detection" \
        --zip-file fileb://dist/lambda/fraud-detection.zip \
        --region $AWS_REGION
    
    # Package Quiz Submission Lambda
    log "Packaging Quiz Submission Lambda..."
    cd dist/lambda
    rm -f quiz-submission.zip
    cp ../../src/lambda/quiz-submission.js .
    zip -r quiz-submission.zip quiz-submission.js node_modules/
    cd ../..
    
    # Update Quiz Submission Lambda
    aws lambda update-function-code \
        --function-name "$PROJECT_NAME-$ENVIRONMENT-quiz-submission" \
        --zip-file fileb://dist/lambda/quiz-submission.zip \
        --region $AWS_REGION
    
    success "Lambda functions deployed successfully"
}

# Invalidate CloudFront cache
invalidate_cloudfront() {
    log "Invalidating CloudFront cache..."
    
    if [ -z "$CLOUDFRONT_ID" ]; then
        warning "CloudFront distribution ID not found, skipping cache invalidation"
        return
    fi
    
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_ID \
        --paths "/*" \
        --region $AWS_REGION
    
    success "CloudFront cache invalidated"
}

# Health check
health_check() {
    log "Performing health check..."
    
    if [ -z "$API_URL" ]; then
        warning "API URL not found, skipping health check"
        return
    fi
    
    # Wait for API to be ready
    for i in {1..30}; do
        if curl -f "$API_URL/api/health" >/dev/null 2>&1; then
            success "Health check passed: $API_URL/api/health"
            return 0
        fi
        log "Waiting for API to be ready... ($i/30)"
        sleep 10
    done
    
    error "Health check failed after 5 minutes"
}

# Update environment variables
update_environment_variables() {
    log "Updating Lambda environment variables..."
    
    # Update AI Feedback Lambda environment
    aws lambda update-function-configuration \
        --function-name "$PROJECT_NAME-$ENVIRONMENT-ai-feedback" \
        --environment Variables="{
            DYNAMODB_TABLE_PREFIX=$PROJECT_NAME-$ENVIRONMENT-,
            BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0,
            AI_FEEDBACK_ENABLED=true,
            AWS_REGION=$AWS_REGION
        }" \
        --region $AWS_REGION
    
    # Update Adaptive Learning Lambda environment
    aws lambda update-function-configuration \
        --function-name "$PROJECT_NAME-$ENVIRONMENT-adaptive-learning" \
        --environment Variables="{
            DYNAMODB_TABLE_PREFIX=$PROJECT_NAME-$ENVIRONMENT-,
            AWS_REGION=$AWS_REGION
        }" \
        --region $AWS_REGION
    
    # Update Fraud Detection Lambda environment
    aws lambda update-function-configuration \
        --function-name "$PROJECT_NAME-$ENVIRONMENT-fraud-detection" \
        --environment Variables="{
            DYNAMODB_TABLE_PREFIX=$PROJECT_NAME-$ENVIRONMENT-,
            FRAUD_RISK_THRESHOLD=70,
            AWS_REGION=$AWS_REGION
        }" \
        --region $AWS_REGION
    
    # Update Quiz Submission Lambda environment
    aws lambda update-function-configuration \
        --function-name "$PROJECT_NAME-$ENVIRONMENT-quiz-submission" \
        --environment Variables="{
            DYNAMODB_TABLE_PREFIX=$PROJECT_NAME-$ENVIRONMENT-,
            AWS_REGION=$AWS_REGION
        }" \
        --region $AWS_REGION
    
    success "Environment variables updated"
}

# Cleanup
cleanup() {
    log "Cleaning up temporary files..."
    rm -rf dist/lambda
    success "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting S3 + Lambda deployment of $PROJECT_NAME to $ENVIRONMENT environment"
    
    check_prerequisites
    build_frontend
    deploy_infrastructure
    get_stack_outputs
    deploy_frontend
    deploy_lambda_functions
    update_environment_variables
    invalidate_cloudfront
    health_check
    cleanup
    
    success "🎉 Deployment completed successfully!"
    success "Website URL: $WEBSITE_URL"
    success "API URL: $API_URL"
    success "CloudFront Distribution: $CLOUDFRONT_ID"
    
    log "Next steps:"
    log "1. Update your Telegram bot webhook URL to: $API_URL/api/telegram/webhook"
    log "2. Test the AI features at: $WEBSITE_URL/ai-demo"
    log "3. Monitor the application using CloudWatch logs"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "frontend-only")
        check_prerequisites
        build_frontend
        get_stack_outputs
        deploy_frontend
        invalidate_cloudfront
        success "Frontend deployed successfully!"
        ;;
    "lambda-only")
        check_prerequisites
        get_stack_outputs
        deploy_lambda_functions
        update_environment_variables
        success "Lambda functions deployed successfully!"
        ;;
    "health-check")
        get_stack_outputs
        health_check
        ;;
    *)
        echo "Usage: $0 {deploy|frontend-only|lambda-only|health-check}"
        echo ""
        echo "Commands:"
        echo "  deploy        - Full deployment (infrastructure + frontend + lambda)"
        echo "  frontend-only - Deploy only the frontend to S3"
        echo "  lambda-only   - Deploy only the Lambda functions"
        echo "  health-check  - Check if the API is healthy"
        exit 1
        ;;
esac