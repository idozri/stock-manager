import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class StockDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  change?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsNotEmpty()
  changesPercentage?: number;

  @IsNumber()
  @IsOptional()
  volume?: number;

  @IsNumber()
  @IsOptional()
  marketCap?: number;

  @IsString()
  @IsOptional()
  exchange?: string;

  @IsString()
  @IsOptional()
  stockExchange?: string;

  @IsString()
  @IsOptional()
  exchangeShortName?: string;
}
