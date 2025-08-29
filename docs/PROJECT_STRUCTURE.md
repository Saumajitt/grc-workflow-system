# GRC Workflow Management System - Project Structure

## Optimal Folder Organization

```
grc/
├── README.md                    # Main project documentation
├── DEPLOYMENT.md               # Deployment instructions
├── docker-compose.yml         # Development environment
├── docker-compose.prod.yml    # Production environment
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore patterns
├── pom.xml                    # Maven configuration
├── dockerfile                 # Backend Docker configuration
├── mvnw, mvnw.cmd            # Maven wrapper
│
├── docs/                      # Documentation
│   ├── API.md                # API documentation
│   ├── ARCHITECTURE.md       # System architecture
│   └── DEPLOYMENT.md         # Deployment guide
│
├── src/main/                  # Backend source code
│   ├── java/com/saumajit/tprm/grc/
│   │   ├── GrcApplication.java
│   │   ├── config/           # Configuration classes
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtUtil.java
│   │   │   └── JwtAuthenticationFilter.java
│   │   ├── controller/       # REST controllers
│   │   │   ├── AuthController.java
│   │   │   ├── EvidenceController.java
│   │   │   └── HealthController.java
│   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── AuthRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── EvidenceUploadResponse.java
│   │   ├── model/            # JPA entities
│   │   │   ├── User.java
│   │   │   └── EvidenceUpload.java
│   │   ├── repository/       # Data access layer
│   │   │   ├── UserRepository.java
│   │   │   └── EvidenceUploadRepository.java
│   │   └── service/          # Business logic
│   │       ├── UserService.java
│   │       ├── EvidenceProcessingService.java
│   │       └── FileStorageService.java
│   └── resources/
│       ├── application.yml
│       └── application-prod.yml
│
├── src/test/                  # Backend tests
│   └── java/com/saumajit/tprm/grc/
│
├── frontend/                  # Frontend React application
│   ├── public/               # Static assets
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   │   ├── AuthPage.js
│   │   │   │   ├── LoginForm.js
│   │   │   │   ├── RegisterForm.js
│   │   │   │   └── ProtectedRoute.js
│   │   │   ├── evidence/     # Evidence management
│   │   │   │   └── EnhancedEvidenceUpload.js
│   │   │   └── layout/       # Layout components
│   │   │       └── Navbar.js
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.js
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── EvidencePage.js
│   │   │   ├── ThirdPartyPage.js
│   │   │   └── HealthPage.js
│   │   ├── App.js           # Main App component
│   │   ├── index.js         # React entry point
│   │   └── theme.js         # Chakra UI theme
│   ├── package.json         # NPM dependencies
│   ├── Dockerfile          # Frontend Docker config
│   ├── nginx.conf          # Nginx configuration
│   └── .env.example        # Frontend environment variables
│
└── .mvn/wrapper/            # Maven wrapper files
    └── maven-wrapper.properties
```

## Key Organizational Principles

### Backend (Spring Boot)
- **Layered Architecture**: Controller → Service → Repository → Model
- **Configuration Separation**: Security, JWT, and app configs in dedicated package
- **DTO Pattern**: Separate request/response objects from entities
- **Environment-specific configs**: Development and production profiles

### Frontend (React)
- **Feature-based Organization**: Components grouped by functionality
- **Context Pattern**: Centralized state management with React Context
- **Page-based Routing**: Clear separation of page components
- **Reusable Components**: Shared UI components in dedicated folders

### Infrastructure
- **Docker Containerization**: Separate containers for backend, frontend, and services
- **Environment Management**: Template files for easy configuration
- **Documentation**: Comprehensive docs for setup, deployment, and API

### Best Practices Implemented
- ✅ Clear separation of concerns
- ✅ Consistent naming conventions
- ✅ Environment-specific configurations
- ✅ Comprehensive documentation
- ✅ Docker containerization
- ✅ Production-ready structure
