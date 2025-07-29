import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { StocksService } from './stocks.service';

@Controller('stocks')
@UseGuards(ThrottlerGuard)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks(@Query('userId') userId: string) {
    if (!userId) {
      return { error: 'userId is required' };
    }
    return this.stocksService.findAllByUser(userId);
  }

  @Post()
  async addStock(
    @Body() body: { userId: string; symbol: string; name?: string }
  ) {
    if (!body.userId || !body.symbol) {
      return { error: 'userId and symbol are required' };
    }
    return this.stocksService.addStock(body.userId, body.symbol, body.name);
  }

  @Delete()
  async deleteStock(
    @Query('userId') userId: string,
    @Query('symbol') symbol: string
  ) {
    if (!userId || !symbol) {
      return { error: 'userId and symbol are required' };
    }
    return this.stocksService.removeStock(userId, symbol);
  }

  @Post('refresh')
  async refreshStockPrices(@Body() body: { userId: string }) {
    if (!body.userId) {
      return { error: 'userId is required' };
    }
    return this.stocksService.refreshAllStockPrices(body.userId);
  }

  @Get('search')
  async searchStocks(@Query('q') query: string) {
    if (!query) {
      return { error: 'query parameter q is required' };
    }
    return this.stocksService.searchStocks(query);
  }

  @Get('quote/:symbol')
  async getStockQuote(@Query('symbol') symbol: string) {
    if (!symbol) {
      return { error: 'symbol is required' };
    }
    // This will return cached data if available
    return this.stocksService['getStockDataWithCache'](symbol);
  }

  @Get('market/actives')
  async getMostActiveStocks() {
    return this.stocksService.getMostActiveStocks();
  }

  @Get('market/gainers')
  async getTopGainersStocks() {
    return this.stocksService.getTopGainersStocks();
  }

  @Get('market/losers')
  async getBiggestLosersStocks() {
    return this.stocksService.getBiggestLosersStocks();
  }

  @Get('details/:symbol')
  async getStockDetails(@Param('symbol') symbol: string) {
    if (!symbol) {
      return { error: 'symbol is required' };
    }
    return this.stocksService.getStockDetails(symbol);
  }
}
