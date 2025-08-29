# GRC Workflow Management System

A comprehensive **Third Party Risk Management (TPRM)** application built with Spring Boot and React, featuring bulk data processing, evidence management, and workflow automation.

## 🚀 Features

### Backend Capabilities
- **Bulk Import Processing**: CSV-based third-party data import with validation
- **Evidence Management**: File upload and processing with MinIO object storage
- **Workflow Automation**: Kafka-based asynchronous processing
- **Caching Layer**: Redis integration for improved performance
- **Health Monitoring**: Actuator endpoints for system monitoring
- **Security**: Spring Security with CORS configuration

### Frontend Features
- **Modern UI**: React with Chakra UI components
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-friendly interface
- **Real-time Status**: Batch processing status monitoring
- **File Upload**: Drag-and-drop evidence upload
- **Search & Filter**: Third-party data management

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Spring Boot    │    │   PostgreSQL    │
│   (Port 3001)   │◄──►│   Backend       │◄──►│   Database      │
│                 │    │   (Port 8081)   │    │   (Port 5555)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │     Redis       │    │     MinIO       │
         └─────────────►│   Cache         │    │  Object Storage │ 
                        │   (Port 6379)   │    │   (Port 9000)   │
                        └─────────────────┘    └─────────────────┘
                                 │                       │
                        ┌─────────────────┐              │
                        │     Kafka       │◄─────────────┘
                        │  Message Queue  │
                        │   (Port 9092)   │
                        └─────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.5
- **Language**: Java 21
- **Database**: PostgreSQL 17
- **Cache**: Redis 7
- **Message Queue**: Apache Kafka
- **Object Storage**: MinIO
- **Security**: Spring Security
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.3.1
- **UI Library**: Chakra UI 2.8.2
- **Routing**: React Router DOM 7.8.2
- **Icons**: React Icons 5.5.0
- **Animation**: Framer Motion 10.18.0

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database Admin**: pgAdmin 4
- **Monitoring**: Spring Boot Actuator

## 🚦 Prerequisites

- **Docker** and **Docker Compose**
- **Java 21** (for local development)
- **Node.js 18+** (for frontend development)
- **Maven 3.9+** (for backend development)

## 🏃‍♂️ Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grc
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8081
   - **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)
   - **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin)

### Local Development

#### Backend Setup
```bash
# Navigate to project root
cd grc

# Start infrastructure services
docker-compose up -d postgres redis kafka minio

# Run Spring Boot application
./mvnw spring-boot:run
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 📊 API Endpoints

### Health & Monitoring
- `GET /api/health` - Application health status
- `GET /actuator/health` - Detailed health information
- `GET /actuator/metrics` - Application metrics

### Third Party Management
- `POST /api/third-party/bulk-import` - Bulk import CSV data
- `GET /api/third-party/batch-status/{batchId}` - Check import status
- `GET /api/third-party/search` - Search third-party records

### Evidence Management
- `POST /api/evidence/upload` - Upload evidence files
- `GET /api/evidence/batch-status/{batchId}` - Check processing status

## 🗃️ Database Schema

### Core Entities
- **ThirdParty**: Vendor/partner information
- **EvidenceUpload**: File upload tracking
- **BulkImportJob**: Batch processing jobs
- **EvidenceCategory**: Classification system

## 🔧 Configuration

### Environment Variables

#### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://postgres:5432/grc_workflow
    username: grc_user
    password: grc_password
  
  redis:
    host: redis
    port: 6379
  
  kafka:
    bootstrap-servers: kafka:29092

minio:
  endpoint: http://minio:9000
  access-key: minioadmin
  secret-key: minioadmin
```

#### Frontend (package.json)
```json
{
  "proxy": "http://localhost:8081"
}
```

## 🚀 Deployment

### Production Build

1. **Build backend**
   ```bash
   ./mvnw clean package -DskipTests
   ```

2. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment Options
- **AWS**: ECS/EKS with RDS, ElastiCache, MSK
- **Azure**: Container Instances with Azure Database
- **GCP**: Cloud Run with Cloud SQL, Memorystore

## 🧪 Testing

### Backend Tests
```bash
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
./mvnw verify -Pintegration-tests
```

## 📈 Monitoring & Observability

### Health Checks
- Application health: `/actuator/health`
- Database connectivity
- Redis connectivity
- Kafka connectivity
- MinIO connectivity

### Metrics
- JVM metrics
- HTTP request metrics
- Database connection pool
- Cache hit/miss ratios

### Logging
- Structured JSON logging
- Log levels: DEBUG, INFO, WARN, ERROR
- Centralized logging with ELK stack (optional)

## 🔒 Security Features

- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Request payload validation
- **File Upload Security**: Type and size restrictions
- **SQL Injection Prevention**: JPA/Hibernate protection
- **XSS Protection**: Content Security Policy headers

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Check if ports 3000, 8081, 5555, 6379, 9000, 9092 are available
   - Modify docker-compose.yml port mappings if needed

2. **Database Connection**
   - Ensure PostgreSQL container is running
   - Check connection string in application.yml

3. **Frontend API Calls**
   - Verify proxy configuration in package.json
   - Check CORS settings in SecurityConfig.java

4. **File Upload Issues**
   - Verify MinIO container is running
   - Check bucket creation and permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Saumajit Malakar**
- Email: [saumajit15sam@gmail.com]
- LinkedIn: [https://www.linkedin.com/in/saumajit-malakar/]
- GitHub: [https://github.com/Saumajitt]

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- Chakra UI team for beautiful React components
- Docker community for containerization best practices

---

**Built with ❤️ for enterprise GRC workflows**
