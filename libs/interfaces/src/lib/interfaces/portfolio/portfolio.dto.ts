import { StockDto } from '../stocks/stock.dto';

export interface PortfolioState {
  stocks: StockDto[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}
