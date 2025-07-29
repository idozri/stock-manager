# Stock Management Website

A comprehensive stock portfolio management application built with Next.js, NestJS, and MongoDB. Track your stock portfolio, view real-time market data, and get detailed stock information.

## 🎯 Features

- **Portfolio Management**: Add and remove stocks from your personal portfolio
- **Real-time Market Data**: View most active stocks, top gainers, and biggest losers
- **Stock Details**: Get comprehensive information about individual stocks
- **Stock Search**: Search for stocks by symbol or company name
- **User Sessions**: Simple session-based user management
- **Responsive Design**: Modern UI with Material-UI components

## 🏗️ Architecture

This is an Nx monorepo containing:

- **Frontend**: Next.js 15 application with TypeScript and Material-UI
- **Backend**: NestJS API with MongoDB and Financial Modeling Prep integration
- **Shared Library**: Common interfaces and types
- **E2E Tests**: End-to-end testing suite

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local instance or MongoDB Atlas)
- Financial Modeling Prep API key (optional - uses demo key if not provided)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd stocks-manager
npm install
```

### 2. Environment Setup

Create environment files from the examples:

```bash
# Frontend environment
cp apps/stocks-manager/.env.example apps/stocks-manager/.env.local

# Backend environment
cp apps/stocks-manager-api/.env.example apps/stocks-manager-api/.env
```

### 3. Configure Environment Variables

**Frontend** (`apps/stocks-manager/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** (`apps/stocks-manager-api/.env`):

```env
# Database
MONGO_URI=mongodb://localhost:27017/stocks-manager

# Financial Modeling Prep API (optional)
FMP_API_KEY=your_fmp_api_key_here

# Server
PORT=3001
```

### 4. Start MongoDB

Start your local MongoDB instance:

```bash
# Using MongoDB Community Edition
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the Application

Start both frontend and backend:

```bash
# Start backend API (runs on port 3001)
npx nx serve stocks-manager-api

# Start frontend (runs on port 3000)
npx nx dev stocks-manager
```

Visit `http://localhost:3000` to access the application.

## 📚 Available Scripts

### Development

```bash
# Start frontend development server
npx nx dev stocks-manager

# Start backend development server
npx nx serve stocks-manager-api

# Run both simultaneously
npm run dev
```

### Building

```bash
# Build frontend for production
npx nx build stocks-manager

# Build backend for production
npx nx build stocks-manager-api

# Build all projects
npx nx run-many -t build
```

### Testing

```bash
# Run unit tests
npx nx test stocks-manager-api

# Run E2E tests
npx nx e2e stocks-manager-api-e2e

# Run all tests
npx nx run-many -t test
```

## 🗃️ Project Structure

```
stocks-manager/
├── apps/
│   ├── stocks-manager/              # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/                 # App router pages and API routes
│   │   │   ├── components/          # React components
│   │   │   ├── contexts/            # React contexts (UserContext)
│   │   │   ├── lib/                 # Utilities and API clients
│   │   │   └── store/              # Redux store and slices
│   │   └── public/                  # Static assets
│   ├── stocks-manager-api/          # NestJS backend application
│   │   └── src/
│   │       ├── app/                 # Application module
│   │       │   └── stocks/          # Stock-related services and controllers
│   │       └── main.ts              # Application entry point
│   └── stocks-manager-api-e2e/      # E2E tests
├── libs/
│   └── interfaces/                  # Shared TypeScript interfaces
│       └── src/lib/interfaces/      # Interface definitions
└── docs/                           # Documentation files
```

## 🎮 Usage Guide

### Getting Started

1. **First Visit**: When you first open the app, you'll be prompted to enter your name
2. **Navigation**: Use the sidebar to navigate between Portfolio and Dashboard
3. **Portfolio**: View and manage your personal stock portfolio
4. **Dashboard**: Explore market data with different tabs:
   - Most Active: Stocks with highest trading volume
   - Top Gainers: Best performing stocks today
   - Biggest Losers: Worst performing stocks today
   - Search: Find specific stocks

### Managing Your Portfolio

- **Add Stocks**: Click the green "+" button on any stock card
- **Remove Stocks**: Click the red delete button on stocks in your portfolio
- **View Details**: Click on any stock card to see detailed information
- **Stock Details**: From the detail page, you can add/remove stocks from your portfolio

### User Sessions

- Your portfolio is tied to a session stored in your browser
- Use the "Logout" button to clear your session and start fresh
- Sessions persist across browser refreshes

## 🔧 Configuration

### API Integration

The app uses Financial Modeling Prep API for stock data:

- **Demo Mode**: Works without an API key (limited data)
- **Full Access**: Sign up at [Financial Modeling Prep](https://financialmodelingprep.com/) for an API key

### Database

MongoDB is used to store:

- User portfolios and sessions
- Cached stock data for performance

### Environment Variables

| Variable              | Description                     | Default                                    |
| --------------------- | ------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Backend API URL                 | `http://localhost:3001`                    |
| `MONGO_URI`           | MongoDB connection string       | `mongodb://localhost:27017/stocks-manager` |
| `FMP_API_KEY`         | Financial Modeling Prep API key | `demo`                                     |
| `PORT`                | Backend server port             | `3001`                                     |

## 🚀 Deployment

### Production Build

```bash
# Build all applications
npx nx run-many -t build

# The built applications will be in:
# - apps/stocks-manager/.next/ (frontend)
# - apps/stocks-manager-api/dist/ (backend)
```

### Deployment Options

**Frontend (Next.js)**:

- Vercel (recommended)
- Netlify
- Any Node.js hosting service

**Backend (NestJS)**:

- Railway
- Render
- Heroku
- Any Node.js hosting service

**Database**:

- MongoDB Atlas (cloud)
- Local MongoDB instance

### Environment Setup for Production

1. Set up MongoDB Atlas or ensure MongoDB is accessible
2. Get a Financial Modeling Prep API key for full functionality
3. Update environment variables for your hosting platform
4. Ensure CORS is configured for your frontend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify environment variables are set correctly
4. Check that both frontend and backend are running

For more detailed API documentation, see [API Documentation](docs/API.md).
