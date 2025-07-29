# Deployment Guide

This document provides instructions for deploying the Stock Management Website to various hosting platforms.

## 🚀 Quick Deployment

### Prerequisites

- Git repository with your code
- MongoDB database (Atlas recommended for production)
- Financial Modeling Prep API key (optional)

## 🎯 Recommended Deployment Stack

### Frontend: Vercel (Recommended)

**Why Vercel:**

- Built for Next.js applications
- Automatic deployments from Git
- Edge functions and caching
- Free tier available

**Steps:**

1. **Connect Repository:**

   ```bash
   # Push your code to GitHub/GitLab
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**

   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Set build command: `npx nx build stocks-manager`
   - Set output directory: `apps/stocks-manager/.next`

3. **Environment Variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

### Backend: Railway (Recommended)

**Why Railway:**

- Simple deployment process
- Built-in PostgreSQL/MongoDB
- Automatic scaling
- Affordable pricing

**Steps:**

1. **Create railway.json:**

   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "cd apps/stocks-manager-api && node dist/main.js",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

2. **Deploy to Railway:**

   - Visit [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Set build command: `npx nx build stocks-manager-api`
   - Set start command: `node apps/stocks-manager-api/dist/main.js`

3. **Environment Variables:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stocks-manager
   FMP_API_KEY=your_fmp_api_key_here
   PORT=3001
   NODE_ENV=production
   ```

### Database: MongoDB Atlas

**Steps:**

1. **Create Atlas Account:**

   - Visit [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free account and cluster

2. **Setup Database:**

   - Create database named `stocks-manager`
   - Create database user with read/write permissions
   - Add IP addresses to whitelist (0.0.0.0/0 for all IPs)

3. **Get Connection String:**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/stocks-manager
   ```

## 🔧 Alternative Deployment Options

### Frontend Alternatives

#### Netlify

```bash
# Build command
npx nx build stocks-manager

# Publish directory
apps/stocks-manager/.next
```

#### Cloudflare Pages

- Similar to Vercel
- Good global CDN
- Competitive pricing

### Backend Alternatives

#### Render

```yaml
# render.yaml
services:
  - type: web
    name: stocks-manager-api
    env: node
    buildCommand: npx nx build stocks-manager-api
    startCommand: node apps/stocks-manager-api/dist/main.js
    envVars:
      - key: NODE_ENV
        value: production
```

#### Heroku

```json
// package.json scripts
{
  "scripts": {
    "heroku-postbuild": "npx nx build stocks-manager-api",
    "start": "node apps/stocks-manager-api/dist/main.js"
  }
}
```

#### DigitalOcean App Platform

- Docker container deployment
- Managed databases available
- Scalable infrastructure

## 🐳 Docker Deployment

### Frontend Dockerfile

```dockerfile
# apps/stocks-manager/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY apps/stocks-manager/package*.json ./apps/stocks-manager/
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx nx build stocks-manager

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/stocks-manager/.next/standalone ./
COPY --from=builder /app/apps/stocks-manager/.next/static ./apps/stocks-manager/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "apps/stocks-manager/server.js"]
```

### Backend Dockerfile

```dockerfile
# apps/stocks-manager-api/Dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/stocks-manager-api/package*.json ./apps/stocks-manager-api/
RUN npm ci --only=production

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx nx build stocks-manager-api

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/apps/stocks-manager-api/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: apps/stocks-manager/Dockerfile
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: apps/stocks-manager-api/Dockerfile
    ports:
      - '3001:3001'
    environment:
      - MONGO_URI=mongodb://mongo:27017/stocks-manager
      - FMP_API_KEY=${FMP_API_KEY}
      - PORT=3001
      - NODE_ENV=production
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🔒 Environment Variables

### Production Environment Setup

Create `.env.production` files:

**Frontend** (`apps/stocks-manager/.env.production`):

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

**Backend** (`apps/stocks-manager-api/.env.production`):

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stocks-manager
FMP_API_KEY=your_production_fmp_api_key
PORT=3001
NODE_ENV=production
```

## 🚦 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx nx build stocks-manager
      # Deploy to Vercel/Netlify

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx nx build stocks-manager-api
      # Deploy to Railway/Render
```

## 📊 Performance Optimization for Production

### Frontend Optimizations

1. **Next.js Config:**

   ```javascript
   // apps/stocks-manager/next.config.js
   module.exports = {
     output: 'standalone',
     images: {
       domains: ['your-image-domains.com'],
     },
     experimental: {
       optimizeCss: true,
     },
   };
   ```

2. **Enable Compression:**
   - Gzip/Brotli compression
   - Image optimization
   - Code splitting

### Backend Optimizations

1. **Database Indexing:**

   ```javascript
   // Add indexes for better performance
   db.portfolios.createIndex({ sessionId: 1 });
   db.portfolios.createIndex({ 'stocks.symbol': 1 });
   ```

2. **Caching Strategy:**
   - Redis for session storage
   - API response caching
   - Database query caching

## 🔍 Monitoring & Logging

### Recommended Tools

- **Frontend**: Vercel Analytics, Google Analytics
- **Backend**: Railway Metrics, DataDog, New Relic
- **Database**: MongoDB Atlas Monitoring
- **Uptime**: Pingdom, UptimeRobot

### Health Check Endpoints

Add to backend:

```typescript
@Get('health')
getHealth() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}
```

## 🆘 Troubleshooting

### Common Issues

**Build Failures:**

- Check Node.js version compatibility
- Verify all dependencies are installed
- Check TypeScript errors

**Runtime Errors:**

- Verify environment variables are set
- Check database connectivity
- Review API key permissions

**Performance Issues:**

- Enable caching layers
- Optimize database queries
- Use CDN for static assets

### Debug Commands

```bash
# Check build output
npx nx build stocks-manager --verbose

# Test production build locally
npm run start:prod

# Check backend health
curl https://your-api-url.com/health
```

## 📈 Scaling Considerations

### Auto-scaling

- **Frontend**: Edge deployments (Vercel/Cloudflare)
- **Backend**: Horizontal scaling (Railway/Render)
- **Database**: MongoDB Atlas auto-scaling

### Performance Monitoring

- Set up alerts for response times
- Monitor API rate limits
- Track database performance metrics

---

**Ready for production! 🚀**

For specific deployment platform guides, check their respective documentation.
