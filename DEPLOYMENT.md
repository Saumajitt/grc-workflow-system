# GRC Application Deployment Guide

## 🚀 Quick Deployment

### Development Environment
```bash
# Clone and start all services
git clone <repository-url>
cd grc
docker-compose up -d
```

### Production Environment
```bash
# Create environment file
cp .env.example .env
# Edit .env with production values

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Pre-Deployment Checklist

### ✅ Required Files Created
- [x] `.gitignore` - Comprehensive ignore patterns
- [x] `README.md` - Complete documentation
- [x] `.env.example` - Environment template
- [x] `docker-compose.prod.yml` - Production configuration
- [x] `application-prod.yml` - Production Spring config
- [x] `frontend/Dockerfile` - Frontend containerization
- [x] `frontend/nginx.conf` - Nginx configuration
- [x] `frontend/.env.example` - Frontend environment template

### ✅ Configuration Fixes Applied
- [x] Docker port mismatch fixed (8080 → 8081)
- [x] Production-safe CORS configuration
- [x] Health checks added to all services
- [x] Proper dependency management
- [x] Security headers in Nginx
- [x] Logging configuration optimized

## 🌐 Cloud Deployment Options

### AWS Deployment
```bash
# Using AWS ECS/Fargate
aws ecs create-cluster --cluster-name grc-cluster
aws ecs create-service --cluster grc-cluster --service-name grc-service
```

### Azure Deployment
```bash
# Using Azure Container Instances
az group create --name grc-rg --location eastus
az container create --resource-group grc-rg --name grc-app
```

### Heroku Deployment
```bash
# Using Heroku Container Registry
heroku create grc-app
heroku container:push web
heroku container:release web
```

## 📊 Monitoring & Health Checks

### Health Endpoints
- **Application**: `http://localhost:8081/api/health`
- **Actuator**: `http://localhost:8081/actuator/health`
- **Metrics**: `http://localhost:8081/actuator/metrics`

### Service URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081
- **pgAdmin**: http://localhost:5050
- **MinIO Console**: http://localhost:9001

## 🔐 Security Considerations

### Production Security
1. Change default passwords in `.env`
2. Use HTTPS in production
3. Configure proper CORS origins
4. Enable authentication for admin interfaces
5. Use secrets management for sensitive data

### Environment Variables
```bash
# Required for production
POSTGRES_PASSWORD=<strong-password>
MINIO_ROOT_PASSWORD=<strong-password>
JWT_SECRET=<random-256-bit-key>
```

## 🐛 Troubleshooting

### Common Issues
1. **Port conflicts**: Check if ports are available
2. **Database connection**: Verify PostgreSQL is running
3. **File upload issues**: Check MinIO configuration
4. **Frontend API calls**: Verify proxy settings

### Debug Commands
```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Check service health
curl http://localhost:8081/api/health
curl http://localhost:3000

# Database connection test
docker exec -it grc-postgres psql -U grc_user -d grc_workflow
```

## 📈 Performance Optimization

### Production Tuning
- JVM heap size: `-Xmx1g -Xms512m`
- Database connection pool: 20 max connections
- Redis connection pool: 10 max connections
- Nginx gzip compression enabled
- Static asset caching: 1 year

### Scaling Considerations
- Horizontal scaling with load balancer
- Database read replicas
- Redis cluster for high availability
- CDN for static assets

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy GRC Application
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Post-Deployment Tasks

1. **Verify all services are running**
2. **Test API endpoints**
3. **Upload sample data**
4. **Configure monitoring alerts**
5. **Set up backup procedures**
6. **Document any customizations**

---

**Ready for production deployment! 🎉**
