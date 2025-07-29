import { useUser } from '@/contexts/UserContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addStockToPortfolio,
  removeStockFromPortfolioThunk,
  selectPortfolioStocks,
} from '@/store/portfolioSlice';

export const usePortfolioActions = () => {
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const portfolioStocks = useAppSelector(selectPortfolioStocks);

  const handleAddToPortfolio = async (symbol: string, name: string) => {
    try {
      if (!user?.sessionId) return;

      const result = await dispatch(
        addStockToPortfolio({
          userId: user.sessionId,
          symbol,
          name,
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

  const handleRemoveFromPortfolio = async (symbol: string) => {
    try {
      if (!user?.sessionId) return;

      const result = await dispatch(
        removeStockFromPortfolioThunk({
          userId: user.sessionId,
          symbol,
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

  // Helper function to check if a stock is in portfolio
  const isStockInPortfolio = (symbol: string) => {
    return portfolioStocks.some(
      (stock) => stock.symbol.toLowerCase() === symbol.toLowerCase()
    );
  };

  return {
    handleAddToPortfolio,
    handleRemoveFromPortfolio,
    isStockInPortfolio,
    portfolioStocks,
  };
};
