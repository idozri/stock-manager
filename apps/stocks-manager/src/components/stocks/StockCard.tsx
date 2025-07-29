import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { StockDto } from '@stocks-manager/interfaces';

interface StockCardProps {
  stock: StockDto;
  onAddToPortfolio?: (symbol: string, name: string) => void;
  onRemoveFromPortfolio?: (symbol: string) => void;
  showAddRemoveButton?: boolean;
  isInPortfolio?: boolean; // Whether the stock is already in the portfolio
  isSearchResult?: boolean; // New prop to indicate if this is a search result
  onClick?: (symbol: string) => void; // Optional custom click handler
  clickable?: boolean; // Whether the card should be clickable
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onAddToPortfolio,
  onRemoveFromPortfolio,
  showAddRemoveButton = false,
  isInPortfolio = false,
  isSearchResult = false,
  onClick,
  clickable = true,
}) => {
  const router = useRouter();
  // Add null checks and default values
  const price = stock.price ?? 0;
  const change = stock.change ?? 0;
  const changesPercentage = stock.changesPercentage ?? 0;
  const volume = stock.volume ?? 0;
  const marketCap = stock.marketCap ?? 0;

  const isPositive = change >= 0;
  const changeColor = isPositive ? 'success' : 'error';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const formatNumber = (num: number) => {
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

  const formatVolume = (volume: number) => {
    if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    }
    if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    }
    return volume.toString();
  };

  const handleCardClick = (event: React.MouseEvent) => {
    // Don't trigger navigation if clicking on the add button
    if (
      showAddRemoveButton &&
      (event.target as HTMLElement).closest('button')
    ) {
      return;
    }

    if (onClick) {
      onClick(stock.symbol);
    } else if (clickable) {
      router.push(`/stock/${stock.symbol}`);
    }
  };

  return (
    <Card
      onClick={clickable ? handleCardClick : undefined}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        cursor: clickable ? 'pointer' : 'default',
        '&:hover': {
          transform: clickable ? 'translateY(-2px)' : 'none',
          boxShadow: (theme) =>
            clickable ? theme.shadows[4] : theme.shadows[1],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        {showAddRemoveButton && (onAddToPortfolio || onRemoveFromPortfolio) && (
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            {isInPortfolio ? (
              <Tooltip title="Remove from Portfolio">
                <IconButton
                  size="small"
                  onClick={() => onRemoveFromPortfolio?.(stock.symbol)}
                  sx={{
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Add to Portfolio">
                <IconButton
                  size="small"
                  onClick={() => onAddToPortfolio?.(stock.symbol, stock.name)}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}

        <Box display="flex" alignItems="flex-start" mb={1}>
          <Box flexGrow={1}>
            <Typography variant="h6" component="h3" fontWeight="bold">
              {stock.symbol}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: showAddRemoveButton ? '180px' : '220px',
              }}
            >
              {stock.name || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Show price data for market data, exchange info for search results */}
        {!isSearchResult && stock.price !== undefined ? (
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold" mr={1}>
              ${price.toFixed(2)}
            </Typography>
            <Chip
              icon={<TrendIcon />}
              label={`${isPositive ? '+' : ''}${change.toFixed(2)} (${
                isPositive ? '+' : ''
              }${changesPercentage.toFixed(2)}%)`}
              color={changeColor}
              size="small"
              variant="outlined"
            />
          </Box>
        ) : (
          <Box mb={2}>
            <Typography variant="body1" color="text.secondary">
              Search Result
            </Typography>
            {stock.currency && (
              <Typography variant="body2" color="text.secondary">
                Currency: {stock.currency}
              </Typography>
            )}
          </Box>
        )}

        <Box display="flex" flexDirection="column" gap={1}>
          {/* Show market data for price-enabled stocks */}
          {!isSearchResult && (
            <>
              {volume > 0 && (
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Volume:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatVolume(volume)}
                  </Typography>
                </Box>
              )}

              {marketCap > 0 && (
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Market Cap:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatNumber(marketCap)}
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* Show exchange info (works for both market data and search results) */}
          {(stock.exchange ||
            stock.stockExchange ||
            stock.exchangeShortName) && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Exchange:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {stock.exchange ||
                  stock.exchangeShortName ||
                  stock.stockExchange}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
