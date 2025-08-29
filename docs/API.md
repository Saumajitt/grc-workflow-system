# GRC Workflow Management System - API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "organization": "string",
  "role": "USER|ADMIN|AUDITOR"
}
```

**Response:**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "organization": "string",
    "role": "USER"
  }
}
```

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "usernameOrEmail": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  }
}
```

### GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "organization": "string",
  "role": "USER"
}
```

## Evidence Management Endpoints

### POST /api/evidence/upload/single
Upload a single evidence file.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File to upload
- `evidenceType`: DOCUMENT|SCREENSHOT|CERTIFICATE|POLICY|AUDIT_REPORT|ASSESSMENT|OTHER
- `description`: String description
- `tags`: Comma-separated tags
- `questionnaireId`: Optional questionnaire ID
- `questionId`: Optional question ID

**Response:**
```json
{
  "batchId": "uuid-string",
  "status": "PENDING",
  "message": "Evidence upload initiated successfully"
}
```

### POST /api/evidence/upload/multiple
Upload multiple evidence files in a batch.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `files[]`: Multiple files to upload
- `evidenceType`: Evidence type for all files
- `applicablePolicies`: Applicable policies
- `description`: Description for all files
- `tags`: Comma-separated tags
- `category`: COMPLIANCE|SECURITY|PRIVACY|OPERATIONAL|FINANCIAL|LEGAL
- `questionnaireId`: Optional questionnaire ID
- `questionId`: Optional question ID

**Response:**
```json
{
  "batchId": "uuid-string",
  "status": "PROCESSING",
  "message": "Batch upload completed: X successful, Y failed",
  "totalFiles": 5,
  "successfulCount": 4,
  "failedCount": 1,
  "failedFiles": ["filename.pdf"],
  "successfulFiles": ["file1.pdf", "file2.docx", "file3.png", "file4.xlsx"]
}
```

### GET /api/evidence/batch/{batchId}
Get status of a batch upload.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "batchId": "uuid-string",
    "fileName": "evidence.pdf",
    "originalFileName": "original_evidence.pdf",
    "fileSize": 1024000,
    "contentType": "application/pdf",
    "status": "COMPLETED",
    "evidenceType": "DOCUMENT",
    "description": "Compliance evidence",
    "tags": "compliance,audit",
    "uploadedAt": "2024-01-01T10:00:00Z"
  }
]
```

### GET /api/evidence/user
Get all evidence uploaded by the current user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "batchId": "uuid-string",
    "fileName": "evidence.pdf",
    "status": "COMPLETED",
    "evidenceType": "DOCUMENT",
    "uploadedAt": "2024-01-01T10:00:00Z"
  }
]
```

### PUT /api/evidence/{id}/approve
Approve evidence (Admin/Auditor only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Evidence approved successfully"
}
```

### PUT /api/evidence/{id}/reject
Reject evidence with reason (Admin/Auditor only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "reason": "Insufficient documentation quality"
}
```

**Response:**
```json
{
  "message": "Evidence rejected successfully"
}
```

### GET /api/evidence/types
Get available evidence types.

**Response:**
```json
[
  "DOCUMENT",
  "SCREENSHOT", 
  "CERTIFICATE",
  "POLICY",
  "AUDIT_REPORT",
  "ASSESSMENT",
  "OTHER"
]
```

### GET /api/evidence/policy-types
Get available policy types.

**Response:**
```json
[
  "ISO 27001",
  "SOC 2",
  "GDPR",
  "HIPAA",
  "PCI DSS",
  "NIST",
  "Custom Policy"
]
```

## Health Check Endpoint

### GET /api/health
Check application health status.

**Response:**
```json
{
  "status": "UP",
  "timestamp": "2024-01-01T10:00:00Z",
  "services": {
    "database": "UP",
    "redis": "UP",
    "kafka": "UP",
    "minio": "UP"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "details": ["Field 'email' is required"]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```
