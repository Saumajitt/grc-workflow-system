# Netlify Deployment Guide (Frontend Only)

## Quick Deploy to Netlify

### Step 1: Build Frontend
```bash
cd frontend
npm run build
```

### Step 2: Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

### Step 3: Configure Environment Variables
In Netlify dashboard, add:
```
REACT_APP_API_BASE_URL=https://your-backend-url.herokuapp.com
REACT_APP_FILE_UPLOAD_MAX_SIZE=52428800
REACT_APP_SUPPORTED_FILE_TYPES=pdf,doc,docx,xls,xlsx,png,jpg,jpeg,gif,txt,csv
```

### Step 4: Configure Redirects
Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

## Heroku Deployment (Backend)

### Step 1: Create Heroku App
```bash
heroku create grc-backend-app
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini
```

### Step 2: Configure Environment Variables
```bash
heroku config:set SPRING_PROFILES_ACTIVE=prod
heroku config:set JWT_SECRET=YourSecureJWTSecret
heroku config:set MINIO_ENDPOINT=https://your-minio-instance.com
heroku config:set MINIO_ACCESS_KEY=your-access-key
heroku config:set MINIO_SECRET_KEY=your-secret-key
```

### Step 3: Deploy
```bash
git push heroku main
```

## Full Stack Deployment URLs
- **Frontend**: https://grc-workflow.netlify.app
- **Backend**: https://grc-backend-app.herokuapp.com
- **Total Cost**: ~$7-15/month
