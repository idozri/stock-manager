'use client';

import { Box, TextField, Typography, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { StockDto } from '@stocks-manager/interfaces';
import { useUser } from '@/contexts/UserContext';
import { StockCard } from '../stocks/StockCard';
import { usePortfolioActions } from '@/lib/hooks/usePortfolioActions';
import { useAppSelector } from '@/store/hooks';
import {
  selectPortfolioError,
  selectPortfolioLoading,
  selectPortfolioStocks,
} from '@/store/portfolioSlice';

export default function StockList() {
  const { handleRemoveFromPortfolio } = usePortfolioActions();

  // Selectors
  const stocks = useAppSelector(selectPortfolioStocks);
  const stocksLoading = useAppSelector(selectPortfolioLoading);
  const error = useAppSelector(selectPortfolioError);

  const [search, setSearch] = useState('');
  const { user } = useUser();

  // If no user (shouldn't happen since homepage handles this), show loading
  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const filtered = (stocks || []).filter((s) =>
    s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Hey {user.userName}, your stock portfolio 📈
      </Typography>

      <TextField
        label="Search stocks"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by symbol (e.g. AAPL, GOOGL)"
        sx={{ mb: 3 }}
      />

      {stocksLoading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
          <Typography ml={2} color="text.secondary">
            Loading your stocks...
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" variant="body1" textAlign="center" py={4}>
          Error loading stocks. Please try again later.
        </Typography>
      )}

      {!stocksLoading && !error && stocks && stocks.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            No stocks in your portfolio yet 🤔
          </Typography>
          <Typography color="text.secondary">
            Add some stocks to get started!
          </Typography>
        </Box>
      )}

      <Box display="flex" gap={2} flexWrap="wrap">
        {filtered.map((stock: StockDto) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            onRemoveFromPortfolio={handleRemoveFromPortfolio}
            showAddRemoveButton
            isInPortfolio
          />
        ))}
      </Box>
    </Box>
  );
}
