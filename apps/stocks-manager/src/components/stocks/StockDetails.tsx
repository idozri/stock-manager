import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Avatar,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Business,
  Language,
  Person,
  LocationOn,
  CalendarToday,
} from '@mui/icons-material';

interface StockDetailsProps {
  data: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changesPercentage: number;
    dayLow?: number;
    dayHigh?: number;
    yearHigh?: number;
    yearLow?: number;
    open?: number;
    previousClose?: number;
    volume?: number;
    avgVolume?: number;
    marketCap?: number;
    priceAvg50?: number;
    priceAvg200?: number;
    eps?: number;
    pe?: number;
    sharesOutstanding?: number;
    exchange?: string;

    // Company profile data
    companyName?: string;
    description?: string;
    website?: string;
    industry?: string;
    sector?: string;
    country?: string;
    fullTimeEmployees?: string;
    ceo?: string;
    image?: string;
    ipoDate?: string;
    beta?: string;
    currency?: string;
    exchangeShortName?: string;

    lastUpdated?: string;
  };
  isLoading?: boolean;
  error?: string;
}

export const StockDetails: React.FC<StockDetailsProps> = ({
  data,
  isLoading = false,
  error,
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No stock data available
      </Alert>
    );
  }

  const isPositive = data.change >= 0;
  const changeColor = isPositive ? 'success' : 'error';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A';
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A';
    if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    }
    if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    }
    return volume.toLocaleString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box p={3}>
      {/* Header Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            {data.image && (
              <Avatar
                src={data.image}
                alt={data.companyName || data.name}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
            )}
            <Box flexGrow={1}>
              <Typography variant="h4" fontWeight="bold">
                {data.symbol}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {data.companyName || data.name}
              </Typography>
              {data.exchange && (
                <Chip
                  label={data.exchange}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Box>

          {/* Price Section */}
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h3" fontWeight="bold" mr={2}>
              ${data.price.toFixed(2)}
            </Typography>
            <Chip
              icon={<TrendIcon />}
              label={`${isPositive ? '+' : ''}${data.change.toFixed(2)} (${
                isPositive ? '+' : ''
              }${data.changesPercentage.toFixed(2)}%)`}
              color={changeColor}
              size="medium"
              variant="outlined"
            />
          </Box>

          {data.currency && (
            <Typography variant="body2" color="text.secondary">
              Currency: {data.currency}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Main Content - Two Column Layout */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={3}
        mb={3}
      >
        {/* Trading Information */}
        <Box flex={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trading Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Open
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.open ? `$${data.open.toFixed(2)}` : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Previous Close
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.previousClose
                      ? `$${data.previousClose.toFixed(2)}`
                      : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Day Range
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.dayLow && data.dayHigh
                      ? `$${data.dayLow.toFixed(2)} - $${data.dayHigh.toFixed(
                          2
                        )}`
                      : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    52 Week Range
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.yearLow && data.yearHigh
                      ? `$${data.yearLow.toFixed(2)} - $${data.yearHigh.toFixed(
                          2
                        )}`
                      : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Volume
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatVolume(data.volume)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Avg Volume
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatVolume(data.avgVolume)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Financial Metrics */}
        <Box flex={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Metrics
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Market Cap
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatNumber(data.marketCap)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    P/E Ratio
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.pe ? data.pe.toFixed(2) : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    EPS
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.eps ? `$${data.eps.toFixed(2)}` : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Beta
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.beta || 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    50-Day MA
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.priceAvg50 ? `$${data.priceAvg50.toFixed(2)}` : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    200-Day MA
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.priceAvg200
                      ? `$${data.priceAvg200.toFixed(2)}`
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Company Information */}
      {(data.companyName || data.description || data.sector) && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={3}
            >
              <Box flex={2}>
                {data.description && (
                  <Box mb={2}>
                    <Typography variant="body1">{data.description}</Typography>
                  </Box>
                )}
              </Box>

              <Box flex={1}>
                <Box display="flex" flexDirection="column" gap={2}>
                  {data.sector && (
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Business sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Sector
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {data.sector}
                      </Typography>
                    </Box>
                  )}

                  {data.industry && (
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Business sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Industry
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {data.industry}
                      </Typography>
                    </Box>
                  )}

                  {data.country && (
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Country
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {data.country}
                      </Typography>
                    </Box>
                  )}

                  {data.fullTimeEmployees && (
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Person sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Employees
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {parseInt(data.fullTimeEmployees).toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  {data.ceo && (
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Person sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          CEO
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {data.ceo}
                      </Typography>
                    </Box>
                  )}

                  {data.ipoDate && (
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          IPO Date
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(data.ipoDate)}
                      </Typography>
                    </Box>
                  )}

                  {data.website && (
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Language sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Website
                        </Typography>
                      </Box>
                      <Link
                        href={data.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body1"
                        fontWeight="medium"
                      >
                        {data.website
                          .replace('https://', '')
                          .replace('http://', '')}
                      </Link>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Last Updated */}
      {data.lastUpdated && (
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
