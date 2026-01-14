# Vercel Deployment Guide

## Frontend Deployment (Vercel)

### 1. Prepare for Deployment

```bash
cd frontend
npm run build
```

### 2. Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel login
cd frontend
vercel
```

**Option B: GitHub Integration**
1. Push code to GitHub
2. Connect repository to Vercel
3. Set root directory to `frontend`
4. Vercel auto-detects Vite configuration

### 3. Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your backend URL (e.g., `https://your-api.railway.app`) |

---

## Backend Deployment

**Recommended Platforms:**
- Railway (easiest)
- Render
- Heroku
- DigitalOcean App Platform

### Railway Deployment

1. Connect GitHub repository
2. Set root directory to `backend`
3. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string
   - `NODE_ENV` - `production`
   - `FRONTEND_URL` - Your Vercel frontend URL

### MongoDB Atlas Setup

1. Create free cluster at mongodb.com
2. Create database user
3. Whitelist `0.0.0.0/0` for cloud deployment
4. Copy connection string

---

## Performance Optimizations Applied

✅ **Frontend:**
- Code splitting (vendor/three.js separated)
- ES2015 target for modern browsers
- Gzip compression ready
- Error boundary for crash protection

✅ **Backend:**
- Connection pooling (10 max connections)
- Helmet security headers
- Gzip compression
- Graceful shutdown handling
- CORS configured for production

---

## Build Output

| File | Size | Gzipped |
|------|------|---------|
| CSS | 49 KB | 7 KB |
| App JS | 69 KB | 15 KB |
| Vendor JS | 163 KB | 53 KB |
| Three.js | 862 KB | 234 KB |

**Total: ~310 KB gzipped** (excellent for initial load)
