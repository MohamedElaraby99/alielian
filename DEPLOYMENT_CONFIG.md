# 🚀 Deployment Configuration Guide

## 🌐 Domain Configuration

### **Frontend Domain**: `alielian.online`
### **Backend Domain**: `lms.alielian.online`
### **Database Collection**: `alielian`

## 📁 Environment Files

### Backend (.env.production)
```bash
# Production Environment Variables
NODE_ENV=production
PORT=4000

# Database - Collection: alielian
MONGODB_URI=mongodb://localhost:27017/alielian

# JWT
JWT_SECRET=your_production_jwt_secret_key_here

# URLs
CLIENT_URL=https://alielian.online
BACKEND_URL=https://lms.alielian.online
PRODUCTION_URL=https://lms.alielian.online

# CORS
CORS_ORIGIN=https://alielian.online,https://lms.alielian.online

# Other configurations
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
```

### Frontend (.env.production)
```bash
# Production Environment Variables
VITE_REACT_APP_API_URL=https://lms.alielian.online/api/v1
VITE_CLIENT_URL=https://alielian.online
```

## 🔧 Configuration Changes Made

### 1. Backend Server (server.js)
- ✅ `CLIENT_URL` default: `https://alielian.online`
- ✅ `BACKEND_URL` default: `https://lms.alielian.online`
- ✅ `MONGODB_URI` default: `mongodb://localhost:27017/alielian`

### 2. Frontend Axios (axiosInstance.js)
- ✅ `BASE_URL` default: `https://lms.alielian.online/api/v1`

### 3. Vite Config (vite.config.js)
- ✅ `VITE_REACT_APP_API_URL` default: `https://lms.alielian.online/api/v1`

### 4. Frontend File Utils (fileUtils.js)
- ✅ `getBaseApiUrl()` default: `https://lms.alielian.online/api/v1`

### 5. Backend File Utils (fileUtils.js)
- ✅ `PRODUCTION_URL` default: `https://lms.alielian.online`

### 6. CORS Configuration (app.js)
- ✅ Added `https://alielian.online` and `https://lms.alielian.online`
- ✅ Removed old `fikra.solutions` domains

### 7. PDF Converter (pdfConverter.controller.js)
- ✅ Updated domain check to include `lms.alielian.online`

### 8. Database Configuration
- ✅ **Collection Name**: `alielian` (consistent across all files)
- ✅ **Connection String**: `mongodb://localhost:27017/alielian`
- ✅ **Files Updated**: `server.js`, `db.config.js`, all scripts and migrations

## 🗄️ Database Details

### **Collection Name**: `alielian`
- **Local Development**: `mongodb://localhost:27017/alielian`
- **Production**: Can be overridden with `MONGODB_URI` environment variable
- **Consistent**: All backend files use the same collection name

### **Files Using alielian Collection**:
- ✅ `backend/server.js`
- ✅ `backend/config/db.config.js`
- ✅ `backend/test-db.js`
- ✅ All migration scripts
- ✅ All utility scripts

## 🚀 Deployment Steps

1. **Set Environment Variables**:
   - Create `.env.production` files with the configurations above
   - Ensure all production URLs are correctly set
   - Database collection will be `alielian` by default

2. **Build Frontend**:
   ```bash
   cd client
   npm run build
   ```

3. **Deploy Backend**:
   ```bash
   cd backend
   npm start
   ```

4. **Verify URLs**:
   - Frontend: `https://alielian.online`
   - Backend API: `https://lms.alielian.online/api/v1`
   - File uploads: `https://lms.alielian.online/api/v1/uploads/`
   - Database: `alielian` collection

## 🔍 Testing

- ✅ API calls should go to `lms.alielian.online`
- ✅ File uploads/downloads should work with the new domain
- ✅ CORS should allow requests from `alielian.online`
- ✅ All environment variables should resolve correctly
- ✅ Database connection should use `alielian` collection

## 📝 Notes

- Local development will still work with `localhost:4000` and `localhost:5173`
- Production will use the new domains automatically
- Environment variables can override defaults if needed
- SSL certificates must be valid for both domains
- **Database collection `alielian` is already correctly configured throughout the codebase**
