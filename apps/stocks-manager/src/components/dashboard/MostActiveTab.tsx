import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { StockCard } from '../stocks/StockCard';
import { getMostActiveStocks } from '../../lib/api/stocks';

interface MostActiveTabProps {
  isActive: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onAddToPortfolio: (symbol: string, name: string) => void;
  onRemoveFromPortfolio: (symbol: string) => void;
  isStockInPortfolio: (symbol: string) => boolean;
  itemsPerPage: number;
}

export const MostActiveTab: React.FC<MostActiveTabProps> = ({
  isActive,
  currentPage,
  onPageChange,
  onAddToPortfolio,
  onRemoveFromPortfolio,
  isStockInPortfolio,
  itemsPerPage,
}) => {
  const {
    data: stocks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['mostActiveStocks'],
    queryFn: getMostActiveStocks,
    enabled: isActive, // Only fetch when tab is active
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const paginatedData = useMemo(() => {
    if (!stocks) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return stocks.slice(startIndex, endIndex);
  }, [stocks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil((stocks?.length || 0) / itemsPerPage);

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error instanceof Error
          ? error.message
          : 'Failed to load most active stocks'}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {paginatedData.map((stock, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            key={`${stock.symbol}-${index}`}
          >
            <StockCard
              stock={stock}
              onAddToPortfolio={onAddToPortfolio}
              onRemoveFromPortfolio={onRemoveFromPortfolio}
              showAddRemoveButton
              isInPortfolio={isStockInPortfolio(stock.symbol)}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {paginatedData.length === 0 && !isLoading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No most active stocks data available.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
