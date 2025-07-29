import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CompanyProfileDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  beta: string;

  @IsString()
  @IsNotEmpty()
  volAvg: string;

  @IsString()
  @IsNotEmpty()
  mktCap: string;

  @IsString()
  @IsNotEmpty()
  lastDiv: string;

  @IsString()
  @IsNotEmpty()
  range: string;

  @IsNumber()
  @IsNotEmpty()
  changes: number;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  cik: string;

  @IsString()
  @IsNotEmpty()
  isin: string;

  @IsString()
  @IsNotEmpty()
  cusip: string;

  @IsString()
  @IsNotEmpty()
  exchange: string;

  @IsString()
  @IsNotEmpty()
  exchangeShortName: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  ceo: string;

  @IsString()
  @IsNotEmpty()
  sector: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  fullTimeEmployees: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zip: string;

  @IsNumber()
  @IsNotEmpty()
  dcfDiff: number;

  @IsNumber()
  @IsNotEmpty()
  dcf: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  ipoDate: string;

  @IsBoolean()
  @IsNotEmpty()
  defaultImage: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isEtf: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isActivelyTrading: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isAdr: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isFund: boolean;
}
