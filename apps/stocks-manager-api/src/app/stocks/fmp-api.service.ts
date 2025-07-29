import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { StockQuoteDto, CompanyProfileDto } from '@stocks-manager/interfaces';

// Type aliases for backward compatibility
export type StockQuote = StockQuoteDto;
export type CompanyProfile = CompanyProfileDto;

@Injectable()
export class FmpApiService {
  private readonly logger = new Logger(FmpApiService.name);
  private readonly baseUrl = 'https://financialmodelingprep.com/api/v3';
  private readonly apiKey: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService
  ) {
    this.apiKey = this.configService.get<string>('FMP_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn(
        'FMP_API_KEY not found in environment variables. Using demo key.'
      );
      this.apiKey = 'demo'; // Demo key for testing - has limitations
    }
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const url = `${this.baseUrl}/quote/${symbol.toUpperCase()}?apikey=${
        this.apiKey
      }`;
      const response = await firstValueFrom(this.httpService.get(url));

      const data = response.data;

      if (!data || data.length === 0) {
        throw new HttpException(
          `No data found for symbol ${symbol}`,
          HttpStatus.NOT_FOUND
        );
      }

      return data[0];
    } catch (error: any) {
      this.logger.error(`Error fetching stock quote for ${symbol}:`, error);
      if (error.response) {
        throw new HttpException(
          `Failed to fetch stock quote for ${symbol}: ${error.response.statusText}`,
          error.response.status
        );
      }
      throw error;
    }
  }

  async getMultipleStockQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const symbolsString = symbols.map((s) => s.toUpperCase()).join(',');
      const url = `${this.baseUrl}/quote/${symbolsString}?apikey=${this.apiKey}`;
      const response = await firstValueFrom(this.httpService.get(url));

      const data = response.data;
      return data || [];
    } catch (error) {
      this.logger.error('Error fetching multiple stock quotes:', error);
      throw error;
    }
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    try {
      const url = `${this.baseUrl}/profile/${symbol.toUpperCase()}?apikey=${
        this.apiKey
      }`;
      const response = await firstValueFrom(this.httpService.get(url));

      const data = response.data;

      if (!data || data.length === 0) {
        throw new HttpException(
          `No profile data found for symbol ${symbol}`,
          HttpStatus.NOT_FOUND
        );
      }

      return data[0];
    } catch (error) {
      this.logger.error(`Error fetching company profile for ${symbol}:`, error);
      throw error;
    }
  }

  async searchStocks(query: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/search?query=${encodeURIComponent(
        query
      )}&limit=10&apikey=${this.apiKey}`;

      const response = await firstValueFrom(this.httpService.get(url));

      const data = response.data;
      return data || [];
    } catch (error) {
      this.logger.error('Error searching stocks:', error);
      throw error;
    }
  }

  async getMostActiveStocks(): Promise<StockQuote[]> {
    try {
      const url = `${this.baseUrl}/stock_market/actives?apikey=${this.apiKey}`;
      const response = await firstValueFrom(this.httpService.get(url));

      const data = response.data;
      return data || [];
    } catch (error) {
      this.logger.error('Error fetching most active stocks:', error);
      throw error;
    }
  }

  async getTopGainersStocks(): Promise<StockQuote[]> {
    try {
      const url = `${this.baseUrl}/stock_market/gainers?apikey=${this.apiKey}`;
      const response = await firstValueFrom(this.httpService.get(url));

      const data = response.data;
      return data || [];
    } catch (error) {
      this.logger.error('Error fetching top gainers stocks:', error);
      throw error;
    }
  }

  async getBiggestLosersStocks(): Promise<StockQuote[]> {
    try {
      const url = `${this.baseUrl}/stock_market/losers?apikey=${this.apiKey}`;
      const response = await firstValueFrom(this.httpService.get(url));

      const data = response.data;
      return data || [];
    } catch (error) {
      this.logger.error('Error fetching biggest losers stocks:', error);
      throw error;
    }
  }
}
