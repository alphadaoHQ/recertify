#!/bin/bash

# Recertify Mini - Production Deployment Script
# This script handles secure deployment to AWS with proper infrastructure setup

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
ENVIRONMENT="${ENVIRONMENT:-production}"
DOCKER_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD)}"

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
    command -v docker >/dev/null 2>&1 || error "Docker is required but not installed"
    command -v node >/dev/null 2>&1 || error "Node.js is required but not installed"
    command -v npm >/dev/null 2>&1 || error "npm is required but not installed"
    
    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error "AWS credentials not configured"
    
    # Check environment variables
    [ -z "$AWS_ACCOUNT_ID" ] && error "AWS_ACCOUNT_ID environment variable is required"
    [ -z "$TELEGRAM_BOT_TOKEN" ] && error "TELEGRAM_BOT_TOKEN environment variable is required"
    
    success "Prerequisites check passed"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    npm ci
    npm run type-check
    npm run lint
    npm run test --if-present
    
    success "All tests passed"
}

# Build and push Docker image
build_and_push_image() {
    log "Building and pushing Docker image..."
    
    # Login to ECR
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $DOCKER_REGISTRY
    
    # Create ECR repository if it doesn't exist
    aws ecr describe-repositories --repository-names $PROJECT_NAME --region $AWS_REGION >/dev/null 2>&1 || \
        aws ecr create-repository --repository-name $PROJECT_NAME --region $AWS_REGION
    
    # Build image
    docker build -t $PROJECT_NAME:$IMAGE_TAG .
    docker tag $PROJECT_NAME:$IMAGE_TAG $DOCKER_REGISTRY/$PROJECT_NAME:$IMAGE_TAG
    docker tag $PROJECT_NAME:$IMAGE_TAG $DOCKER_REGISTRY/$PROJECT_NAME:latest
    
    # Push image
    docker push $DOCKER_REGISTRY/$PROJECT_NAME:$IMAGE_TAG
    docker push $DOCKER_REGISTRY/$PROJECT_NAME:latest
    
    success "Docker image built and pushed: $DOCKER_REGISTRY/$PROJECT_NAME:$IMAGE_TAG"
}

# Deploy infrastructure
deploy_infrastructure() {
    log "Deploying infrastructure..."
    
    # Create CloudFormation stack or update if exists
    STACK_NAME="$PROJECT_NAME-$ENVIRONMENT"
    
    if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION >/dev/null 2>&1; then
        log "Updating existing CloudFormation stack..."
        aws cloudformation update-stack \
            --stack-name $STACK_NAME \
            --template-body file://infrastructure/cloudformation.yml \
            --parameters file://infrastructure/parameters-$ENVIRONMENT.json \
            --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
            --region $AWS_REGION
    else
        log "Creating new CloudFormation stack..."
        aws cloudformation create-stack \
            --stack-name $STACK_NAME \
            --template-body file://infrastructure/cloudformation.yml \
            --parameters file://infrastructure/parameters-$ENVIRONMENT.json \
            --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
            --region $AWS_REGION
    fi
    
    # Wait for stack to complete
    log "Waiting for CloudFormation stack to complete..."
    aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $AWS_REGION || \
    aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $AWS_REGION
    
    success "Infrastructure deployed successfully"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    # Update ECS service with new image
    CLUSTER_NAME="$PROJECT_NAME-$ENVIRONMENT"
    SERVICE_NAME="$PROJECT_NAME-service"
    
    # Get current task definition
    TASK_DEFINITION=$(aws ecs describe-services \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --region $AWS_REGION \
        --query 'services[0].taskDefinition' \
        --output text)
    
    # Create new task definition with updated image
    NEW_TASK_DEF=$(aws ecs describe-task-definition \
        --task-definition $TASK_DEFINITION \
        --region $AWS_REGION \
        --query 'taskDefinition' \
        --output json | \
        jq --arg IMAGE "$DOCKER_REGISTRY/$PROJECT_NAME:$IMAGE_TAG" \
        '.containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.placementConstraints) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')
    
    # Register new task definition
    NEW_TASK_DEF_ARN=$(echo $NEW_TASK_DEF | aws ecs register-task-definition \
        --region $AWS_REGION \
        --cli-input-json file:///dev/stdin \
        --query 'taskDefinition.taskDefinitionArn' \
        --output text)
    
    # Update service
    aws ecs update-service \
        --cluster $CLUSTER_NAME \
        --service $SERVICE_NAME \
        --task-definition $NEW_TASK_DEF_ARN \
        --region $AWS_REGION
    
    # Wait for deployment to complete
    log "Waiting for deployment to complete..."
    aws ecs wait services-stable \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --region $AWS_REGION
    
    success "Application deployed successfully"
}

