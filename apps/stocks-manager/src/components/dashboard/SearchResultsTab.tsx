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
import { searchStocks } from '../../lib/api/stocks';

interface SearchResultsTabProps {
  searchQuery: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onAddToPortfolio: (symbol: string, name: string) => void;
  onRemoveFromPortfolio: (symbol: string) => void;
  isStockInPortfolio: (symbol: string) => boolean;
  itemsPerPage: number;
}

export const SearchResultsTab: React.FC<SearchResultsTabProps> = ({
  searchQuery,
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
    queryKey: ['searchStocks', searchQuery],
    queryFn: () => searchStocks(searchQuery),
    enabled: searchQuery.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    refetchOnWindowFocus: false,
  });

  const paginatedData = useMemo(() => {
    if (!stocks) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return stocks.slice(startIndex, endIndex);
  }, [stocks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil((stocks?.length || 0) / itemsPerPage);

  if (searchQuery.length <= 2) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          Type at least 3 characters to search for stocks.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error instanceof Error ? error.message : 'Failed to search stocks'}
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
      <Typography variant="h6" sx={{ mb: 2 }}>
        Search Results for "{searchQuery}" ({stocks?.length || 0} results)
      </Typography>

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
              isSearchResult
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

      {paginatedData.length === 0 && !isLoading && stocks && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No stocks found for your search.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
