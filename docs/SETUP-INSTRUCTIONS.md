# Stock Management Website - Setup Instructions

## 🚀 Quick Start

This project is **COMPLETE** and ready to run. Follow these steps to get started:

### 1. Prerequisites

- **Node.js 18+**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

### 2. Clone & Install

```bash
git clone https://github.com/idozr/git-sm.git
cd stocks-manager
npm install
```

### 3. Install App Dependencies

**Important**: After the root install, ensure all app dependencies are installed:

```bash
# Install frontend dependencies
cd apps/stocks-manager
npm install
cd ../..

# Install backend API dependencies
cd apps/stocks-manager-api
npm install
cd ../..
```

> **Note**: This project uses npm workspaces. While the root `npm install` should handle most dependencies, some app-specific packages may need to be installed separately in each app directory to ensure all dependencies are properly resolved.

### 4. Environment Setup

**Frontend** (`apps/stocks-manager/.env.local`):

```bash
cp apps/stocks-manager/.env.example apps/stocks-manager/.env.local
# Edit the file and set:
NEXT_PUBLIC_API_URL=http://localhost:3005/api
```

**Backend** (`apps/stocks-manager-api/.env.local`):

```bash
cp apps/stocks-manager-api/.env.example apps/stocks-manager-api/.env.local
# Edit the file and set:
MONGO_URI=mongodb://localhost:27017/stocks-manager
FMP_API_KEY=your_api_key_here  # Optional - uses demo if not provided
PORT=3005
```

### 5. Start MongoDB

```bash
# Option 1: Local MongoDB
mongod

# Option 2: Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 6. Run the Applications

**Terminal 1 - Backend:**

```bash
npx nx serve stocks-manager-api
```

**Terminal 2 - Frontend:**

```bash
npx nx dev stocks-manager
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3005/api

## 🎯 What You Get

### ✅ Complete Features

- **Portfolio Management**: Add/remove stocks from your personal portfolio
- **Market Data**: View most active stocks, top gainers, biggest losers
- **Stock Search**: Search for any stock by symbol or company name
- **Stock Details**: Comprehensive information about any stock
- **User Sessions**: Simple session-based user management
- **Responsive UI**: Modern Material-UI design that works on all devices

### ✅ Technical Features

- **Full Stack**: Next.js frontend + NestJS backend
- **Database**: MongoDB with caching
- **State Management**: Redux Toolkit + React Query
- **API Integration**: Financial Modeling Prep API
- **Type Safety**: End-to-end TypeScript
- **Production Ready**: Error handling, rate limiting, caching

## 📁 Project Structure

```
stocks-manager/
├── apps/
│   ├── stocks-manager/          # Next.js Frontend
│   ├── stocks-manager-api/      # NestJS Backend
│   └── stocks-manager-api-e2e/  # E2E Tests
├── libs/
│   └── interfaces/              # Shared TypeScript Types
├── docs/                        # Documentation
│   ├── API.md                   # API Documentation
│   ├── USER_GUIDE.md           # User Guide
│   └── DEPLOYMENT.md           # Deployment Guide
├── README.md                    # Main documentation
├── PLANNING.md                  # Project architecture
└── TASK.md                     # Development history
```

## 🔧 Available Commands

```bash
# Development
npx nx dev stocks-manager           # Start frontend
npx nx serve stocks-manager-api     # Start backend

# Production Build
npx nx build stocks-manager         # Build frontend
npx nx build stocks-manager-api     # Build backend

# Testing
npx nx test stocks-manager-api      # Run backend tests
npx nx e2e stocks-manager-api-e2e   # Run E2E tests

# Utilities
npx nx graph                        # View project dependency graph
npx nx show project stocks-manager  # Show project details
```

## 📚 Documentation

- **[README.md](README.md)** - Main project documentation
- **[API.md](docs/API.md)** - Complete API reference
- **[USER_GUIDE.md](docs/USER_GUIDE.md)** - End-user guide
- **[PLANNING.md](PLANNING.md)** - Technical architecture
- **[TASK.md](TASK.md)** - Development history

## 🆘 Troubleshooting

**MongoDB Connection Issues:**

```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Alternative: Use MongoDB Atlas cloud database
```

**Port Already in Use:**

```bash
# Kill processes using ports 3000 or 3001
npx kill-port 3000 3005
```

**Dependencies Issues:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 🎉 You're Ready!

The Stock Management Website is fully functional and ready for:

- ✅ **Development** - Start coding new features
- ✅ **Testing** - All test frameworks are set up
- ✅ **Production** - Deploy using the deployment guide
- ✅ **User Testing** - Share with users using the user guide

**Happy coding! 📈**