# Update Lambda functions
deploy_lambda_functions() {
    log "Deploying Lambda functions..."
    
    # Build Lambda deployment package
    npm run build:lambda
    
    # Deploy AI Feedback Lambda
    aws lambda update-function-code \
        --function-name "$PROJECT_NAME-ai-feedback-$ENVIRONMENT" \
        --zip-file fileb://dist/lambda/ai-feedback.zip \
        --region $AWS_REGION
    
    # Deploy Adaptive Learning Lambda
    aws lambda update-function-code \
        --function-name "$PROJECT_NAME-adaptive-learning-$ENVIRONMENT" \
        --zip-file fileb://dist/lambda/adaptive-learning.zip \
        --region $AWS_REGION
    
    # Deploy Fraud Detection Lambda
    aws lambda update-function-code \
        --function-name "$PROJECT_NAME-fraud-detection-$ENVIRONMENT" \
        --zip-file fileb://dist/lambda/fraud-detection.zip \
        --region $AWS_REGION
    
    success "Lambda functions deployed successfully"
}

# Update environment variables
update_environment() {
    log "Updating environment variables..."
    
    # Update Lambda environment variables
    aws lambda update-function-configuration \
        --function-name "$PROJECT_NAME-ai-feedback-$ENVIRONMENT" \
        --environment Variables="{
            DYNAMODB_TABLE_PREFIX=$PROJECT_NAME-$ENVIRONMENT-,
            REDIS_ENDPOINT=$(aws cloudformation describe-stacks --stack-name $PROJECT_NAME-$ENVIRONMENT --query 'Stacks[0].Outputs[?OutputKey==`RedisEndpoint`].OutputValue' --output text --region $AWS_REGION),
            BEDROCK_REGION=$AWS_REGION
        }" \
        --region $AWS_REGION
    
    success "Environment variables updated"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Create DynamoDB tables if they don't exist
    aws dynamodb describe-table --table-name "$PROJECT_NAME-$ENVIRONMENT-users" --region $AWS_REGION >/dev/null 2>&1 || \
        aws dynamodb create-table \
            --table-name "$PROJECT_NAME-$ENVIRONMENT-users" \
            --attribute-definitions AttributeName=userId,AttributeType=S \
            --key-schema AttributeName=userId,KeyType=HASH \
            --billing-mode PAY_PER_REQUEST \
            --region $AWS_REGION
    
    # Add more table creations as needed
    
    success "Database migrations completed"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Get application URL from CloudFormation outputs
    APP_URL=$(aws cloudformation describe-stacks \
        --stack-name "$PROJECT_NAME-$ENVIRONMENT" \
        --query 'Stacks[0].Outputs[?OutputKey==`ApplicationURL`].OutputValue' \
        --output text \
        --region $AWS_REGION)
    
    # Wait for application to be ready
    for i in {1..30}; do
        if curl -f "$APP_URL/health" >/dev/null 2>&1; then
            success "Health check passed: $APP_URL"
            return 0
        fi
        log "Waiting for application to be ready... ($i/30)"
        sleep 10
    done
    
    error "Health check failed after 5 minutes"
}

# Rollback function
rollback() {
    warning "Rolling back deployment..."
    
    # Get previous task definition
    PREVIOUS_TASK_DEF=$(aws ecs list-task-definitions \
        --family-prefix "$PROJECT_NAME-$ENVIRONMENT" \
        --status ACTIVE \
        --sort DESC \
        --region $AWS_REGION \
        --query 'taskDefinitionArns[1]' \
        --output text)
    
    if [ "$PREVIOUS_TASK_DEF" != "None" ]; then
        # Update service with previous task definition
        aws ecs update-service \
            --cluster "$PROJECT_NAME-$ENVIRONMENT" \
            --service "$PROJECT_NAME-service" \
            --task-definition $PREVIOUS_TASK_DEF \
            --region $AWS_REGION
        
        warning "Rollback initiated to: $PREVIOUS_TASK_DEF"
    else
        error "No previous task definition found for rollback"
    fi
}

# Cleanup old resources
cleanup() {
    log "Cleaning up old resources..."
    
    # Remove old Docker images (keep last 5)
    aws ecr list-images \
        --repository-name $PROJECT_NAME \
        --filter tagStatus=UNTAGGED \
        --region $AWS_REGION \
        --query 'imageIds[5:]' \
        --output json | \
        aws ecr batch-delete-image \
            --repository-name $PROJECT_NAME \
            --image-ids file:///dev/stdin \
            --region $AWS_REGION >/dev/null 2>&1 || true
    
    success "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting deployment of $PROJECT_NAME to $ENVIRONMENT environment"
    
    # Trap errors and rollback
    trap 'error "Deployment failed! Check logs above."; rollback' ERR
    
    check_prerequisites
    run_tests
    build_and_push_image
    deploy_infrastructure
    deploy_application
    deploy_lambda_functions
    update_environment
    run_migrations
    health_check
    cleanup
    
    success "🎉 Deployment completed successfully!"
    success "Application URL: $(aws cloudformation describe-stacks --stack-name $PROJECT_NAME-$ENVIRONMENT --query 'Stacks[0].Outputs[?OutputKey==`ApplicationURL`].OutputValue' --output text --region $AWS_REGION)"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "rollback")
        rollback
        ;;
    "health-check")
        health_check
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|health-check|cleanup}"
        exit 1
        ;;
esac