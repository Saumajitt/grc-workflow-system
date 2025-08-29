# AWS Deployment Guide

## Option 1: AWS ECS with Fargate

### Prerequisites
- AWS CLI configured
- Docker images pushed to ECR
- VPC with public/private subnets

### Step 1: Create ECR Repositories
```bash
aws ecr create-repository --repository-name grc-backend
aws ecr create-repository --repository-name grc-frontend
```

### Step 2: Build and Push Images
```bash
# Backend
docker build -t grc-backend .
docker tag grc-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/grc-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/grc-backend:latest

# Frontend
docker build -t grc-frontend ./frontend
docker tag grc-frontend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/grc-frontend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/grc-frontend:latest
```

### Step 3: Create ECS Task Definitions
```json
{
  "family": "grc-backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "grc-backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/grc-backend:latest",
      "portMappings": [
        {
          "containerPort": 8081,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "prod"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/grc-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 4: Create RDS PostgreSQL Instance
```bash
aws rds create-db-instance \
  --db-instance-identifier grc-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username grcuser \
  --master-user-password YourSecurePassword \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-12345678 \
  --db-subnet-group-name default
```

### Step 5: Create ElastiCache Redis Cluster
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id grc-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --security-group-ids sg-12345678
```

## Option 2: AWS Elastic Beanstalk

### Step 1: Create Application
```bash
eb init grc-application --platform java-21 --region us-east-1
```

### Step 2: Deploy Backend
```bash
mvn clean package
eb create grc-backend-env --instance-type t3.medium
```

### Step 3: Deploy Frontend to S3 + CloudFront
```bash
cd frontend
npm run build
aws s3 sync build/ s3://grc-frontend-bucket --delete
aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"
```

## Option 3: AWS App Runner

### Step 1: Create apprunner.yaml
```yaml
version: 1.0
runtime: java21
build:
  commands:
    build:
      - mvn clean package -DskipTests
run:
  runtime-version: 21
  command: java -jar target/grc-0.0.1-SNAPSHOT.jar
  network:
    port: 8081
    env: PORT
  env:
    - name: SPRING_PROFILES_ACTIVE
      value: prod
```

### Step 2: Deploy with App Runner
```bash
aws apprunner create-service \
  --service-name grc-backend \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "123456789012.dkr.ecr.us-east-1.amazonaws.com/grc-backend:latest",
      "ImageConfiguration": {
        "Port": "8081"
      },
      "ImageRepositoryType": "ECR"
    },
    "AutoDeploymentsEnabled": true
  }'
```

## Environment Variables for Production

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://grc-postgres.cluster-xyz.us-east-1.rds.amazonaws.com:5432/grc
SPRING_DATASOURCE_USERNAME=grcuser
SPRING_DATASOURCE_PASSWORD=SecurePassword123

# Redis
SPRING_REDIS_HOST=grc-redis.abc123.cache.amazonaws.com
SPRING_REDIS_PORT=6379

# MinIO/S3
MINIO_ENDPOINT=https://s3.amazonaws.com
MINIO_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
MINIO_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
MINIO_BUCKET_EVIDENCE=grc-evidence-bucket

# JWT
JWT_SECRET=YourVerySecureJWTSecretKeyHere
JWT_EXPIRATION=86400000

# Kafka (Amazon MSK)
SPRING_KAFKA_BOOTSTRAP_SERVERS=b-1.grc-cluster.abc123.c2.kafka.us-east-1.amazonaws.com:9092
```

## Cost Optimization

### Development Environment
- **RDS**: db.t3.micro ($13/month)
- **ElastiCache**: cache.t3.micro ($11/month)
- **ECS Fargate**: 0.25 vCPU, 0.5GB ($8/month)
- **S3**: Standard storage ($3/month)
- **Total**: ~$35/month

### Production Environment
- **RDS**: db.t3.small with Multi-AZ ($45/month)
- **ElastiCache**: cache.t3.small ($22/month)
- **ECS Fargate**: 1 vCPU, 2GB x2 instances ($60/month)
- **Application Load Balancer**: ($18/month)
- **CloudFront**: ($5/month)
- **Total**: ~$150/month
