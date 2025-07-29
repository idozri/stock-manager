import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class StockQuoteDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  changesPercentage: number;

  @IsNumber()
  @IsNotEmpty()
  change: number;

  @IsNumber()
  @IsNotEmpty()
  dayLow: number;

  @IsNumber()
  @IsNotEmpty()
  dayHigh: number;

  @IsNumber()
  @IsNotEmpty()
  yearHigh: number;

  @IsNumber()
  @IsNotEmpty()
  yearLow: number;

  @IsNumber()
  @IsNotEmpty()
  marketCap: number;

  @IsNumber()
  @IsNotEmpty()
  priceAvg50: number;

  @IsNumber()
  @IsNotEmpty()
  priceAvg200: number;

  @IsNumber()
  @IsNotEmpty()
  volume: number;

  @IsNumber()
  @IsNotEmpty()
  avgVolume: number;

  @IsString()
  @IsNotEmpty()
  exchange: string;

  @IsNumber()
  @IsNotEmpty()
  open: number;

  @IsNumber()
  @IsNotEmpty()
  previousClose: number;

  @IsNumber()
  @IsNotEmpty()
  eps: number;

  @IsNumber()
  @IsNotEmpty()
  pe: number;

  @IsString()
  @IsNotEmpty()
  earningsAnnouncement: string;

  @IsNumber()
  @IsNotEmpty()
  sharesOutstanding: number;

  @IsNumber()
  @IsNotEmpty()
  timestamp: number;
}
