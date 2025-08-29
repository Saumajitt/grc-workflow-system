# GRC Application - Local Docker Setup Guide

## Prerequisites
- Docker Desktop installed and running
- At least 8GB RAM available for Docker
- Ports 3000, 5050, 5555, 6379, 8081, 9000, 9001, 9092 available

## Quick Start (5 minutes)

### Step 1: Clone and Navigate
```bash
cd "c:\Users\SAUMAJIT\Desktop\Resume Projects\grc"
```

### Step 2: Start All Services
```bash
docker-compose up -d
```

### Step 3: Wait for Services (2-3 minutes)
Monitor startup progress:
```bash
docker-compose logs -f
```

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081
- **Database Admin**: http://localhost:5050 (pgAdmin)
- **File Storage**: http://localhost:9001 (MinIO Console)

## Service Details

### 🌐 Frontend (React)
- **URL**: http://localhost:3000
- **Container**: grc-frontend
- **Features**: Authentication, Evidence Upload, Dashboard

### 🚀 Backend (Spring Boot)
- **URL**: http://localhost:8081
- **Container**: grc-backend
- **Health Check**: http://localhost:8081/api/health
- **API Docs**: http://localhost:8081/swagger-ui.html (if configured)

### 🗄️ Database (PostgreSQL)
- **Host**: localhost:5555
- **Database**: grc_workflow
- **Username**: grc_user
- **Password**: grc_password
- **Admin UI**: http://localhost:5050

### 📁 File Storage (MinIO)
- **API**: http://localhost:9000
- **Console**: http://localhost:9001
- **Username**: minioadmin
- **Password**: minioadmin

### 🔄 Message Queue (Kafka)
- **Bootstrap Server**: localhost:9092
- **Container**: grc-kafka

### ⚡ Cache (Redis)
- **Host**: localhost:6379
- **Container**: grc-redis

## Testing the Application

### 1. Register a New User
1. Go to http://localhost:3000
2. Click "Sign up here"
3. Fill in registration form:
   ```
   Username: testuser
   Email: test@example.com
   Password: password123
   First Name: Test
   Last Name: User
   Organization: Test Org
   Role: USER
   ```
4. Click "Create Account"

### 2. Login
1. Use credentials from registration
2. Should redirect to dashboard

### 3. Test Evidence Upload
1. Navigate to "Evidence" page
2. Drag and drop files or click to select
3. Fill in metadata:
   - Evidence Type: Document
   - Category: Compliance
   - Description: Test evidence upload
   - Tags: test, compliance
4. Click "Upload Evidence Files"

### 4. View Dashboard
1. Return to home page
2. Check statistics and recent activity
3. Use quick action buttons

## Troubleshooting

### Services Not Starting
```bash
# Check service status
docker-compose ps

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Database Connection Issues
```bash
# Restart database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres

# Connect to database directly
docker exec -it grc-postgres psql -U grc_user -d grc_workflow
```

### Backend Not Responding
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check health endpoint
curl http://localhost:8081/api/health
```

### Frontend Build Issues
```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# Check frontend logs
docker-compose logs frontend
```

### Port Conflicts
If ports are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:80"  # Change frontend port
  - "8082:8081"  # Change backend port
```

## Development Commands

### View All Logs
```bash
docker-compose logs -f
```

### Restart Specific Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild and Restart
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Clean Reset (removes data)
```bash
docker-compose down -v
docker-compose up -d
```

### Access Database
```bash
# Via pgAdmin: http://localhost:5050
# Login: admin@admin.com / admin
# Add server: postgres:5432, grc_user, grc_password

# Via command line:
docker exec -it grc-postgres psql -U grc_user -d grc_workflow
```

### Access MinIO Console
```bash
# Go to: http://localhost:9001
# Login: minioadmin / minioadmin
# Create bucket: evidence-uploads
```

## Expected Startup Time
- **Database**: 30 seconds
- **Redis/Kafka**: 1 minute
- **Backend**: 2-3 minutes (includes compilation)
- **Frontend**: 1-2 minutes
- **Total**: 3-4 minutes

## Success Indicators
✅ All containers running: `docker-compose ps`
✅ Backend health: http://localhost:8081/api/health returns 200
✅ Frontend loads: http://localhost:3000 shows login page
✅ Database accessible: pgAdmin connects successfully
✅ File storage ready: MinIO console accessible

## Next Steps After Setup
1. Register test user account
2. Test authentication flow
3. Upload sample evidence files
4. Explore dashboard features
5. Test third-party management
6. Review audit logs in database
