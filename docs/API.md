# Stock Management API Documentation

This document outlines all available API endpoints for the Stock Management backend service.

## Base URL

- **Development**: `http://localhost:3005`
- **Production**: Your deployed backend URL

## Authentication

The API uses simple session-based authentication. All requests require a session ID in the request body or as a query parameter.

## Portfolio Endpoints

### Get User Portfolio

Get all stocks in a user's portfolio.

- **URL**: `/stocks/portfolio`
- **Method**: `GET`
- **Query Parameters**:
  - `sessionId` (string, required): User's session ID

**Success Response (200)**:

```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "currentPrice": 150.25,
    "change": 2.5,
    "changePercent": 1.69,
    "addedAt": "2024-12-01T10:30:00.000Z"
  }
]
```

### Add Stock to Portfolio

Add a stock to the user's portfolio.

- **URL**: `/stocks/portfolio`
- **Method**: `POST`
- **Body**:

```json
{
  "sessionId": "user_session_id",
  "symbol": "AAPL"
}
```

**Success Response (201)**:

```json
{
  "message": "Stock added to portfolio successfully",
  "stock": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "currentPrice": 150.25,
    "change": 2.5,
    "changePercent": 1.69
  }
}
```

### Remove Stock from Portfolio

Remove a stock from the user's portfolio.

- **URL**: `/stocks/portfolio`
- **Method**: `DELETE`
- **Body**:

```json
{
  "sessionId": "user_session_id",
  "symbol": "AAPL"
}
```

**Success Response (200)**:

```json
{
  "message": "Stock removed from portfolio successfully"
}
```

## Stock Data Endpoints

### Get Stock Details

Get detailed information about a specific stock including quote and company profile.

- **URL**: `/stocks/details/:symbol`
- **Method**: `GET`
- **Parameters**:
  - `symbol` (string, required): Stock symbol (e.g., "AAPL")

**Success Response (200)**:

```json
{
  "quote": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 150.25,
    "changesPercentage": 1.69,
    "change": 2.5,
    "dayLow": 148.5,
    "dayHigh": 152.0,
    "yearHigh": 182.94,
    "yearLow": 124.17,
    "marketCap": 2389876543210,
    "priceAvg50": 145.3,
    "priceAvg200": 140.75,
    "volume": 45678901,
    "avgVolume": 52000000,
    "exchange": "NASDAQ",
    "open": 149.75,
    "previousClose": 147.75,
    "eps": 6.05,
    "pe": 24.83,
    "sharesOutstanding": 15908118016,
    "timestamp": 1633024800
  },
  "profile": {
    "symbol": "AAPL",
    "companyName": "Apple Inc.",
    "currency": "USD",
    "exchange": "NASDAQ Global Select",
    "exchangeShortName": "NASDAQ",
    "sector": "Technology",
    "industry": "Consumer Electronics",
    "website": "https://www.apple.com",
    "description": "Apple Inc. designs, manufactures, and markets smartphones...",
    "ceo": "Timothy D. Cook",
    "fullTimeEmployees": "154000",
    "city": "Cupertino",
    "state": "CA",
    "country": "US"
  }
}
```

### Search Stocks

Search for stocks by symbol or company name.

- **URL**: `/stocks/search`
- **Method**: `GET`
- **Query Parameters**:
  - `query` (string, required): Search term (symbol or company name)
  - `limit` (number, optional): Number of results to return (default: 10)

**Success Response (200)**:

```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "currency": "USD",
    "stockExchange": "NASDAQ Global Select",
    "exchangeShortName": "NASDAQ"
  },
  {
    "symbol": "AAPLW",
    "name": "Apple Inc. Warrants",
    "currency": "USD",
    "stockExchange": "NASDAQ Global Select",
    "exchangeShortName": "NASDAQ"
  }
]
```

## Market Data Endpoints

### Get Most Active Stocks

Get the most actively traded stocks.

- **URL**: `/stocks/market/actives`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (number, optional): Number of results to return (default: 10)

**Success Response (200)**:

```json
[
  {
    "symbol": "TSLA",
    "name": "Tesla, Inc.",
    "change": 15.25,
    "price": 245.67,
    "changesPercentage": 6.61
  }
]
```

### Get Top Gainers

Get the top gaining stocks for the day.

- **URL**: `/stocks/market/gainers`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (number, optional): Number of results to return (default: 10)

**Success Response (200)**:

```json
[
  {
    "symbol": "XYZ",
    "name": "XYZ Corp",
    "change": 25.5,
    "price": 125.75,
    "changesPercentage": 25.45
  }
]
```

### Get Biggest Losers

Get the biggest losing stocks for the day.

- **URL**: `/stocks/market/losers`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (number, optional): Number of results to return (default: 10)

**Success Response (200)**:

```json
[
  {
    "symbol": "ABC",
    "name": "ABC Corp",
    "change": -15.25,
    "price": 45.3,
    "changesPercentage": -25.15
  }
]
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Stock not found",
  "error": "Not Found"
}
```

### 429 Too Many Requests

```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "ThrottlerException"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default**: 100 requests per minute per IP
- **Rate limit headers** are included in responses:
  - `X-RateLimit-Limit`: Request limit per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the window resets

## Caching

Stock data is cached for performance:

- **Stock quotes**: 5 minutes TTL
- **Company profiles**: 1 hour TTL
- **Market data**: 5 minutes TTL

## Data Sources

- **Stock Data**: Financial Modeling Prep API
- **Real-time Quotes**: Updated every 5 minutes during market hours
- **Company Information**: Cached and updated daily

## SDK/Client Libraries

For frontend integration, use the provided API client:

```typescript
import { stocksApi } from '@/lib/api/stocks';

// Get portfolio
const portfolio = await stocksApi.getPortfolio(sessionId);

// Add stock to portfolio
await stocksApi.addToPortfolio(sessionId, 'AAPL');

// Get stock details
const details = await stocksApi.getStockDetails('AAPL');
```

## Testing

Use the following tools to test the API:

- **Postman Collection**: Available in `/docs/postman/`
- **OpenAPI/Swagger**: Available at `/api/docs` (if enabled)
- **Unit Tests**: Run with `npx nx test stocks-manager-api`
- **E2E Tests**: Run with `npx nx e2e stocks-manager-api-e2e`
