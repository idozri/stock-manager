'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  IconButton,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { StockDetails } from '@/components/stocks';
import { getStockDetails } from '@/lib/api/stocks';
import { useUser } from '@/contexts/UserContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addStockToPortfolio,
  removeStockFromPortfolioThunk,
  selectIsStockInPortfolio,
} from '@/store/portfolioSlice';

export default function StockDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const symbol = params.symbol as string;

  const {
    data: stockData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stock-details', symbol],
    queryFn: () => getStockDetails(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Check if current stock is in user's portfolio using Redux
  const isInPortfolio = useAppSelector((state) =>
    selectIsStockInPortfolio(state, symbol)
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleAddToPortfolio = async () => {
    try {
      if (!user?.sessionId || !stockData) return;

      const result = await dispatch(
        addStockToPortfolio({
          userId: user.sessionId,
          symbol: stockData.symbol,
          name: stockData.name,
        })
      );

      if (addStockToPortfolio.fulfilled.match(result)) {
        alert('Stock added to portfolio successfully!');
      } else {
        alert(`Error: ${result.payload || 'Failed to add stock'}`);
      }
    } catch (error) {
      console.error('Error adding stock to portfolio:', error);
      alert('Failed to add stock to portfolio');
    }
  };

  const handleRemoveFromPortfolio = async () => {
    try {
      if (!user?.sessionId || !stockData) return;

      const result = await dispatch(
        removeStockFromPortfolioThunk({
          userId: user.sessionId,
          symbol: stockData.symbol,
        })
      );

      if (removeStockFromPortfolioThunk.fulfilled.match(result)) {
        alert('Stock removed from portfolio successfully!');
      } else {
        alert(`Error: ${result.payload || 'Failed to remove stock'}`);
      }
    } catch (error) {
      console.error('Error removing stock from portfolio:', error);
      alert('Failed to remove stock from portfolio');
    }
  };

  if (!symbol) {
    return (
      <Box p={3}>
        <Alert severity="error">Invalid stock symbol</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        borderBottom={1}
        borderColor="divider"
      >
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {isLoading
              ? 'Loading...'
              : stockData?.symbol || symbol.toUpperCase()}
          </Typography>
        </Box>

        {stockData &&
          user?.sessionId &&
          (isInPortfolio ? (
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleRemoveFromPortfolio}
              color="error"
            >
              Remove from Portfolio
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddToPortfolio}
              color="primary"
            >
              Add to Portfolio
            </Button>
          ))}
      </Box>

      {/* Content */}
      {isLoading && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box p={3}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            {error instanceof Error
              ? error.message
              : 'Failed to load stock details'}
          </Alert>
        </Box>
      )}

      {stockData && !isLoading && (
        <StockDetails
          data={stockData}
          isLoading={isLoading}
          error={error instanceof Error ? error.message : undefined}
        />
      )}
    </Box>
  );
}
