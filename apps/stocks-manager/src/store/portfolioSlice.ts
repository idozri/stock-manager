import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PortfolioState } from '@stocks-manager/interfaces';

const initialState: PortfolioState = {
  stocks: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const loadUserStocks = createAsyncThunk(
  'portfolio/loadUserStocks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/stocks?userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load stocks');
      }

      const stocks = await response.json();

      return stocks;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load stocks'
      );
    }
  }
);

export const addStockToPortfolio = createAsyncThunk(
  'portfolio/addStock',
  async (
    { userId, symbol, name }: { userId: string; symbol: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, symbol, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add stock');
      }

      const addedStock = await response.json();
      return addedStock;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to add stock'
      );
    }
  }
);

export const removeStockFromPortfolioThunk = createAsyncThunk(
  'portfolio/removeStock',
  async (
    { userId, symbol }: { userId: string; symbol: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/stocks?userId=${userId}&symbol=${symbol}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove stock');
      }

      return symbol;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to remove stock'
      );
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPortfolio: (state) => {
      state.stocks = [];
      state.lastUpdated = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user stocks
      .addCase(loadUserStocks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserStocks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stocks = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(loadUserStocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Add stock
      .addCase(addStockToPortfolio.pending, (state) => {
        state.error = null;
      })
      .addCase(addStockToPortfolio.fulfilled, (state, action) => {
        // Add the new stock to the portfolio
        state.stocks.push(action.payload);
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(addStockToPortfolio.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Remove stock
      .addCase(removeStockFromPortfolioThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(removeStockFromPortfolioThunk.fulfilled, (state, action) => {
        // Remove the stock from the portfolio
        state.stocks = state.stocks.filter(
          (stock) => stock.symbol.toLowerCase() !== action.payload.toLowerCase()
        );
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(removeStockFromPortfolioThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearPortfolio } = portfolioSlice.actions;

// Selectors
export const selectPortfolioStocks = (state: { portfolio: PortfolioState }) =>
  state.portfolio.stocks;
export const selectPortfolioLoading = (state: { portfolio: PortfolioState }) =>
  state.portfolio.isLoading;
export const selectPortfolioError = (state: { portfolio: PortfolioState }) =>
  state.portfolio.error;
export const selectIsStockInPortfolio = (
  state: { portfolio: PortfolioState },
  symbol: string
) =>
  state.portfolio.stocks.some(
    (stock) => stock.symbol.toLowerCase() === symbol.toLowerCase()
  );

export default portfolioSlice.reducer;
