import { Module } from '@nestjs/common';
import { GetUserStocksRequestDto } from './interfaces/stocks/get-user-stocks-request.dto';
import { AddUserStocksRequestDto } from './interfaces/stocks/add-user-stocks-request.dto';
import { StockDto } from './interfaces/stocks/stock.dto';
import { StockQuoteDto } from './interfaces/stocks/stock-quote.dto';
import { CompanyProfileDto } from './interfaces/stocks/company-profile.dto';
import { PortfolioStockDto } from './interfaces/portfolio/portfolio.dto';
import { UserSessionDto } from './interfaces/user/user-session.dto';

@Module({
  providers: [
    GetUserStocksRequestDto,
    AddUserStocksRequestDto,
    StockDto,
    StockQuoteDto,
    CompanyProfileDto,
    PortfolioStockDto,
    UserSessionDto,
  ],
  exports: [
    GetUserStocksRequestDto,
    AddUserStocksRequestDto,
    StockDto,
    StockQuoteDto,
    CompanyProfileDto,
    PortfolioStockDto,
    UserSessionDto,
  ],
})
export class StocksManagerInterfacesModule {}
