import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { Stock } from './stock.schema';
import { FmpApiService, StockQuote } from './fmp-api.service';

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    @InjectModel(Stock.name) private stockModel: Model<Stock>,
    private fmpApiService: FmpApiService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getAllStocks(): Promise<Stock[]> {
    return this.stockModel.find().exec();
  }

  async findAllByUser(userId: string): Promise<any[]> {
    try {
      // Get user's stocks from database
      const userStocks = await this.stockModel.find({ userId }).exec();

      if (userStocks.length === 0) {
        return [];
      }

      // Update stock prices from API (with caching)
      const updatedStocks = await Promise.all(
        userStocks.map(async (stock) => {
          try {
            const updatedData = await this.getStockDataWithCache(stock.symbol);
            if (updatedData) {
              // Update the stock in database with fresh data
              await this.stockModel.updateOne(
                { _id: stock._id },
                {
                  price: updatedData.price,
                  changePercent: updatedData.changesPercentage,
                  change: updatedData.change,
                  exchange: updatedData.exchange,
                  marketCap: updatedData.marketCap,
                  volume: updatedData.volume,
                  lastUpdated: new Date(),
                }
              );

              return {
                ...stock.toObject(),
                price: updatedData.price,
                changePercent: updatedData.changesPercentage,
                change: updatedData.change,
                exchange: updatedData.exchange,
                marketCap: updatedData.marketCap,
                volume: updatedData.volume,
                lastUpdated: new Date(),
              };
            }
            return stock.toObject();
          } catch (error) {
            this.logger.warn(
              `Failed to update stock data for ${stock.symbol}:`,
              error
            );
            return stock.toObject();
          }
        })
      );

      return updatedStocks;
    } catch (error) {
      this.logger.error('Error fetching user stocks:', error);
      throw new HttpException(
        'Failed to fetch user stocks',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addStock(
    userId: string,
    symbol: string,
    name?: string
  ): Promise<Stock> {
    try {
      // Check if stock already exists for this user
      const existingStock = await this.stockModel.findOne({
        userId,
        symbol: symbol.toUpperCase(),
      });
      if (existingStock) {
        throw new HttpException(
          `Stock ${symbol} already exists in portfolio`,
          HttpStatus.CONFLICT
        );
      }

      // Fetch initial stock data from API
      let stockData: StockQuote | null = null;
      try {
        stockData = await this.fmpApiService.getStockQuote(symbol);
      } catch (error) {
        this.logger.warn(`Could not fetch initial data for ${symbol}:`, error);
      }

      // Create stock with API data or defaults
      const stockDoc = await this.stockModel.create({
        userId,
        symbol: symbol.toUpperCase(),
        name: name || stockData?.name || symbol.toUpperCase(),
        price: stockData?.price || 0,
        changePercent: stockData?.changesPercentage || 0,
        change: stockData?.change || 0,
        exchange: stockData?.exchange,
        marketCap: stockData?.marketCap,
        volume: stockData?.volume,
        lastUpdated: new Date(),
      });

      return stockDoc;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error adding stock ${symbol}:`, error);
      throw new HttpException(
        'Failed to add stock to portfolio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async removeStock(userId: string, symbol: string) {
    try {
      const result = await this.stockModel
        .deleteOne({
          userId,
          symbol: symbol.toUpperCase(),
        })
        .exec();

      if (result.deletedCount === 0) {
        throw new HttpException(
          `Stock ${symbol} not found in portfolio`,
          HttpStatus.NOT_FOUND
        );
      }

      return { message: `Stock ${symbol} removed from portfolio` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error removing stock ${symbol}:`, error);
      throw new HttpException(
        'Failed to remove stock from portfolio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async refreshAllStockPrices(userId: string): Promise<Stock[]> {
    try {
      const userStocks = await this.stockModel.find({ userId }).exec();

      if (userStocks.length === 0) {
        return [];
      }

      // Clear cache for these stocks to force fresh data
      await Promise.all(
        userStocks.map((stock) =>
          this.cacheManager.del(`stock:${stock.symbol}`)
        )
      );

      // Fetch fresh data for all stocks
      return this.findAllByUser(userId);
    } catch (error) {
      this.logger.error('Error refreshing stock prices:', error);
      throw new HttpException(
        'Failed to refresh stock prices',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchStocks(query: string): Promise<any[]> {
    console.log('searchStocks', query);
    try {
      const cacheKey = `search:${query.toLowerCase()}`;
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) {
        return cached as any[];
      }

      const results = await this.fmpApiService.searchStocks(query);

      // Cache search results for 10 minutes
      await this.cacheManager.set(cacheKey, results, 600);

      return results;
    } catch (error) {
      this.logger.error(`Error searching stocks with query "${query}":`, error);
      throw new HttpException(
        'Failed to search stocks',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async getStockDataWithCache(
    symbol: string
  ): Promise<StockQuote | null> {
    try {
      const cacheKey = `stock:${symbol}`;
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) {
        return cached as StockQuote;
      }

      const stockData = await this.fmpApiService.getStockQuote(symbol);

      // Cache for 5 minutes
      await this.cacheManager.set(cacheKey, stockData, this.CACHE_TTL);

      return stockData;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch cached stock data for ${symbol}:`,
        error
      );
      return null;
    }
  }

  async getMostActiveStocks(): Promise<any[]> {
    try {
      const cacheKey = 'market:actives';
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) {
        return cached as any[];
      }

      const results = await this.fmpApiService.getMostActiveStocks();

      // Cache market data for 5 minutes
      await this.cacheManager.set(cacheKey, results, this.CACHE_TTL);

      return results;
    } catch (error) {
      this.logger.error('Error fetching most active stocks:', error);
      throw new HttpException(
        'Failed to fetch most active stocks',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTopGainersStocks(): Promise<any[]> {
    try {
      const cacheKey = 'market:gainers';
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) {
        return cached as any[];
      }

      const results = await this.fmpApiService.getTopGainersStocks();

      // Cache market data for 5 minutes
      await this.cacheManager.set(cacheKey, results, this.CACHE_TTL);

      return results;
    } catch (error) {
      this.logger.error('Error fetching top gainers stocks:', error);
      throw new HttpException(
        'Failed to fetch top gainers stocks',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBiggestLosersStocks(): Promise<any[]> {
    try {
      const cacheKey = 'market:losers';
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) {
        return cached as any[];
      }

      const results = await this.fmpApiService.getBiggestLosersStocks();

      // Cache market data for 5 minutes
      await this.cacheManager.set(cacheKey, results, this.CACHE_TTL);

      return results;
    } catch (error) {
      this.logger.error('Error fetching biggest losers stocks:', error);
      throw new HttpException(
        'Failed to fetch biggest losers stocks',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getStockDetails(symbol: string): Promise<any> {
    try {
      const cacheKey = `stock-details:${symbol}`;
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) {
        return cached as any;
      }

      // Fetch both quote and company profile data in parallel
      const [quote, profile] = await Promise.allSettled([
        this.fmpApiService.getStockQuote(symbol),
        this.fmpApiService.getCompanyProfile(symbol),
      ]);

      // Handle quote data
      const quoteData = quote.status === 'fulfilled' ? quote.value : null;
      const profileData = profile.status === 'fulfilled' ? profile.value : null;

      if (!quoteData && !profileData) {
        throw new HttpException(
          `No data found for symbol ${symbol}`,
          HttpStatus.NOT_FOUND
        );
      }

      // Combine the data
      const stockDetails = {
        // Quote data (price, trading info)
        symbol: symbol.toUpperCase(),
        name: quoteData?.name || profileData?.companyName || 'N/A',
        price: quoteData?.price || 0,
        change: quoteData?.change || 0,
        changesPercentage: quoteData?.changesPercentage || 0,
        dayLow: quoteData?.dayLow,
        dayHigh: quoteData?.dayHigh,
        yearHigh: quoteData?.yearHigh,
        yearLow: quoteData?.yearLow,
        open: quoteData?.open,
        previousClose: quoteData?.previousClose,
        volume: quoteData?.volume,
        avgVolume: quoteData?.avgVolume,
        marketCap: quoteData?.marketCap,
        priceAvg50: quoteData?.priceAvg50,
        priceAvg200: quoteData?.priceAvg200,
        eps: quoteData?.eps,
        pe: quoteData?.pe,
        sharesOutstanding: quoteData?.sharesOutstanding,
        exchange: quoteData?.exchange || profileData?.exchange,

        // Company profile data
        companyName: profileData?.companyName,
        description: profileData?.description,
        website: profileData?.website,
        industry: profileData?.industry,
        sector: profileData?.sector,
        country: profileData?.country,
        fullTimeEmployees: profileData?.fullTimeEmployees,
        ceo: profileData?.ceo,
        image: profileData?.image,
        ipoDate: profileData?.ipoDate,
        beta: profileData?.beta,
        currency: profileData?.currency,
        exchangeShortName: profileData?.exchangeShortName,

        // Metadata
        lastUpdated: new Date(),
      };

      // Cache for 5 minutes
      await this.cacheManager.set(cacheKey, stockDetails, this.CACHE_TTL);

      return stockDetails;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error fetching stock details for ${symbol}:`, error);
      throw new HttpException(
        'Failed to fetch stock details',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
